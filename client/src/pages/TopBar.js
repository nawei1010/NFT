import React from 'react';
import { Link } from 'react-router-dom';
import web3 from '../utils/initweb3';
import { Menu } from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';
import '../index.js'
/**
 * 导航栏
 */
class TopBar extends React.Component{
    constructor(){
        super()
        this.state = {
            currentAccount:'',
            currentKey:"allFundings",
        }
    }

    handleClick = e => {
        console.log('click ', e);
        this.setState({
            currentKey: e.key,
        });
      };

    async componentDidMount(){
        let accounts = await web3.eth.getAccounts()
        console.log('accounts:',accounts)

        this.setState({currentAccount:accounts[0]})
    }

    render(){
        return(
            <div class = "header">
                <div class = "title" style = {{marginLeft:"5%"}}> NFT平台 </div>
                <div style = {{alignSelf:'flex-end'}}>
                <Menu onClick={this.handleClick} selectedKeys={[this.state.currentKey]} mode="horizontal">
                    <MenuItem key = "newAuction" >
                    <Link to = "/newAuction"> 正在拍卖的NFT </Link>
                    </MenuItem>
                    <MenuItem key = "newNft" >
                    <Link to = "/newNft"> 铸造新的NFT </Link>
                    </MenuItem>
                    <MenuItem key = "MyNfts" >
                    <Link to = "/MyNfts"> 我的NFT </Link>
                    </MenuItem>
                    <MenuItem key = "myInvest" >
                    <Link to = "/myInvest"> 我的投资 </Link>
                    </MenuItem>
                    <MenuItem key = "myAuction" >
                    <Link to = "/myAuction"> 我的拍卖 </Link>
                    </MenuItem>
                </Menu>
                </div>
                <div class = "title" style = {{marginLeft:"5%"}}> 当前账号：{this.state.currentAccount} </div>
            </div>
        );
    }
}

export default TopBar