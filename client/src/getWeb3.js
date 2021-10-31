//导入web3实例
import web3 from "./utils/initweb3"
import data from "./contracts/myNft.json"

let abi = data.abi
let address = '0xaB1eCfDf50e822eebEd0C7BE03861030077e0e9a'
let contract = new web3.eth.Contract(abi,address)





let getMyNft = async () => {
    let currentNft = [];
    let total = await contract.methods.totalNft().call();

    for(let i=0; i<total; i++){
        let res = await getOneNft(i);
        if(res){
            currentNft.push(res);
        }
    }
    return currentNft;
}



let return_account = async()=>{
    let account = (await web3.eth.getAccounts())[0];
    return account;
}
 
let getOneNft= async (index) =>{
    let account = (await web3.eth.getAccounts())[0];
    const data = await contract.methods.allNfts(index).call();
    data.index = index
    console.log(data);
    var records = new Array()
    for(let i = 0; i < data.count; i++)
    {
        records[i] = await contract.methods.record(index,i).call()
    }
    data.record = records
    console.log(data.record)
    if(account === data.owner){
        if(data.isAuction === true){
            var nowTime = Math.round(new Date()/1000);
            let auction = await contract.methods.AuctionNft(index).call();
            if(nowTime >= auction.endTime && auction.isSuccess === false)
            {
                data.status = "拍卖失败";
            }
            else if(nowTime >= auction.endTime && auction.isSuccess == true)
            {
                data.status = "拍卖成功";
            }
            else{
                data.status = "拍卖中";
            }
            auction.endTime = timestampToTime(auction.endTime)
            data.auction = auction;
        }
        
        if(data.isAuction == true)
            {
                data.isAuction = "正在拍卖"
            }
            else{
                data.isAuction = "不在拍卖"
            }
            if(data.isBuy == true){
                data.isBuy = "为拍卖购得"
            }
            else{
                data.isBuy = "为自己创建"
            }
        return data
    }
    else{
        return null
    }
}

let createNft = async (name,hash) =>{
    let account = (await web3.eth.getAccounts())[0];
    console.log(name)
    console.log(hash)
    console.log(typeof(name))
    console.log(typeof(hash))
    return await contract.methods.newNft(name,hash).send({
        from: account,
        gas: 1000000
    });       
}

// function  getAddress(index){
//     console.log(index)
    
//     console.log(records)
//     let return_value = Array.from(records)
//     console.log(return_value)
//     return return_value
// }

let createAuction = async (index, endTime, money) =>{
    let account = (await web3.eth.getAccounts())[0];
    return await contract.methods.newAuction(index,endTime,web3.utils.toWei(money.toString(10), 'ether')).send({
        from: account,
        gas: 1000000
    });       
}

//将时间戳转换成正常时间格式
function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y+M+D+h+m+s;
}

let allAuction = async () => {
    let Auction = []
    let total = await contract.methods.totalNft().call()
    var nowTime = Math.round(new Date()/1000);
    for(let i=0; i<total; i++){
        let res = await getOneAuction(i);
        if(res){
            if(nowTime < res.auction.time){
                Auction.push(res);
            }
        }
    }
    return Auction
}

//返回正在拍卖
let myinvest1 = async () => {
    let Auction = []
    var nowTime = Math.round(new Date()/1000);
    let total = await contract.methods.totalNft().call()
    let account = (await web3.eth.getAccounts())[0];
    for(let i=0; i<total; i++){
        let res = await getOneAuction(i);
        if(res && res.owner != account && res.auction.payer === account && nowTime < res.auction.time){
            Auction.push(res);
        }
    }
    return Auction
}

let myinvest2 = async () => {
    let Auction = []
    var nowTime = Math.round(new Date()/1000);
    let total = await contract.methods.totalNft().call()
    let account = (await web3.eth.getAccounts())[0];
    for(let i=0; i<total; i++){
        let res = await getOneAuction(i);
        if(res && res.owner != account && res.auction.payer === account && nowTime >= res.auction.time){
            Auction.push(res);
        }
    }
    return Auction
}

//返回正在拍卖
let myAuction1 = async () => {
    let Auction = []
    var nowTime = Math.round(new Date()/1000);
    let total = await contract.methods.totalNft().call()
    let account = (await web3.eth.getAccounts())[0];
    for(let i=0; i<total; i++){
        let res = await getOneAuction(i);
        if(res && res.owner === account && nowTime < res.auction.time){
            Auction.push(res);
        }
    }
    return Auction
}

//返回拍卖结束的
let myAuction2 = async () => {
    let Auction = []
    let total = await contract.methods.totalNft().call()
    var nowTime = Math.round(new Date()/1000);
    let account = (await web3.eth.getAccounts())[0];
    for(let i=0; i<total; i++){
        let res = await getOneAuction(i);
        console.log(res)
        if(res && res.owner === account && nowTime >= res.auction.time){
            Auction.push(res);
        }
    }
    return Auction
}

let getOneAuction = async (index) => {
    let account = (await web3.eth.getAccounts())[0];
    const data = await contract.methods.allNfts(index).call();
    if(data.isAuction == false)
    {
        return null;
    }
    else{
        const auction = await contract.methods.AuctionNft(index).call();
        var nowTime = Math.round(new Date() / 1000);
        if(nowTime >= auction.endTime && auction.isSuccess == false)
            {
                data.status = "拍卖失败";
            }
            else if(nowTime >= auction.endTime && auction.isSuccess == true)
            {
                data.status = "拍卖成功";
            }
            else{
                data.status = "拍卖中";
            }
            
                var records = new Array()
                for(let i = 0; i < data.count; i++)
                {
                    records[i] = await contract.methods.record(index,i).call()
                }
                data.record = records
                console.log(data.record)
        auction.time = auction.endTime
        auction.endTime = timestampToTime(auction.endTime)
        var money = web3.utils.fromWei(auction.currentMoney, 'ether')
        auction.currentMoney = money
        data.index = index
        data.auction = auction
        
        return data
    }
    
}

//出价
let invest = async(index, money) =>
{
    let account = (await web3.eth.getAccounts())[0]
    return await contract.methods.invest(index,web3.utils.toWei(money.toString(10), 'ether')).send({
        from: account,
        gas: 1000000
    })
}


let claim = async(index) => {
    let account = (await web3.eth.getAccounts())[0];
    const data = await contract.methods.allNfts(index).call();
    if(data.isAuction == false)
    {
        return false;
    }
    else{
        const auction = await contract.methods.AuctionNft(index).call();
        if(auction.isSuccess == true && auction.payer == account){
            let money = web3.utils.fromWei(auction.currentMoney, 'ether')
            await contract.methods.claim(index).send({
                from: account,
                value: web3.utils.toWei(money.toString(10),'ether')
            })
            return true
        }
    }
}

let end_auction = async(index) => {
    let account = (await web3.eth.getAccounts())[0];
    const hello = await contract.methods.end_auction(index).send({
        from: account,
        gas: 1000000
    })
}

export {
    getMyNft,
    getOneNft,
    createNft,
    createAuction,
    allAuction,
    getOneAuction,
    invest,
    claim,
    end_auction,
    return_account,
    contract,
    myAuction1,
    myAuction2,
    myinvest1,
    myinvest2,
}