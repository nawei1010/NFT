import React, { Component } from 'react';
import { PageHeader, Descriptions,Image,Button,Space,Modal,Form,InputNumber,Input} from 'antd';
import { invest, claim, end_auction, myAuction1,return_account ,myAuction2} from '../getWeb3.js'
import '../index.js'
import img from '../picture.jpg'

class MyAuction extends Component {
    constructor(props) {
        super(props);
        this.state = {
          allAuction1: [],
          allAuction2: [],
          isModalVisible:false,
          record: [],
        };
    }

    async componentDidMount(){
        let res1 = await myAuction1()
        console.log(res1)
        let res2 = await myAuction2()
        console.log(res2)
        this.setState({
            allAuction1: res1,
            allAuction2: res2
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
                    await end_auction(para.index)
                    alert('主人认领成功')
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
                return( <p>所有者: {item}</p>)
            })
    }
    
    getMenuNodes2 = (menuList) =>{
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
    

    render(){
        return(
            <div className="site-page-header-ghost-wrapper">
                <h1>正在拍卖的NFT</h1>
                {this.getMenuNodes2(this.state.allAuction1)}
                <h1>拍卖结束的NFT</h1>
                {this.getMenuNodes(this.state.allAuction2)}
                <Modal title="历史交易信息" visible={this.state.isModalVisible} cancelText={"取消"} okText={"确认"} onOk={this.handleOk} onCancel={this.handleOk} >
                    {this.getInfo()}
                </Modal>
            </div>
        )
    }
}

export default MyAuction