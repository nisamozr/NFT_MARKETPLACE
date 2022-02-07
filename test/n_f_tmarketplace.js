const NFTmarketplace = artifacts.require("NFTmarketplace.sol");
const NFT = artifacts.require("NFT.sol");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */

contract("NFTmarketplace", function ( accounts) {
    let contracts 
    let nft 
    before(async ()=>{
       contracts = await NFTmarketplace.deployed();
        nft = await NFT.deployed(contract.address);
    
      })
    it("should assert true",  function () {
      
      contracts
      return assert.isTrue(true);
    });
    it("create a token",async function(){
        let marketPlaceAdderss = await contracts.address
        await nft.createToken("image1", {from: accounts[0]});
        // await nft.createToken("image2", {from: accounts[1]});
        let tokenCount = await nft.balanceOf(accounts[0])
        assert.equal(tokenCount.toNumber(), 1)
    })
    it("create marketItem",async function(){
        await contracts.createMarketplace(await nft.address, 1, 2,false, {from:accounts[0], value: 25000000000000000})
        const maplist = await contracts.idMarketItem(1)
        assert.equal(maplist.seller, accounts[0])
    })
    it("buy marketItem",async function(){
      await contracts.creatMarketSales(await nft.address, 1, {from:accounts[1], value: 2000000000000000000})
      const maplist = await contracts.idMarketItem(1)
      assert.equal(maplist.owner, accounts[1])
    })
    it("sell marketItem",async function(){
      await nft.approv({from: accounts[1]});
      await contracts.sellMarketplace(await nft.address, 1, 3 ,{from:accounts[1], value: 25000000000000000})
      const maplist = await contracts.idMarketItem(1)
      assert.equal(maplist.owner, contracts.address)
    })
    it("create marketItem with auction",async function(){
      await contracts.createMarketplace(await nft.address, 1, 2,true, {from:accounts[0], value: 25000000000000000})
      const maplist = await contracts.idMarketItem(1)
      assert.equal(maplist.seller, accounts[0])
  })
 
  
    
   
  });


