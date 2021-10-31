import React, { Component} from 'react';
import { Table, Button, Modal, Form, DatePicker,InputNumber,Image} from 'antd';
import { getMyNft, createAuction, getAddress} from '../getWeb3.js'
import moment from 'moment'
// const layout = {
//     labelCol: { span: 16 },
//     wrapperCol: { span: 20 },
// };
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

class MyNfts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allNfts: [],
      isModalVisible1: false,
      isModalVisible2: false,
      endTime: "",
      selected: 0
    };
    this.columns = [
      {
        title: 'Nft名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'NFT图',
        dataIndex: 'pictureHash',
        key: 'pictureHash',
        render: (text,record,index)=>(
          <div>
             <Image width = {200} height ={200} src = {'http://localhost:8080/ipfs/'+text}/>
          </div>
        )
      },
      {
        title: '是否为拍卖所得',
        dataIndex: 'isBuy',
        key: 'isBuy',
      },
      {
        title: '是否正在拍卖',
        dataIndex: 'isAuction',
        key: 'isAuction',
      },
      
      // {
      //   title: '查看交易记录',
      //   key: 'records',
      //   dataIndex: 'records',
      //   render: (text, record, index)=>(
      //     <div>
      //        <Button onClick={this.action1.bind(this,text,record,index)}> 查看 </Button>
      //     </div>
      // )
      // },
      {
        title: '选择拍卖',
        key: 'Auction',
        dataIndex: 'Auction',
        render: (text,record,index)=>(
          <div>
             <Button  onClick={this.action2.bind(this,text,record,index)}>拍卖</Button>
          </div>
      )
      },
    ]
    this.action1 = this.action1.bind(this)
    this.action2 = this.action2.bind(this)
  }
  

  action1 = (text,record,index) => {
    console.log(index)
    this.setState({
      isModalVisible1:true,
      selected: index,
    })
  }
  
  action2 = (text,record,index)=>{
    console.log(index)
    this.setState({
      isModalVisible2:true,
      selected: index,
    })
  }

  async componentDidMount(){
    let res = await  getMyNft();
    console.log(res)
    this.setState({
      allNfts: res
    })
  }

  handleOk = () =>{
    this.setState({
      isModalVisible1:false
    })
  }

  handleOk2 = () =>{
    this.setState({
      isModalVisible2:false
    })
  }

  //  getInfo() {
  //   let records = this.state.allNfts[this.state.selected]
  //   console.log(records["index"])
  //   // let test = records.record
  //   // return test && test.map(item =>{
  //   //   return(<p>拥有者：{item}</p>)
  //   // })
  // }

  GetEndTime(date, dateString){
    this.setState({
        endTime: dateString,
    })
  };
  
  disabledDate=(current)=>{
    let dateTime = new Date(+new Date() +8*3600*1000).toISOString();
    let timeArray =dateTime.split("T")[0].split("-");
    let nowDate = timeArray[0]+"-"+timeArray[1]+"-"+timeArray[2] ;//当前年月日
    
     return current && current <= moment(nowDate) ;
  
    };

  onFinish = async(values) => {
      var timeStamp = Math.round(new Date(this.state.endTime) / 1000)
      let money = values.currentMoney
      let record = this.state.allNfts[this.state.selected];
      let index = record["index"]
      console.log(index)
      console.log(record)
      if(record.isAuction === "正在拍卖" )
      {
        alert('正在拍卖，无法重复创建拍卖')
        return
      }
      try {
          await createAuction(index, timeStamp, money)
          alert('创建拍卖成功')
          this.setState({
              isSuccess: true
          })
      } catch (error) {
          alert('创建拍卖失败')
          console.log(error)
      }
      this.setState({isModalVisible2:false});
  };

  newAuction(){
    
    return(
      <div style = {{width:"50%", marginLeft:"10%", marginTop:"80px"}}>
      <Form
          // {...layout}
          name="basic"
          layout="horizontal"
          size= "large"
          onFinish={this.onFinish}
      >
          <Form.Item label="拍卖截止时间" name="endTime" rules={[{ required: true, message: '请输入拍卖截止时间!' }]}>
          <DatePicker disabledDate = {() => this.disabledDate()} showTime onChange = {this.GetEndTime.bind(this)} />
          </Form.Item>
          <Form.Item label="拍卖金额(ETH)" name="currentMoney" rules={[{ required: true, message: '请输入拍卖起始金额!' }]}>
          <InputNumber style = {{width:"100px"}} min={0.1}  step={0.1}/>
          </Form.Item>
          <Form.Item {...tailLayout}>
          <Button htmlType="submit" type="primary"> 创建拍卖 </Button>
          </Form.Item>
      </Form>
</div>
    )
  }

  render() {
      return (
          <div>
              <div style = {{width:"90%", marginLeft:"5%"}}>
                  <Table columns={this.columns} dataSource={this.state.allNfts} />
                  {/* <Modal title="交易记录" visible={this.state.isModalVisible1}  cancelText={"取消"} okText={"确认"} onOk={()=>this.handleOk()} onCancel={()=>this.handleOk()}>
                    {this.getInfo()}
                  </Modal> */}
                  <Modal title="拍卖设置" visible={this.state.isModalVisible2}  cancelText={"取消"} okText={"确认"} onOk={()=>this.handleOk2()} onCancel={()=>this.handleOk2()}>
                   {this.newAuction()}
                  </Modal>
              </div>
          </div>
      )
  }
}

export default MyNfts