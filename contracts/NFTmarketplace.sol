// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTmarketplace is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _auctionId;
    Counters.Counter private _itemSold;

    address payable public owner;
    uint listingPrice = 0.025 ether;
    uint256 public duration = 1 days;

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
        bool auction;
    }

     struct Bidder {
        address payable addr;
        uint256 amount;
    }

    struct Auction {
        uint256 tokenId;
        address payable seller;
        uint256 staringPrice;
        uint256 duration;
        bool finished;
        uint256 amount;
        uint256 highestPrice;
        address highestBidder;        
        Bidder[] bidders;
    }

    // Auction[] auctions;
    mapping(uint256 => Auction) public auctions;
    mapping (uint => MarketItem) public idMarketItem;

    event MarketItemCreated(
        uint indexed itemId,
        address indexed nftContracts,
        uint indexed tokenId,
        address  seller,
        address owner,
        uint price,
        bool sold,
        bool auction
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
            false,
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
            false,
            false
        );
    }

      function sellMarketplace(address nftContract, uint Id, uint price) public payable nonReentrant {
        require(price > 0 , "price must be graterthan zero");
        require(msg.value >= listingPrice, "value must equal to listing price");
        uint tokenId = idMarketItem[Id].tokenId;
        idMarketItem[Id].price = price;
        idMarketItem[Id].sold = false;
        idMarketItem[Id].owner = payable(address(this));
        idMarketItem[Id].seller = payable(msg.sender);

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        emit MarketItemCreated(
            Id,
            nftContract,
            tokenId,
            payable(address(this)),
            payable(msg.sender),
            price,
            false,
            false
        );
        _itemSold.decrement();
    }

    function creatMarketSales(address nftContract, uint ItemId) public payable nonReentrant{
        uint price = idMarketItem[ItemId].price;
        uint tokenId = idMarketItem[ItemId].tokenId;
        require(msg.value >= price, "to complit this transaction you should have asking price");

        
        idMarketItem[ItemId].seller.transfer(msg.value);
       
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idMarketItem[ItemId].owner = payable(msg.sender);
        idMarketItem[ItemId].sold = true;
        _itemSold.increment();
        payable(owner).transfer(listingPrice);

    }
    // auction
    function createAuction(
      address nftContract,
        uint256 _tokenId,
        uint256 _staringPrice
    ) public  {
      
        auctions[_tokenId].tokenId = _tokenId;
        auctions[_tokenId].seller = payable(address(this));
        auctions[_tokenId].duration = block.timestamp;
        auctions[_tokenId].staringPrice =  _staringPrice;
         auctions[_tokenId].finished = false;
         _itemIds.increment();
        uint newItemId = _itemIds.current();

        idMarketItem[newItemId] = MarketItem(
            newItemId,
            nftContract,
            _tokenId,
            payable(msg.sender),
            payable(address(0)),
            _staringPrice,
            false,
            true
        );
          IERC721(nftContract).transferFrom(msg.sender, address(this), _tokenId);

           _itemSold.decrement();
        

      // emit AuctionCreated(_tokenId, _seller, _price);
    }


    function bid (uint256 _tokenId) public payable {
        // require(auction.seller != address(0));
        require(msg.value > auctions[_tokenId].staringPrice );
        require(!auctions[_tokenId].finished);
        auctions[_tokenId].amount += msg.value;
        if(msg.value >= auctions[_tokenId].highestPrice){
          auctions[_tokenId].highestPrice = msg.value;
          auctions[_tokenId].highestBidder = msg.sender;
        }
        auctions[_tokenId].bidders.push(
            Bidder(payable(msg.sender), msg.value)
        );
        // emit AuctionBidden(_tokenId, msg.sender, msg.value);
    }

    function finish(address nftContract, uint256 _tokenId) public {

        for (uint256 i = 0; i < auctions[_tokenId].bidders.length - 1; i++) {
          if( auctions[_tokenId].bidders[i].addr != auctions[_tokenId].highestBidder){

              uint256 amount = auctions[_tokenId].bidders[i].amount;
              auctions[_tokenId].bidders[i].addr.transfer(amount);
          }
        }
        address bidder = auctions[_tokenId].highestBidder;
 
        IERC721(nftContract).transferFrom(address(this), bidder, _tokenId);
        auctions[_tokenId].finished = true;
        // emit AuctionFinished(_tokenId, awarder.addr);
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


