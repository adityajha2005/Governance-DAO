// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Token.sol";

contract GovernanceTokenTest is Test {
    GovernanceToken public token;
    address public owner;
    address public user1;
    address public user2;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate);

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        
        token = new GovernanceToken();
    }

    function test_InitialMint() public view {
        assertEq(token.totalSupply(), 2_000_000e18);
        assertEq(token.balanceOf(owner), 2_000_000e18);
    }

    function test_TokenName() public view {
        assertEq(token.name(), "Governance Token");
        assertEq(token.symbol(), "GOV");
    }

    function test_OwnerCanMint() public {
        uint256 mintAmount = 1_000_000e18;
        token.mint(user1, mintAmount);
        
        assertEq(token.balanceOf(user1), mintAmount);
        assertEq(token.totalSupply(), 3_000_000e18);
    }

    function test_NonOwnerCannotMint() public {
        vm.prank(user1);
        vm.expectRevert();
        token.mint(user2, 1000e18);
    }

    function test_Transfer() public {
        uint256 transferAmount = 100_000e18;
        
        vm.expectEmit(true, true, false, true);
        emit Transfer(owner, user1, transferAmount);
        
        token.transfer(user1, transferAmount);
        
        assertEq(token.balanceOf(user1), transferAmount);
        assertEq(token.balanceOf(owner), 2_000_000e18 - transferAmount);
    }

    function test_Delegation() public {
        token.transfer(user1, 100_000e18);
        
        vm.prank(user1);
        vm.expectEmit(true, true, true, false);
        emit DelegateChanged(user1, address(0), user2);
        
        token.delegate(user2);
        
        assertEq(token.getVotes(user2), 100_000e18);
    }

    function test_SelfDelegation() public {
        token.transfer(user1, 100_000e18);
        
        vm.prank(user1);
        token.delegate(user1);
        
        assertEq(token.getVotes(user1), 100_000e18);
    }

    function test_VotingPowerAfterTransfer() public {
        token.transfer(user1, 100_000e18);
        
        vm.prank(user1);
        token.delegate(user1);
        
        assertEq(token.getVotes(user1), 100_000e18);
        
        vm.prank(user1);
        token.transfer(user2, 50_000e18);
        
        assertEq(token.getVotes(user1), 50_000e18);
    }

    function test_PermitFunctionality() public {
        uint256 privateKey = 0xA11CE;
        address alice = vm.addr(privateKey);
        
        token.transfer(alice, 100_000e18);
        
        uint256 nonce = token.nonces(alice);
        uint256 deadline = block.timestamp + 1 hours;
        
        bytes32 structHash = keccak256(
            abi.encode(
                keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
                alice,
                user1,
                100_000e18,
                nonce,
                deadline
            )
        );
        
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                token.DOMAIN_SEPARATOR(),
                structHash
            )
        );
        
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, digest);
        
        token.permit(alice, user1, 100_000e18, deadline, v, r, s);
        
        assertEq(token.allowance(alice, user1), 100_000e18);
    }
}
