// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Treasury.sol";

contract DAOTreasuryTest is Test {
    DAOTreasury public treasury;
    address public user1;

    function setUp() public {
        treasury = new DAOTreasury();
        user1 = makeAddr("user1");
        treasury.setTimelock(address(this));
    }

    function test_ReceiveETH() public {
        uint256 amount = 10 ether;
        
        vm.deal(user1, amount);
        vm.prank(user1);
        (bool success,) = address(treasury).call{value: amount}("");
        
        assertTrue(success);
        assertEq(address(treasury).balance, amount);
    }

    function test_TransferETHOnlyFromSelf() public {
        vm.deal(address(treasury), 10 ether);
        
        vm.prank(user1);
        vm.expectRevert("Only timelock");
        treasury.transferETH(payable(user1), 1 ether);
    }

    function test_TransferETHFromSelf() public {
        uint256 amount = 5 ether;
        vm.deal(address(treasury), 10 ether);
        
        treasury.transferETH(payable(user1), amount);
        
        assertEq(address(treasury).balance, 5 ether);
        assertEq(user1.balance, amount);
    }

    function test_MultipleDeposits() public {
        vm.deal(user1, 100 ether);
        
        for (uint256 i = 1; i <= 5; i++) {
            vm.prank(user1);
            (bool success,) = address(treasury).call{value: i * 1 ether}("");
            assertTrue(success);
        }
        
        assertEq(address(treasury).balance, 15 ether);
    }
}
