import React, {Component } from 'react';
import { Form, Input, Button, Upload, message} from 'antd';
import {Redirect} from 'react-router-dom';
import {createNft} from '../getWeb3.js'
  
const ipfsAPI = require('ipfs-api')
const ipfs = ipfsAPI({host: 'localhost', port:'5001', protocol:'http'});

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

let saveImageOnIpfs = (reader) => {

    return new Promise(function(resolve,reject){

        const buffer = Buffer.from(reader.result);

        ipfs.add(buffer).then((response) => {

            console.log(response)

            resolve(response[0].hash);

        }).catch((err) => {

          console.error(err)

          reject(err);

        })

   })

}

    
//     return new Promise(function(resolve,reject){
        
//         console.log(reader)
//         const buffer = Buffer.from(reader.result);
//         console.log(buffer)
//         ipfs.add(buffer).then((response) => {
//             console.log('test')
//             console.log(response)
//             resolve(response[0].hash);

//         }).catch((err) => {

//           console.error(err)

//           reject(err);

//         })
//    })


class newNft extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isSuccess:false,
            name: "",
            img: "",
            hash :""
        };
    }
    
    handlerChange(event) {
        const imageFile = event.target.files[0]
        const imageUrl = URL.createObjectURL(imageFile)
        console.log(imageUrl)
        this.setState({img: imageUrl})
        
    
        var file = document.getElementById('file').files[0]
        console.log(file)
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        console.log(reader)
        reader.onloadend = (e) => {

            console.log(reader);
  
            //上传数据到IPFS
  
            saveImageOnIpfs(reader).then((hash) => {
  
              console.log(hash);
  
              this.setState({hash: hash})
  
            });
  
          }
        
    }

    onFinish = async(values) => {
        
        this.setState({
            name: values.name
        })
        try {
            console.log(this.state.name)
            console.log(this.state.hash)
            await createNft(this.state.name,this.state.hash)
            alert('创建新Nft成功')
            this.setState({
                isSuccess: true
            })
        } catch (error) {
            alert('创建新Nft失败')
            console.log(error)
        }
    };
      
    render(){
        if(this.state.isSuccess === true){
            return <Redirect to = {{pathname:'/'}}/>
        }
        else{
        return(
            <div style = {{width:"40%", marginLeft:"25%", marginTop:"80px"}}>
            <Form
                {...layout}
                name="basic"
                layout="horizontal"
                size= "large"
                onFinish={this.onFinish}
            >
                <Form.Item label="NFT名称" name="name" rules={[{ required: true, message: '请输入新的NFT名称!' }]}>
                <Input />
                </Form.Item>
                <Form.Item label = "上传图片" name = "picture" >
                    <input type = "file" id = "file" ref = "fileid" accept = "image/*" onChange = { this.handlerChange.bind(this) }/>
                    <img src = {this.state.img}  width = "300" /> 
                </Form.Item>   
                <Form.Item {...tailLayout}>
                <Button htmlType="submit" type="primary"> 创建新的Nft </Button>
                </Form.Item>
            </Form>
            
      </div>
        )
        }
    }

}

export default newNft