pragma solidity 0.5.0;

import "./RlpLibrary.sol";

contract Helper {
    function getRlpTotalLength(bytes memory data, uint offset) public pure returns (uint) {
        return RlpLibrary.getRlpTotalLength(data, offset);
    }
    
    function getRlpLength(bytes memory data, uint offset) public pure returns (uint) {
        return RlpLibrary.getRlpLength(data, offset);
    }
}

