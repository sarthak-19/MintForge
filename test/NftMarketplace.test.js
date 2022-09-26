const {assert} = require('chai');

const NftMarketplace = artifacts.require("NftMarketplace");

require('chai').use(require('chai-as-promised')).should();

contract('NftMarketplace', async (accounts)=>
{
    let contract;
    before(async()=>
    {
        contract = await NftMarketplace.deployed();
    });
    
    //tesing container 
    describe('deployment',async()=>
    {
        //test samples by writing it

        it('deploys successfully',async()=>
        {
            const address= contract.address;
            assert.notEqual(address,'');
            assert.notEqual(address,null);
            assert.notEqual(address,undefined);
            assert.notEqual(address,0x0);
        })

        it('name and symbol matched',async ()=>
        {
            const name = await contract.name();
            const symbol = await contract.symbol();
            assert.equal(name,'NftMarketPlace');
            assert.equal(symbol,'NFTOP');
        })
    });

    describe('minting',async ()=>
    {
        it('creats new token', async()=>
        {
            const result=await contract.mint("https...1");
            const totalSupply = await contract.totalSupply();

            //success
            assert.equal(totalSupply,1);
            const event = result.logs[0].args;
            assert.equal(event._from,0x0000000000000000000000000000000000000000,'from address is correct');
            assert.equal(event._to,accounts[0],"to is msg.sender correct");
            
            //failure
            await contract.mint("https...1").should.be.rejected;
        })
    });

    describe('indexing',async ()=>
    {
        it('lists kryptoBirdz',async()=>
        {
            //mint 3 new tokens
            await contract.mint("https...2");
            await contract.mint("https...3");
            await contract.mint("https...4");
            const totalSupply = await contract.totalSupply();
            
            
            let result=[]
            let digitalToken
            for(i=1;i<=totalSupply;i++)
            {
                nf=await contract.digitalTokens(i-1);
                result.push(nf);
            }

            let res1=result.join(',');
            
            let expected=['https...1','https...2','https...3','https...4'].join(',');
            assert.equal(res1,expected);
        })
    });
})