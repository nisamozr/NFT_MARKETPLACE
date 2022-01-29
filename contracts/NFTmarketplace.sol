// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Counters.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract NFTmarketplace is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemSold;

    address payable public owner;
    uint listingPrice = 0.025 ether;

    constructor(){
    owner = payable(msg.sender) ;
    }

    struct MarketItem{
        uint itemId;
        address nftContracts;
        uint tokenId;
        address payable seller;
        address payable owner;
        uint price;
        bool sold;
    }
     
    mapping (uint => MarketItem) public idMarketItem;

    event MarketItemCreated(
        uint indexed itemId,
        address indexed nftContracts,
        uint indexed tokenId,
        address  seller,
        address owner,
        uint price,
        bool sold
    );

    function getListingPrice() public view returns(uint){
        return listingPrice;
    }
    function marketItemCont() public view returns(uint){
       uint newItemId = _itemIds.current();
        return newItemId;
    }

    function createMarketplace(address nftContract, uint tokenId, uint price) public payable nonReentrant {
        require(price > 0 , "price must be graterthan zero");
        require(msg.value == listingPrice, "value must equal to listing price");

        _itemIds.increment();
        uint newItemId = _itemIds.current();

        idMarketItem[newItemId] = MarketItem(
            newItemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            newItemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );
    }

      function sellMarketplace(address nftContract, uint Id, uint price) public payable nonReentrant {
        require(price > 0 , "price must be graterthan zero");
        require(msg.value == listingPrice, "value must equal to listing price");
        uint tokenId = idMarketItem[Id].tokenId;
        idMarketItem[Id].price = price;
        idMarketItem[Id].sold = false;
        // idMarketItem[Id].seller = payable(msg.sender);

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        emit MarketItemCreated(
            Id,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(msg.sender),
            price,
            false
        );
        _itemSold.decrement();
    }

    function creatMarketSales(address nftContract, uint ItemId) public payable nonReentrant{
        uint price = idMarketItem[ItemId].price;
        uint tokenId = idMarketItem[ItemId].tokenId;
        require(msg.value >= price, "to complit this transaction you should have asking price");
        require(msg.sender != idMarketItem[ItemId].owner, "you are the owner of this nft");

        
        idMarketItem[ItemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId) ;
        idMarketItem[ItemId].owner = payable(msg.sender);
        idMarketItem[ItemId].sold = true;
          _itemSold.increment();
        payable(owner).transfer(listingPrice);
        

    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
      uint itemCount = _itemIds.current();
      uint unsoldItemCount = _itemIds.current() - _itemSold.current();
      uint currentIndex = 0;

      MarketItem[] memory items = new MarketItem[](unsoldItemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (idMarketItem[i + 1].sold == false) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }


    function fetchMyNFTs() public view returns (MarketItem[] memory) {
      uint totalItemCount = _itemIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idMarketItem[i + 1].owner == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idMarketItem[i + 1].owner == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

  

}


