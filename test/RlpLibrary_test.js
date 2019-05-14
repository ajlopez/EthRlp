
const Helper = artifacts.require('./Helper.sol');

contract('RlpLibrary', function (accounts) {
    beforeEach(async function () {
        this.helper = await Helper.new();
    });
    
    it('get total length 1 from encoded empty array', async function () {
        const result = await this.helper.getRlpTotalLength('0x80', 0);
        
        assert.equal(result, 1);
    });
    
    it('get total length 1 from encoded empty array using offset', async function () {
        const result = await this.helper.getRlpTotalLength('0x010280', 2);
        
        assert.equal(result, 1);
    });
    
    it('get total length 1', async function () {
        const result = await this.helper.getRlpTotalLength('0x01', 0);
        
        assert.equal(result, 1);
    });
    
    it('get total length 1 using offset', async function () {
        const result = await this.helper.getRlpTotalLength('0x010203', 2);
        
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
});

