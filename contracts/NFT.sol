// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Counters.sol";
// import  "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;
    

    constructor( address marketplaceAddress) ERC721("Mixter","MIX"){
        contractAddress = marketplaceAddress;
    }

    function createToken(string memory _tokenURI) public returns(uint){
        _tokenIds.increment();
        uint newId = _tokenIds.current();

        _mint(msg.sender, newId);
        _setTokenURI(newId, _tokenURI);
        setApprovalForAll(contractAddress, true);
        return newId;

    }

}
