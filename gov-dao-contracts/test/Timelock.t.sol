// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Timelock.sol";

contract DAOTimelockTest is Test {
    DAOTimelock public timelock;
    address public proposer;
    address public executor;
    address public admin;

    uint256 constant MIN_DELAY = 2 days;

    function setUp() public {
        proposer = makeAddr("proposer");
        executor = makeAddr("executor");
        admin = address(this);

        address[] memory proposers = new address[](1);
        proposers[0] = proposer;

        address[] memory executors = new address[](1);
        executors[0] = executor;

        timelock = new DAOTimelock(MIN_DELAY, proposers, executors);
    }

    function test_MinDelay() public view {
        assertEq(timelock.getMinDelay(), MIN_DELAY);
    }

    function test_ProposerRole() public view {
        bytes32 proposerRole = timelock.PROPOSER_ROLE();
        assertTrue(timelock.hasRole(proposerRole, proposer));
    }

    function test_ExecutorRole() public view {
        bytes32 executorRole = timelock.EXECUTOR_ROLE();
        assertTrue(timelock.hasRole(executorRole, executor));
    }

    function test_ScheduleOperation() public {
        address target = makeAddr("target");
        uint256 value = 0;
        bytes memory data = "";
        bytes32 predecessor = bytes32(0);
        bytes32 salt = keccak256("test");
        
        vm.prank(proposer);
        timelock.schedule(target, value, data, predecessor, salt, MIN_DELAY);
        
        bytes32 id = timelock.hashOperation(target, value, data, predecessor, salt);
        assertTrue(timelock.isOperationPending(id));
    }

    function test_CannotExecuteBeforeDelay() public {
        address target = makeAddr("target");
        uint256 value = 0;
        bytes memory data = "";
        bytes32 predecessor = bytes32(0);
        bytes32 salt = keccak256("test");
        
        vm.prank(proposer);
        timelock.schedule(target, value, data, predecessor, salt, MIN_DELAY);
        
        vm.prank(executor);
        vm.expectRevert();
        timelock.execute(target, value, data, predecessor, salt);
    }

    function test_ExecuteAfterDelay() public {
        address target = address(new MockTarget());
        uint256 value = 0;
        bytes memory data = abi.encodeWithSignature("doSomething()");
        bytes32 predecessor = bytes32(0);
        bytes32 salt = keccak256("test");
        
        vm.prank(proposer);
        timelock.schedule(target, value, data, predecessor, salt, MIN_DELAY);
        
        vm.warp(block.timestamp + MIN_DELAY);
        
        vm.prank(executor);
        timelock.execute(target, value, data, predecessor, salt);
        
        bytes32 id = timelock.hashOperation(target, value, data, predecessor, salt);
        assertTrue(timelock.isOperationDone(id));
    }
}

contract MockTarget {
    bool public executed;
    
    function doSomething() external {
        executed = true;
    }
}
