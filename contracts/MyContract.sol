pragma solidity ^0.4.24;

contract MyContract {
    address public owner;
    uint256 public x;
    address public addr;

    constructor() public {
        owner = msg.sender;
    }

    function incrementX() public {
        x = x + 1;
    }

    function setAddress(address _addr) public {
        addr = _addr;
    }
}