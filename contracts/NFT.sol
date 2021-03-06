// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    constructor(address marketplaceAddress) ERC721("All Time NFT","NFT"){
        contractAddress = marketplaceAddress;
    }

    function createToken(string memory _tokenURI) public returns(uint256){
        _tokenIds.increment();
        uint256 newId = _tokenIds.current();

        _mint(msg.sender, newId);
        _setTokenURI(newId, _tokenURI);
        setApprovalForAll(contractAddress, true);
        return newId;

    }
     function approv() public {
       setApprovalForAll(contractAddress, true);
    }

}
