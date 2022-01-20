const NFT = artifacts.require("NFT");
const NFTmarketplace = artifacts.require("NFTmarketplace");
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
// contract("NFT", function (/* accounts */) {
//  const contract =   NFT.deployed();
//   it("should assert true", async function () {
//    contract
//     return assert.isTrue(true);
//   });
//   it("marketplace contract ",async function (){
//     let contractss =await  NFTmarketplace.deployed();
  
//     assert.notEqual(contractss.address, "" )
//     assert.notEqual(contractss.address, "0x0")
    
//   })
//   it("Nft name ", async ()=>{
//       const name = contract.name()
//       assert.equal(name == "Mixter")

//   })


// });
contract("NFTmarketplace",async function (/* accounts */) {
  let contract = await NFTmarketplace.deployed();
  let nft = await NFT.deployed();
  // await NFT.deployed();
  it("should assert true", async function () {
    
    contract
    return assert.isTrue(true);
  });
  it("create a marketItem",async function(){
    let contact = nft.address
    contract.createMarketplace(contact, 24342, 3000);

    let instent = await contract.idMarketItem(24342)

    assert.equal(instent.itemId , 1)




  })
});