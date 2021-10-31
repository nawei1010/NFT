import React, { Component } from 'react';
import { PageHeader, Descriptions,Image,Button,Space,Modal,Form,InputNumber,Input} from 'antd';
import { invest, claim, end_auction, myinvest1,myinvest2,return_account ,} from '../getWeb3.js'
import '../index.js'
import img from '../picture.jpg'

class myInvest extends Component {
    constructor(props) {
        super(props);
        this.state = {
          invest1:[],
          invest2:[],
          isModalVisible:false,
          record: [],
        };
    }

    async componentDidMount(){
        let res1 = await myinvest1()
        let res2 = await myinvest2()
        this.setState({
            invest1: res1,
            invest2: res2
        })  
    }
    
    handleClick(para){
        this.setState({
            isModalVisible: true,
            record: para
        })
    }

    async handleClick2(para){
        console.log(para.auction)
        let account = await return_account()
        console.log(para.index)
        if(para.status === "拍卖中")
        {
            alert('拍卖正在进行中')
        }
        else if(para.status === "拍卖失败")
        {
            if(account !== para.owner)
            {
                alert('不是该拍卖品主人，无权认领')
            }
            else{
                if(await end_auction(para.index)){
                    alert('主人认领成功')
                }
            }
        }
        else{
            if(account !== para.auction.payer){
                alert('不是当前最高出价者，无权认领')
            }
            else{
                await claim(para.index)
                alert('认领成功')
            }
        }
        this.componentDidMount()
    }
   
    handleOk = () =>{
        this.setState({
          isModalVisible:false
        })
    }
    
     getInfo(){
        let record = this.state.record.record;
        console.log(record)
        return record && record.map(item =>
            {
                return( <p>参与者: {item}</p>)
            })
    }
    
    onFinish = async(values) => {
        console.log(values.index)
        let account = await return_account();
        console.log(values.index.auction)
        let data = values.index
        if(data.status === "拍卖失败")
        {
            alert('当前拍卖已结束，无法出价')
        }
        else if(data.owner === account)
        {
            alert('无法对自己拍卖的Nft出价')
        }
        else if(data.auction.currentMoney >= values.currentMoney)
        {
            alert('出价低于当前最高出价')
        }
        else{
            try{
                invest(data.index,values.currentMoney)
              }catch(error){
                  alert('出价失败')
                  console.log(error)
              }
        }
    }

    getMenuNodes = (menuList) =>{
        return menuList.map(item=>{
            return(
              <div>
               <PageHeader style = {{marginBottom:"5px", width:"80%", marginLeft:"10%"}}
                ghost={false}
                title= {item.name}
                subTitle= {"卖家:" + item.owner}
                >
                <Descriptions size="small" >
                    <Descriptions.Item label="拍卖状态"> {item.status} </Descriptions.Item>
                    <Descriptions.Item label="当前出价"> {item.auction.currentMoney}eth </Descriptions.Item>
                    <Descriptions.Item label="当前出价最高者"> {item.auction.payer} </Descriptions.Item>
                    <Descriptions.Item label="结束时间"> {item.auction.endTime} </Descriptions.Item>
                </Descriptions>

                <Space size={12}>
                    <Image
                        width={200}
                        height = {200}
                        src={'http://localhost:8080/ipfs/'+item.pictureHash}
                    />

                    <Button
                        type="primary"
                        onClick={() => this.handleClick(item)}
                    >
                        查看历史交易信息
                    </Button>
                    
                    
                   <Button
                        type="primary"
                        onClick={() => this.handleClick2(item)}
                    >
                        认领
                    </Button>
                </Space>
                </PageHeader>
              </div>
            )
        })
    };
    
    getMenuNodes1 = (menuList) =>{
        return menuList.map(item=>{
            return(
              <div>
               <PageHeader style = {{marginBottom:"5px", width:"80%", marginLeft:"10%"}}
                ghost={false}
                title= {item.name}
                subTitle= {"卖家:" + item.owner}
                >
                <Descriptions size="small" >
                    <Descriptions.Item label="拍卖状态"> {item.status} </Descriptions.Item>
                    <Descriptions.Item label="当前出价"> {item.auction.currentMoney}eth </Descriptions.Item>
                    <Descriptions.Item label="当前出价最高者"> {item.auction.payer} </Descriptions.Item>
                    <Descriptions.Item label="结束时间"> {item.auction.endTime} </Descriptions.Item>
                </Descriptions>

                <Space size={12}>
                    <Image
                        width={200}
                        height = {200}
                        src={'http://localhost:8080/ipfs/'+item.pictureHash}
                    />

                    <Button
                        type="primary"
                        onClick={() => this.handleClick(item)}
                    >
                        查看历史交易信息
                    </Button>
                    
                </Space>
                </PageHeader>
              </div>
            )
        })
    };
    render(){
        return(
            <div className="site-page-header-ghost-wrapper">
                <h1>出价最高仍在进行的拍卖</h1>
                {this.getMenuNodes1(this.state.invest1)}
                <h1>竞拍成功的拍卖</h1>
                {this.getMenuNodes(this.state.invest2)}
                <Modal title="历史交易信息" visible={this.state.isModalVisible} cancelText={"取消"} okText={"确认"} onOk={this.handleOk} onCancel={this.handleOk} >
                    {this.getInfo()}
                </Modal>
            </div>
        )
    }
}

export default myInvest