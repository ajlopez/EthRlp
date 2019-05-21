pragma solidity 0.5.0;

library RlpLibrary {
    function getRlpTotalLength(bytes memory data, uint offset) pure internal returns (uint) {
        byte first = data[offset];
        
        if (first > 0xb7) {
            uint nbytes = uint8(first) - 0xb7;
            uint length;
            
            for (uint k = 0; k < nbytes; k++) {
                length <<= 8;
                length += uint8(data[1 + k + offset]);
            }
            
            return 1 + nbytes + length; 
        }
        
        if (first > 0x80)
            return uint8(first) - 0x80 + 1;
            
        return 1;
    }
    
    function getRlpLength(bytes memory data, uint offset) pure internal returns (uint) {
        byte first = data[offset];
        
        if (first > 0xb7) {
            uint nbytes = uint8(first) - 0xb7;
            uint length;
            
            for (uint k = 0; k < nbytes; k++) {
                length <<= 8;
                length += uint8(data[1 + k + offset]);
            }
            
            return length;
        }
        
        if (first > 0x80)
            return uint8(first) - 0x80;
            
        if (first == 0x80)
            return 0;
            
        return 1;
    }
    
    function getRlpOffset(bytes memory data, uint offset) pure internal returns (uint) {
        return getRlpTotalLength(data, offset) - getRlpLength(data, offset);
    }
}

