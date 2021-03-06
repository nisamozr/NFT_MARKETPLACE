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
    // uint public duration = 1 days;

    constructor(){
    owner = payable(msg.sender) ;
    }

    struct Bidder {
        address payable addr;
        uint amount;
        uint biddingTime;
    }

    struct Auction {
        uint staringPrice;
        uint duration;
        uint auctiontime;
        bool finished;
        uint amount;
        uint highestPrice;
        address highestBidder; 
        address seller;
        uint bidderCount;       
        uint bidderId;
    }
     struct MarketItem{
        uint itemId;
        address nftContracts;
        uint tokenId;
        address payable minter;
        address payable seller;
        address payable owner;
        uint price;
        bool sold;
        bool auction;
        uint auctionId;
    }

    mapping(uint => Auction) public auctions;
    mapping(uint => Bidder []) public bidders;
    mapping(uint => MarketItem) public idMarketItem;

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
    function createMarketplace(address nftContract, uint tokenId, uint price, bool _auction) public payable nonReentrant {
        require(price > 0 , "price must be graterthan zero");
        require(msg.value == listingPrice, "value must equal to listing price");

        _itemIds.increment();
        uint newItemId = _itemIds.current();
        idMarketItem[newItemId].itemId = newItemId;
        idMarketItem[newItemId].nftContracts = nftContract;
        idMarketItem[newItemId].tokenId = tokenId;
        idMarketItem[newItemId].minter = payable(msg.sender);
        idMarketItem[newItemId].seller = payable(msg.sender);
        idMarketItem[newItemId].owner = payable (address(this)) ;
        idMarketItem[newItemId].sold = false;
        if(_auction == true){
          idMarketItem[newItemId].price = 0;
          idMarketItem[newItemId].auction = true;
          auctions[tokenId].duration = block.timestamp + (10 * 1 minutes);
          auctions[tokenId].auctiontime = block.timestamp;
          auctions[tokenId].staringPrice = price;
          auctions[tokenId].finished = false;
          auctions[tokenId].seller = msg.sender;
           auctions[tokenId].highestBidder = msg.sender;
          idMarketItem[newItemId].auctionId = tokenId;
         }else{
          idMarketItem[newItemId].price = price;
          idMarketItem[newItemId].auction = false;
         }
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        emit MarketItemCreated(
            newItemId,
            nftContract,
            tokenId,
            payable(address(0)),
            payable(msg.sender),
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
        require(idMarketItem[ItemId].auction == false, "action ");

        idMarketItem[ItemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idMarketItem[ItemId].owner = payable(msg.sender);
        idMarketItem[ItemId].sold = true;
        _itemSold.increment();
        payable(owner).transfer(listingPrice);
    }
    // auction
    function createAuction(address nftContract,uint itemId,uint _staringPrice) public payable nonReentrant  {
      require(_staringPrice > 0 , "price must be graterthan zero");
      require(msg.value == listingPrice, "value must equal to listing price");

      uint tokenId = idMarketItem[itemId].tokenId;
      auctions[tokenId].duration = block.timestamp + (10 * 1 minutes);
      auctions[tokenId].auctiontime = block.timestamp;
      auctions[tokenId].staringPrice = _staringPrice;
      auctions[tokenId].seller = msg.sender;
      auctions[tokenId].finished = false;
      idMarketItem[itemId].seller = payable(msg.sender);
      idMarketItem[itemId].owner = payable (address(this)) ;
      idMarketItem[itemId].price = 0;
      idMarketItem[itemId].sold = false;
      idMarketItem[itemId].auction = true;
      idMarketItem[itemId].auctionId = tokenId;
      IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        _itemSold.decrement();

    }

    function bid (uint _tokenId) public payable {
      require(block.timestamp  <= auctions[_tokenId].duration , "BID Time expaire");
        for(uint i = 1; i<=auctions[_tokenId].bidderCount; i++ ){
           require(msg.sender != bidders[_tokenId][i-1].addr, "you alreay bided");
        }
       
        require(msg.value >= auctions[_tokenId].staringPrice,"mgs.sender is lessthan staringPrice" );
        require(!auctions[_tokenId].finished, "aution finished");
        require(msg.value > auctions[_tokenId].highestPrice,"Price shoud be gratterer than highst bider" );
        
        bidders[_tokenId].push(Bidder(payable(msg.sender), msg.value, block.timestamp));
        auctions[_tokenId].bidderCount++;
        auctions[_tokenId].bidderId = _tokenId;
        auctions[_tokenId].amount += msg.value;
        if(msg.value >= auctions[_tokenId].highestPrice){
          auctions[_tokenId].highestPrice = msg.value;
          auctions[_tokenId].highestBidder = msg.sender;
        }
    }
     function getBidder(uint id) public view returns(Bidder[] memory){
        Bidder[] memory bidderArray = new Bidder[](bidders[id].length);
        uint numberOfMediaAssets = 0;
        for(uint i = 0; i < bidders[id].length;  i++) {
        bidderArray[numberOfMediaAssets] = bidders[id][i];
        numberOfMediaAssets++;
    }
    return bidderArray;
    }

    function finish(address nftContract, uint _tokenId) public {
      require(idMarketItem[_tokenId].seller == msg.sender, "seller can only approve");
      require( block.timestamp  >= auctions[_tokenId].duration, "Time not expaired");
      require(idMarketItem[_tokenId].auction == true, "action ");
        for (uint i = 0; i < bidders[_tokenId].length - 1; i++) {
          if( bidders[_tokenId][i].addr != auctions[_tokenId].highestBidder){
              uint amount = bidders[_tokenId][i].amount;
              bidders[_tokenId][i].addr.transfer(amount);
          }
        }
        delete bidders[_tokenId];
        address bidder = auctions[_tokenId].highestBidder;
        idMarketItem[_tokenId].owner = payable(bidder);
        idMarketItem[_tokenId].sold = true;
        auctions[_tokenId].finished = true;
        _itemSold.increment();
        IERC721(nftContract).transferFrom(address(this), bidder, _tokenId);
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


