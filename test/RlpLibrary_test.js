
const Helper = artifacts.require('./Helper.sol');

const rlp = require('rlp');

function concat(str1, str2) {
    if (str1.startsWith('0x'))
        str1 = str1.substring(2);
    if (str2.startsWith('0x'))
        str2 = str2.substring(2);
    
    return '0x' + str1 + str2;
}

function toHexString(buffer) {
    const text = buffer.toString('hex');
    
    if (text.startsWith('0x'))
        return text;
    
    return '0x' + text;
}

contract('RlpLibrary', function (accounts) {
    beforeEach(async function () {
        this.helper = await Helper.new();
    });
    
    it('get total length 1 from encoded empty array', async function () {
        const data = rlp.encode('');
        const str = toHexString(data);
        const result = await this.helper.getRlpTotalLength(str, 0);
        
        assert.equal(result, 1);
    });
    
    it('get total length 1 from encoded empty array using offset', async function () {
        const data = rlp.encode('');
        const str = concat('0102', toHexString(data));
        const result = await this.helper.getRlpTotalLength(str, 2);
        
        assert.equal(result, 1);
    });
    
    it('get total length 1', async function () {
        const data = rlp.encode('a');
        const str = toHexString(data);
        const result = await this.helper.getRlpTotalLength(str, 0);
        
        assert.equal(result, 1);
    });
    
    it('get total length 1 using offset', async function () {
        const data = rlp.encode('');
        const str = concat('0102', toHexString(data));
        const result = await this.helper.getRlpTotalLength(str, 2);
        
        assert.equal(result, 1);
    });
    
    it('get length 0', async function () {
        const result = await this.helper.getRlpLength('0x80', 0);
        
        assert.equal(result, 0);
    });
    
    it('get length 0 using offset', async function () {
        const result = await this.helper.getRlpLength('0x010280', 2);
        
        assert.equal(result, 0);
    });
    
    it('get length 1', async function () {
        const result = await this.helper.getRlpLength('0x01', 0);
        
        assert.equal(result, 1);
    });
    
    it('get length 1 using offset', async function () {
        const result = await this.helper.getRlpLength('0x800203', 2);
        
        assert.equal(result, 1);
    });
    
    it('process encoded empty array', async function() {
        const data = rlp.encode('');
        const str = toHexString(data);
        
        const length = await this.helper.getRlpLength(data, 0);
        const tlength = await this.helper.getRlpTotalLength(data, 0);
        const offset = await this.helper.getRlpOffset(data, 0);
        
        assert.equal(length, 0);
        assert.equal(tlength, 1);
        assert.equal(offset, 1);
    });
    
    it('process encoded one byte array', async function() {
        const data = rlp.encode('a');
        const str = toHexString(data);
        
        const length = await this.helper.getRlpLength(data, 0);
        const tlength = await this.helper.getRlpTotalLength(data, 0);
        const offset = await this.helper.getRlpOffset(data, 0);
        
        assert.equal(length, 1);
        assert.equal(tlength, 1);
        assert.equal(offset, 0);
    });
    
    it('process encoded two byte array', async function() {
        const data = rlp.encode('ab');
        const str = toHexString(data);
        
        const length = await this.helper.getRlpLength(data, 0);
        const tlength = await this.helper.getRlpTotalLength(data, 0);
        const offset = await this.helper.getRlpOffset(data, 0);
        
        assert.equal(length, 2);
        assert.equal(tlength, 3);
        assert.equal(offset, 1);
    });
});

