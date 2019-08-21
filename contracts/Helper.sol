pragma solidity 0.5.0;

import "./RlpLibrary.sol";

contract Helper {
    function getRlpTotalLength(bytes memory data, uint offset) public pure returns (uint) {
        return RlpLibrary.getRlpTotalLength(data, offset);
    }
    
    function getRlpLength(bytes memory data, uint offset) public pure returns (uint) {
        return RlpLibrary.getRlpLength(data, offset);
    }
    
    function getRlpOffset(bytes memory data, uint offset) public pure returns (uint) {
        return RlpLibrary.getRlpOffset(data, offset);
    }
    
    function getRlpItem(bytes memory data, uint offset) public pure returns (uint itemOffset, uint itemLength) {
        RlpLibrary.RlpItem memory item = RlpLibrary.getRlpItem(data, offset);
        
        return (item.offset, item.length);
    }
    
    function getRlpNumItems(bytes memory data, uint offset) public pure returns (uint) {
        return RlpLibrary.getRlpNumItems(data, offset);
    }
    
    function getRlpItems(bytes memory data, uint offset) public pure returns (uint[] memory offsets, uint[] memory lengths) {
        RlpLibrary.RlpItem[] memory items = RlpLibrary.getRlpItems(data, offset);
        
        uint nitems = items.length;
        
        offsets = new uint[](nitems);
        lengths = new uint[](nitems);
        
        for (uint k = 0; k < nitems; k++) {
            offsets[k] = items[k].offset;
            lengths[k] = items[k].length;
        }
    }
}

