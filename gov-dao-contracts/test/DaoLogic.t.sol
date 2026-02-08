// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/DaoLogic.sol";
import "../src/Token.sol";
import "../src/Timelock.sol";
import "../src/Treasury.sol";

contract DAOGovernorTest is Test {
    DAOGovernor public governor;
    GovernanceToken public token;
    DAOTimelock public timelock;
    DAOTreasury public treasury;

    address public owner;
    address public proposer1;
    address public proposer2;
    address public voter1;
    address public voter2;

    uint256 constant MIN_DELAY = 1 days;
    uint256 constant PROPOSAL_THRESHOLD = 1_000e18;
    uint256 constant QUORUM = 4; // 4%

    function setUp() public {
        owner = address(this);
        proposer1 = makeAddr("proposer1");
        proposer2 = makeAddr("proposer2");
        voter1 = makeAddr("voter1");
        voter2 = makeAddr("voter2");

        // Deploy token
        token = new GovernanceToken();

        // Deploy timelock
        address[] memory proposers = new address[](0);
        address[] memory executors = new address[](0);
        timelock = new DAOTimelock(MIN_DELAY, proposers, executors);

        // Deploy governor
        governor = new DAOGovernor(IVotes(address(token)), timelock);

        // Deploy treasury
        treasury = new DAOTreasury();
        treasury.setTimelock(address(timelock));

        // Setup roles
        bytes32 proposerRole = timelock.PROPOSER_ROLE();
        bytes32 executorRole = timelock.EXECUTOR_ROLE();
        bytes32 adminRole = timelock.DEFAULT_ADMIN_ROLE();

        timelock.grantRole(proposerRole, address(governor));
        timelock.grantRole(executorRole, address(0)); // Anyone can execute
        timelock.revokeRole(adminRole, owner);

        // Transfer treasury ownership to timelock
        vm.deal(address(treasury), 100 ether);

        // Distribute tokens and delegate
        token.transfer(proposer1, 2_000e18);
        token.transfer(voter1, 100_000e18);
        token.transfer(voter2, 100_000e18);

        vm.prank(proposer1);
        token.delegate(proposer1);

        vm.prank(voter1);
        token.delegate(voter1);

        vm.prank(voter2);
        token.delegate(voter2);

        // Roll forward to activate votes
        vm.roll(block.number + 1);
    }

    function test_GovernorName() public view {
        assertEq(governor.name(), "DAO Governor");
    }

    function test_VotingDelay() public view {
        assertEq(governor.votingDelay(), 1);
    }

    function test_VotingPeriod() public view {
        assertEq(governor.votingPeriod(), 45_818);
    }

    function test_ProposalThreshold() public view {
        assertEq(governor.proposalThreshold(), PROPOSAL_THRESHOLD);
    }

    function test_QuorumReached() public {
        // 4% of 2M tokens = 80,000
        vm.roll(block.number + 1);
        uint256 blockNumber = block.number - 1;
        assertEq(governor.quorum(blockNumber), 80_000e18);
    }

    function test_CreateProposal() public {
        address[] memory targets = new address[](1);
        targets[0] = address(treasury);

        uint256[] memory values = new uint256[](1);
        values[0] = 0;

        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeWithSignature("transferETH(address,uint256)", proposer1, 1 ether);

        string memory description = "Proposal: Transfer 1 ETH to proposer1";

        vm.prank(proposer1);
        uint256 proposalId = governor.propose(targets, values, calldatas, description);

        assertGt(proposalId, 0);
        assertEq(uint8(governor.state(proposalId)), uint8(IGovernor.ProposalState.Pending));
    }

    function test_CannotCreateProposalBelowThreshold() public {
        address[] memory targets = new address[](1);
        targets[0] = address(treasury);

        uint256[] memory values = new uint256[](1);
        values[0] = 0;

        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeWithSignature("transferETH(address,uint256)", proposer2, 1 ether);

        string memory description = "Test proposal";

        vm.prank(proposer2);
        vm.expectRevert();
        governor.propose(targets, values, calldatas, description);
    }

    function test_VoteForProposal() public {
        uint256 proposalId = _createProposal();

        vm.roll(block.number + governor.votingDelay() + 1);

        vm.prank(voter1);
        governor.castVote(proposalId, 1); // Vote FOR

        (uint256 againstVotes, uint256 forVotes, uint256 abstainVotes) = governor.proposalVotes(proposalId);
        
        assertEq(forVotes, 100_000e18);
        assertEq(againstVotes, 0);
        assertEq(abstainVotes, 0);
    }

    function test_VoteAgainstProposal() public {
        uint256 proposalId = _createProposal();

        vm.roll(block.number + governor.votingDelay() + 1);

        vm.prank(voter1);
        governor.castVote(proposalId, 0); // Vote AGAINST

        (uint256 againstVotes, uint256 forVotes, uint256 abstainVotes) = governor.proposalVotes(proposalId);
        
        assertEq(forVotes, 0);
        assertEq(againstVotes, 100_000e18);
        assertEq(abstainVotes, 0);
    }

    function test_VoteAbstain() public {
        uint256 proposalId = _createProposal();

        vm.roll(block.number + governor.votingDelay() + 1);

        vm.prank(voter1);
        governor.castVote(proposalId, 2); // Vote ABSTAIN

        (uint256 againstVotes, uint256 forVotes, uint256 abstainVotes) = governor.proposalVotes(proposalId);
        
        assertEq(forVotes, 0);
        assertEq(againstVotes, 0);
        assertEq(abstainVotes, 100_000e18);
    }

    function test_ProposalSucceeds() public {
        uint256 proposalId = _createProposal();

        vm.roll(block.number + governor.votingDelay() + 1);

        vm.prank(voter1);
        governor.castVote(proposalId, 1);

        vm.prank(voter2);
        governor.castVote(proposalId, 1);

        vm.roll(block.number + governor.votingPeriod() + 1);

        assertEq(uint8(governor.state(proposalId)), uint8(IGovernor.ProposalState.Succeeded));
    }

    function test_ProposalDefeated() public {
        uint256 proposalId = _createProposal();

        vm.roll(block.number + governor.votingDelay() + 1);

        vm.prank(voter1);
        governor.castVote(proposalId, 0); // Vote AGAINST

        vm.prank(voter2);
        governor.castVote(proposalId, 0); // Vote AGAINST

        vm.roll(block.number + governor.votingPeriod() + 1);

        assertEq(uint8(governor.state(proposalId)), uint8(IGovernor.ProposalState.Defeated));
    }

    function test_QueueProposal() public {
        uint256 proposalId = _createAndPassProposal();

        address[] memory targets = new address[](1);
        targets[0] = address(treasury);

        uint256[] memory values = new uint256[](1);
        values[0] = 0;

        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeWithSignature("transferETH(address,uint256)", proposer1, 1 ether);

        bytes32 descriptionHash = keccak256(bytes("Proposal: Transfer 1 ETH to proposer1"));

        governor.queue(targets, values, calldatas, descriptionHash);

        assertEq(uint8(governor.state(proposalId)), uint8(IGovernor.ProposalState.Queued));
    }

    function test_ExecuteProposal() public {
        uint256 proposalId = _createAndPassProposal();

        address[] memory targets = new address[](1);
        targets[0] = address(treasury);

        uint256[] memory values = new uint256[](1);
        values[0] = 0;

        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeWithSignature("transferETH(address,uint256)", proposer1, 1 ether);

        bytes32 descriptionHash = keccak256(bytes("Proposal: Transfer 1 ETH to proposer1"));

        governor.queue(targets, values, calldatas, descriptionHash);

        vm.warp(block.timestamp + MIN_DELAY + 1);

        uint256 balanceBefore = proposer1.balance;
        
        governor.execute(targets, values, calldatas, descriptionHash);

        assertEq(proposer1.balance, balanceBefore + 1 ether);
        assertEq(uint8(governor.state(proposalId)), uint8(IGovernor.ProposalState.Executed));
    }

    function test_CannotExecuteBeforeDelay() public {
        _createAndPassProposal();

        address[] memory targets = new address[](1);
        targets[0] = address(treasury);

        uint256[] memory values = new uint256[](1);
        values[0] = 0;

        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeWithSignature("transferETH(address,uint256)", proposer1, 1 ether);

        bytes32 descriptionHash = keccak256(bytes("Proposal: Transfer 1 ETH to proposer1"));

        governor.queue(targets, values, calldatas, descriptionHash);

        vm.expectRevert();
        governor.execute(targets, values, calldatas, descriptionHash);
    }

    function test_CastVoteWithReason() public {
        uint256 proposalId = _createProposal();

        vm.roll(block.number + governor.votingDelay() + 1);

        vm.prank(voter1);
        governor.castVoteWithReason(proposalId, 1, "I support this proposal!");

        (uint256 againstVotes, uint256 forVotes, uint256 abstainVotes) = governor.proposalVotes(proposalId);
        assertEq(forVotes, 100_000e18);
    }

    // Helper functions
    function _createProposal() internal returns (uint256) {
        address[] memory targets = new address[](1);
        targets[0] = address(treasury);

        uint256[] memory values = new uint256[](1);
        values[0] = 0;

        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeWithSignature("transferETH(address,uint256)", proposer1, 1 ether);

        string memory description = "Proposal: Transfer 1 ETH to proposer1";

        vm.prank(proposer1);
        return governor.propose(targets, values, calldatas, description);
    }

    function _createAndPassProposal() internal returns (uint256) {
        uint256 proposalId = _createProposal();

        vm.roll(block.number + governor.votingDelay() + 1);

        vm.prank(voter1);
        governor.castVote(proposalId, 1);

        vm.prank(voter2);
        governor.castVote(proposalId, 1);

        vm.roll(block.number + governor.votingPeriod() + 1);

        return proposalId;
    }
}
