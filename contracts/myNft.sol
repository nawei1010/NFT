pragma solidity >=0.5.16;
contract myNft{
    uint public totalNft = 0;
    mapping(uint => Nft) public allNfts; //所有的Nft
    // mapping(uint => string)public Storehash; //存储hash值
    mapping(uint => auction) public AuctionNft; //正在拍卖的Nft
    mapping (uint => address[]) public record; //拍卖记录

    struct Nft{
       address payable owner; //Nft拥有者
       bool isAuction; //是否正在拍卖
       bool isBuy; //是否是拍卖所得
       uint count; //表明交易次数    
       string name;  //名字
       string pictureHash;
    }
    
    struct auction{
        uint currentMoney; //当前金额
        address  payer ; //当前出价者
        uint endTime; //结束时间
        bool isSuccess; //是否成功
    }
    
    //创建一个新的NFT
    function newNft(string memory name, string memory picture_hash) public returns(uint){ 
        // Nft memory nft = Nft(msg.sender, name, false, false, (new address[](10)))
        Nft memory nft = Nft(msg.sender, false, false, 1, name, picture_hash);
        allNfts[totalNft] = nft;
        allNfts[totalNft].count = 1;
        address[] memory transaction = new address[](10);
        transaction[0] = msg.sender;
        record[totalNft] = transaction;
        totalNft++;
        return totalNft;
    }
    
    // function return_record(uint index) public returns(address[] memory){
    //     return record[index];
    // }

    //创建一个新的拍卖
    function newAuction(uint index, uint _endTime, uint money) public{
        Nft storage nft = allNfts[index];
        require(msg.sender == nft.owner); //必须要是该Nft的主人才能创建拍卖
        require(_endTime > block.timestamp); //结束时间必须晚于当前时间
        nft.isAuction = true;
        auction memory newAuctions = auction(money, msg.sender, _endTime, false);
        AuctionNft[index] = newAuctions;
    }

    //出价
    function invest(uint index, uint money) public {
        require(money > AuctionNft[index].currentMoney); //必须比当前金额更高
        require(msg.sender.balance >= money); //需要账户余额出价多，即能买得起
        require(AuctionNft[index].endTime > block.timestamp); //拍卖尚未结束
        auction storage cur = AuctionNft[index];
        cur.currentMoney = money;
        cur.payer = msg.sender;
        cur.isSuccess = true;
    }

    //拍卖失败
    function end_auction(uint index) public{
         Nft memory cur_nft = allNfts[index];
         cur_nft.isAuction = false; //表明不在拍卖
         allNfts[index] = cur_nft;
         delete AuctionNft[index]; //删除拍卖信息
    }


    //最高价认领
    function claim(uint index) payable public{
        require(AuctionNft[index].endTime < block.timestamp);
        require(AuctionNft[index].isSuccess == true);
        require(msg.sender == AuctionNft[index].payer); //需要他是当前最高出价人
        Nft memory cur_nft = allNfts[index];
        record[index][cur_nft.count] = msg.sender;
        cur_nft.isAuction = false;
        cur_nft.isBuy = true;
        cur_nft.count++;
        cur_nft.owner.transfer(msg.value); //向原主人转账
        cur_nft.owner = msg.sender;
        allNfts[index] = cur_nft;
        delete AuctionNft[index]; //删除拍卖信息
    }

}