// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DAOTreasury {
    address public timelock;

    constructor() {
        timelock = address(0);
    }

    function setTimelock(address _timelock) external {
        require(timelock == address(0), "Timelock already set");
        timelock = _timelock;
    }

    receive() external payable {}

    function transferETH(address payable to, uint256 amount) external {
        require(msg.sender == timelock, "Only timelock");
        to.transfer(amount);
    }
}
