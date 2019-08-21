
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
    
    it('get RLP item from encoded empty array', async function () {
        const data = rlp.encode('');
        const str = toHexString(data);

        const result = await this.helper.getRlpItem(str, 0);
        
        assert.equal(result.itemOffset, 1);
        assert.equal(result.itemLength, 0);
    });

    it('get RLP item with one byte', async function () {
        const data = rlp.encode('a');
        const str = toHexString(data);

        const result = await this.helper.getRlpItem(str, 0);
        
        assert.equal(result.itemOffset, 0);
        assert.equal(result.itemLength, 1);
    });
    
    it('get RLP item with two bytes', async function () {
        const data = rlp.encode('aa');
        const str = toHexString(data);

        const result = await this.helper.getRlpItem(str, 0);
        
        assert.equal(result.itemOffset, 1);
        assert.equal(result.itemLength, 2);
    });
    
    it('get RLP item with 56 bytes', async function () {
        let message = '1234567';
        message += message;
        message += message;
        message += message;
        
        assert.equal(message.length, 56);
        
        const data = rlp.encode(message);
        const str = toHexString(data);

        const result = await this.helper.getRlpItem(str, 0);
        
        assert.equal(result.itemOffset, 2);
        assert.equal(result.itemLength, 56);
    });
    
    it('get RLP item with 1024 bytes', async function () {
        let message = '01234567';
        message += message;
        message += message;
        message += message;
        message += message;
        message += message;
        message += message;
        message += message;
        
        assert.equal(message.length, 1024);
        
        const data = rlp.encode(message);
        const str = toHexString(data);

        const result = await this.helper.getRlpItem(str, 0);
        
        assert.equal(result.itemOffset, 3);
        assert.equal(result.itemLength, 1024);
    });
    
    it('get RLP item with 1024 bytes using offset', async function () {
        let message = '01234567';
        message += message;
        message += message;
        message += message;
        message += message;
        message += message;
        message += message;
        message += message;
        
        assert.equal(message.length, 1024);
        
        const data = rlp.encode(message);
        const str = concat('0x010203', toHexString(data));

        const result = await this.helper.getRlpItem(str, 3);
        
        assert.equal(result.itemOffset, 6);
        assert.equal(result.itemLength, 1024);
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
        
        const length = await this.helper.getRlpLength(str, 0);
        const tlength = await this.helper.getRlpTotalLength(str, 0);
        const offset = await this.helper.getRlpOffset(str, 0);
        
        assert.equal(length, 0);
        assert.equal(tlength, 1);
        assert.equal(offset, 1);
    });
    
    it('process encoded one byte array', async function() {
        const data = rlp.encode('a');
        const str = toHexString(data);
        
        const length = await this.helper.getRlpLength(str, 0);
        const tlength = await this.helper.getRlpTotalLength(str, 0);
        const offset = await this.helper.getRlpOffset(str, 0);
        
        assert.equal(length, 1);
        assert.equal(tlength, 1);
        assert.equal(offset, 0);
    });
    
    it('process encoded two byte array', async function() {
        const data = rlp.encode('ab');
        const str = toHexString(data);
        
        const length = await this.helper.getRlpLength(str, 0);
        const tlength = await this.helper.getRlpTotalLength(str, 0);
        const offset = await this.helper.getRlpOffset(str, 0);
        
        assert.equal(length, 2);
        assert.equal(tlength, 3);
        assert.equal(offset, 1);
    });
    
    it('process encoded 56 bytes array', async function() {
        let message = '1234567';
        message += message;
        message += message;
        message += message;
        
        assert.equal(message.length, 56);
        
        const data = rlp.encode(message);
        const str = toHexString(data);
        
        const length = await this.helper.getRlpLength(str, 0);
        const tlength = await this.helper.getRlpTotalLength(str, 0);
        const offset = await this.helper.getRlpOffset(str, 0);
        
        assert.equal(length, message.length);
        assert.equal(tlength, message.length + 2);
        assert.equal(offset, 2);
    });
    
    it('process encoded 1024 bytes array', async function() {
        let message = '01234567';
        message += message;
        message += message;
        message += message;
        message += message;
        message += message;
        message += message;
        message += message;
        
        assert.equal(message.length, 1024);
        
        const data = rlp.encode(message);
        const str = toHexString(data);
        
        const length = await this.helper.getRlpLength(str, 0);
        const tlength = await this.helper.getRlpTotalLength(str, 0);
        const offset = await this.helper.getRlpOffset(str, 0);
        
        assert.equal(length, message.length);
        assert.equal(tlength, message.length + 3);
        assert.equal(offset, 3);
    });
    
    it('process encoded 256*256 bytes array', async function() {
        let message = '01234567';
        message += message;
        message += message;
        message += message;
        message += message;
        message += message;
        message += message;
        message += message;
        message += message;
        message += message;
        message += message;
        message += message;
        message += message;
        message += message;
        
        assert.equal(message.length, 256 * 256);
        
        const data = rlp.encode(message);
        const str = toHexString(data);
        
        const length = await this.helper.getRlpLength(str, 0);
        const tlength = await this.helper.getRlpTotalLength(str, 0);
        const offset = await this.helper.getRlpOffset(str, 0);
        
        assert.equal(length, message.length);
        assert.equal(tlength, message.length + 4);
        assert.equal(offset, 4);
    });
    
    it('process encoded 2*256*256 bytes array', async function() {        
        const str = '0xba020000';
        
        const length = await this.helper.getRlpLength(str, 0);
        const tlength = await this.helper.getRlpTotalLength(str, 0);
        const offset = await this.helper.getRlpOffset(str, 0);
        
        assert.equal(length, 2 * 256 * 256);
        assert.equal(tlength, 2 * 256 * 256 + 4);
        assert.equal(offset, 4);
    });
    
    it('get total length simple list with two short items', async function () {
        const data = rlp.encode(['a', 'b']);
        const str = toHexString(data);

        const result = await this.helper.getRlpTotalLength(str, 0);
        
        assert.equal(result, 3);
    });
    
    it('get length simple list with two short items', async function () {
        const data = rlp.encode(['a', 'b']);
        const str = toHexString(data);

        const result = await this.helper.getRlpLength(str, 0);
        
        assert.equal(result, 2);
    });
    
    it('get offset simple list with two short items', async function () {
        const data = rlp.encode(['a', 'b']);
        const str = toHexString(data);

        const result = await this.helper.getRlpOffset(str, 0);
        
        assert.equal(result, 1);
        
        const nitems = await this.helper.getRlpNumItems(str, 0);
        
        assert.equal(nitems, 2);
    });
    
    
    it('process list with one tiny item', async function () {
        let text = "0123456789";
        
        const data = rlp.encode([text]);
        const str = toHexString(data);
        
        const offset = await this.helper.getRlpOffset(str, 0);
        assert.equal(offset, 1);
        const length = await this.helper.getRlpLength(str, 0);
        assert.equal(length, 11);
        const tlength = await this.helper.getRlpTotalLength(str, 0);
        assert.equal(tlength, 12);
        
        const nitems = await this.helper.getRlpNumItems(str, 0);
        
        assert.equal(nitems, 1);
    });

    it('process list with one short item', async function () {
        let text = "0123456789";
        text += text;
        text += text;
        text += "01234567890123";
        
        const data = rlp.encode([text]);
        const str = toHexString(data);
        
        const offset = await this.helper.getRlpOffset(str, 0);
        assert.equal(offset, 1);
        const length = await this.helper.getRlpLength(str, 0);
        assert.equal(length, 55);
        const tlength = await this.helper.getRlpTotalLength(str, 0);
        assert.equal(tlength, 56);
        
        const nitems = await this.helper.getRlpNumItems(str, 0);
        
        assert.equal(nitems, 1);
    });
    
    it('process list with one not so short item', async function () {
        let text = "0123456789";
        text += text;
        text += text;
        text += "012345678901234";
        
        const data = rlp.encode([text]);
        const str = toHexString(data);
        
        const offset = await this.helper.getRlpOffset(str, 0);
        assert.equal(offset, 2);
        const length = await this.helper.getRlpLength(str, 0);
        assert.equal(length, 56);
        const tlength = await this.helper.getRlpTotalLength(str, 0);
        assert.equal(tlength, 58);
        
        const nitems = await this.helper.getRlpNumItems(str, 0);
        
        assert.equal(nitems, 1);
        
        const items = await this.helper.getRlpItems(str, 0);
        
        assert.equal(items.offsets[0], 3);
        assert.equal(items.lengths[0], 55);
    });
    
    it('process list with two not so short items', async function () {
        let text = "0123456789";
        text += text;
        text += text;
        text += "012345678901234";
        
        const data = rlp.encode([text, text]);
        const str = toHexString(data);
        
        const offset = await this.helper.getRlpOffset(str, 0);
        assert.equal(offset, 2);
        const length = await this.helper.getRlpLength(str, 0);
        assert.equal(length, 56 * 2);
        const tlength = await this.helper.getRlpTotalLength(str, 0);
        assert.equal(tlength, 56 * 2 + 2);
        
        const nitems = await this.helper.getRlpNumItems(str, 0);
        
        assert.equal(nitems, 2);
        
        const items = await this.helper.getRlpItems(str, 0);
        
        assert.equal(items.offsets[0], 3);
        assert.equal(items.lengths[0], 55);
        assert.equal(items.offsets[1], 3 + 56);
        assert.equal(items.lengths[1], 55);
    });
    
    it('process list with two not so short items using offset', async function () {
        let text = "0123456789";
        text += text;
        text += text;
        text += "012345678901234";
        
        const data = rlp.encode([text, text]);
        const str = concat('0x010203', toHexString(data));
        
        const offset = await this.helper.getRlpOffset(str, 3);
        assert.equal(offset, 2 + 3);
        const length = await this.helper.getRlpLength(str, 3);
        assert.equal(length, 56 * 2);
        const tlength = await this.helper.getRlpTotalLength(str, 3);
        assert.equal(tlength, 56 * 2 + 2);
        
        const nitems = await this.helper.getRlpNumItems(str, 3);
        
        assert.equal(nitems, 2);
        
        const items = await this.helper.getRlpItems(str, 3);
        
        assert.equal(items.offsets[0], 3 + 3);
        assert.equal(items.lengths[0], 55);
        assert.equal(items.offsets[1], 3 + 56 + 3);
        assert.equal(items.lengths[1], 55);
    });
});

