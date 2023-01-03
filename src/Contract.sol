// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract MetaOmatic {
    
    address public contractOwner;
    //Total Income & User Will Be Managed From Here
    uint public totalNumberofUsers;
    uint8 public constant totalPackage = 6;
    
    IERC20 token;

    address depositAddress;

    struct UserAffiliateDetails {
        uint userId;
        address sponsor;
        uint side;
        address UplnFormNo;
        mapping(uint => bool) kitId;
        uint joiningDateTime;
        mapping(uint => uint) refs;
        uint latestPackage;
    }

    constructor(address _token)  {
        
      token = IERC20(_token);
      contractOwner=msg.sender;
      depositAddress = 0x09185dC7CF5319155B4377E27aB0d38dBa5E03D0;
      uint TimeStamp=block.timestamp;
      _UserAffiliateDetails[contractOwner].userId = TimeStamp;
      _UserAffiliateDetails[contractOwner].sponsor = address(0);
      _UserAffiliateDetails[contractOwner].joiningDateTime= TimeStamp;
      _UserAffiliateDetails[contractOwner].latestPackage = 480; 
      for (uint8 i = 0; i < totalPackage; i++) {
         _UserAffiliateDetails[contractOwner].kitId[i] = true;
      }
       userIdToAddress[TimeStamp] = contractOwner;
    }
    

    mapping(uint => address) public userIdToAddress;
    uint256[6] public packagePrice = [15, 30 , 60 ,120 ,240 ,480];
    mapping (address => UserAffiliateDetails) public _UserAffiliateDetails;

    
    //Get User Id
    function getUserId(address user) public view returns (uint) {
        return (_UserAffiliateDetails[user].userId);
    }

    //Get Sponsor Id
    function getSponsorId(address user) public view returns (address) {
        return (_UserAffiliateDetails[user].sponsor);
    }
    
    // Admin Can Check Is User Exists Or Not
    function _IsUserExists(address user) public view returns (bool) {
        return (_UserAffiliateDetails[user].userId != 0);
    }
    
    function _Joining(address referrer, uint256 amount, uint256 UplnFormNo, uint256 side) external {
      registration(msg.sender, referrer, amount, UplnFormNo, side);
    }
    
    function registration(address user, address referrer,uint256 amount, uint256 UplnFormNo, uint256 side) public {     
        
        uint packageprice=packagePrice[0];
        
        require(!_IsUserExists(user), "Already Registered !"); 
        require(_IsUserExists(referrer), "Referral Not Exists !");
        require(amount == packageprice,"Invalid Package !"); 
        uint32 size;
        assembly { size := extcodesize(user) }	
        require(size == 0, "Smart Contract !");
        amount = 15000000000000000000;
        token.transferFrom(user, depositAddress, amount);

        address upline = userIdToAddress[UplnFormNo];
        
        //Updating user details
        uint TimeStamp=block.timestamp;
        _UserAffiliateDetails[user].userId = TimeStamp;
        _UserAffiliateDetails[user].joiningDateTime= TimeStamp;
        _UserAffiliateDetails[user].kitId[15] = true;
        _UserAffiliateDetails[user].side = side;
        _UserAffiliateDetails[user].sponsor = referrer;
        _UserAffiliateDetails[user].UplnFormNo = upline;
        _UserAffiliateDetails[user].latestPackage = 15; 
        
        userIdToAddress[TimeStamp] = user;
        
    }

    function upgradePackage30(address user, uint256 amount) public {

        uint packageprice=packagePrice[1];
        require(_IsUserExists(user), "Not Registered !"); 
        require(amount == packageprice,"Invalid Package !");
        amount = amount * (10**18);
        token.transferFrom(user, depositAddress, amount);

        _UserAffiliateDetails[user].kitId[30] = true;
        _UserAffiliateDetails[user].latestPackage = 30; 

    }
    function upgradePackage60(address user, uint256 amount) public {

        uint packageprice=packagePrice[2];
        require(_IsUserExists(user), "Not Registered !"); 
        require(amount == packageprice,"Invalid Package !");
        amount = amount * (10**18);

        token.transferFrom(user, depositAddress, amount);

        _UserAffiliateDetails[user].kitId[60] = true;
        _UserAffiliateDetails[user].latestPackage = 60; 

    }
    function upgradePackage120(address user, uint256 amount) public {

        uint packageprice=packagePrice[3];
        require(_IsUserExists(user), "Not Registered !"); 
        require(amount == packageprice,"Invalid Package !");
        amount = amount * (10**18);

        token.transferFrom(user, depositAddress, amount);

        _UserAffiliateDetails[user].kitId[120] = true;
        _UserAffiliateDetails[user].latestPackage = 120; 

    }
    function upgradePackage240(address user, uint256 amount) public {

        uint packageprice=packagePrice[4];
        require(_IsUserExists(user), "Not Registered !"); 
        require(amount == packageprice,"Invalid Package !");
        amount = amount * (10**18);

        token.transferFrom(user, depositAddress, amount);

        _UserAffiliateDetails[user].kitId[240] = true;
        _UserAffiliateDetails[user].latestPackage = 240; 

    }
    function upgradePackage480(address user, uint256 amount) public {

        uint packageprice=packagePrice[5];
        require(_IsUserExists(user), "Not Registered !"); 
        require(amount == packageprice,"Invalid Package !");
        amount = amount * (10**18);
        
        token.transferFrom(user, depositAddress, amount);

        _UserAffiliateDetails[user].kitId[480] = true;
        _UserAffiliateDetails[user].latestPackage = 480; 

    }
    
    function refPayout(address[] calldata toPayaddr, uint[] calldata toPayamount) public {

        require(toPayaddr.length == toPayamount.length, "Array not Equal");
        for(uint i = 0; i<toPayaddr.length; i++){

            uint amount= toPayamount[i] * (10**17);
            address ref = toPayaddr[i];
            token.transferFrom(depositAddress, ref, amount);

        }
    }

    function getkitId(address user) public view returns(uint){

        uint package = _UserAffiliateDetails[user].latestPackage;

        return package;
    }

    }
