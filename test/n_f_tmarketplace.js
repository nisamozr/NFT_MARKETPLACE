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
        nft = await NFT.deployed();
    
      })
    it("should assert true",  function () {
      
      contracts
      return assert.isTrue(true);
    });
    it("create a marketItem",async function(){
        let nftadd = await nft.address
         contracts.createMarketplace(nftadd, 1, 1,{from: accounts[0], value: 25000000000000000});
      //  const  d = contracts.idMarketItem(1)
      //  assert.equal(d.tokenId, 1)
    })
    it("sale marketItem",async function(){
        contracts.creatMarketSales(await nft.address, 1)
    })
    it("owner",()=>{
        const g = contracts.owner()
        console.log(g);
        // assert.equal(g, accounts[0])
    })
  });


