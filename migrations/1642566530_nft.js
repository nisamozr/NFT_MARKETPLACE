const nft = artifacts.require("NFT");
const nftmarketplace = artifacts.require("NFTmarketplace");



module.exports = function(_deployer, network, accounts) {
  // Use deployer to state migration tasks.
  // const userAddress = accounts[0];
  _deployer.deploy(nftmarketplace).then(()=>{
   return _deployer.deploy(nft, nftmarketplace.address)
  })
};
// {from: accounts[0]}, "Nisam","msd"