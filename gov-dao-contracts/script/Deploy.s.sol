// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Token.sol";
import "../src/Timelock.sol";
import "../src/DaoLogic.sol";
import "../src/Treasury.sol";

contract DeployDAO is Script {
    uint256 constant MIN_DELAY = 2 days;
    
    GovernanceToken public token;
    DAOTimelock public timelock;
    DAOGovernor public governor;
    DAOTreasury public treasury;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("=== Deploying DAO ===");
        console.log("Deployer:", deployer);
        
        console.log("\n1. Deploying Governance Token...");
        vm.startBroadcast(deployerPrivateKey);
        token = new GovernanceToken();
        vm.stopBroadcast();
        console.log("Token deployed at:", address(token));
        console.log("Initial supply:", token.totalSupply() / 1e18, "tokens");

        console.log("\n2. Deploying Timelock...");
        address[] memory proposers = new address[](1);
        proposers[0] = deployer;
        
        address[] memory executors = new address[](1);
        executors[0] = address(0);
        
        vm.startBroadcast(deployerPrivateKey);
        timelock = new DAOTimelock(MIN_DELAY, proposers, executors);
        vm.stopBroadcast();
        console.log("Timelock deployed at:", address(timelock));
        console.log("Min delay:", MIN_DELAY / 1 days, "days");

        console.log("\n3. Deploying DAO Governor...");
        vm.startBroadcast(deployerPrivateKey);
        governor = new DAOGovernor(IVotes(address(token)), timelock);
        vm.stopBroadcast();
        console.log("Governor deployed at:", address(governor));
        console.log("Voting delay:", governor.votingDelay(), "blocks");
        console.log("Voting period:", governor.votingPeriod(), "blocks");
        console.log("Proposal threshold:", governor.proposalThreshold() / 1e18, "tokens");
        console.log("Quorum:", "4%");

        console.log("\n4. Deploying Treasury...");
        vm.startBroadcast(deployerPrivateKey);
        treasury = new DAOTreasury();
        vm.stopBroadcast();
        console.log("Treasury deployed at:", address(treasury));

        console.log("\n5. Setting up permissions and connections...");
        
        vm.startBroadcast(deployerPrivateKey);
        
        treasury.setTimelock(address(timelock));
        console.log(" Treasury connected to Timelock");

        bytes32 PROPOSER_ROLE = timelock.PROPOSER_ROLE();
        bytes32 CANCELLER_ROLE = timelock.CANCELLER_ROLE();
        bytes32 DEFAULT_ADMIN_ROLE = timelock.DEFAULT_ADMIN_ROLE();
        
        timelock.grantRole(PROPOSER_ROLE, address(governor));
        console.log(" Governor granted PROPOSER_ROLE on Timelock");
        
        timelock.grantRole(CANCELLER_ROLE, address(governor));
        console.log(" Governor granted CANCELLER_ROLE on Timelock");

        timelock.revokeRole(PROPOSER_ROLE, deployer);
        console.log(" Deployer's PROPOSER_ROLE revoked");

        token.transferOwnership(address(timelock));
        console.log(" Token ownership transferred to Timelock");

        timelock.renounceRole(DEFAULT_ADMIN_ROLE, deployer);
        console.log(" Deployer renounced admin role - DAO is now decentralized");

        token.delegate(deployer);
        console.log("\n6. Voting power delegated to deployer");

        vm.stopBroadcast();
        console.log("\n=== Deployment Complete ===");
        console.log("\nContract Addresses:");
        console.log("Token:     ", address(token));
        console.log("Timelock:  ", address(timelock));
        console.log("Governor:  ", address(governor));
        console.log("Treasury:  ", address(treasury));
    }
}
