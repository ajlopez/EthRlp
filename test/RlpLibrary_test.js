
const Helper = artifacts.require('./Helper.sol');

contract('RlpLibrary', function (accounts) {
    beforeEach(async function () {
        this.helper = await Helper.new();
    });
    
    it('get length 1', async function () {
        const result = await this.helper.getRlpLength('0x01', 0);
        
        assert.equal(result, 1);
    });
});

