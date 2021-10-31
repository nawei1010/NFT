import React, {Component} from 'react';

//路由
import {BrowserRouter, Route, Switch} from 'react-router-dom';

//布局组件
import TopBar from './pages/TopBar'
import MyNfts from "./pages/MyNfts"
import newNft from "./pages/newNft"
import newAuction from "./pages/newAuction"
import MyAuction from "./pages/myAuction"
import myInvest from "./pages/myInvest"

class App extends Component {
	render() {
		return (
			<div className="App" >
            <BrowserRouter>
			<TopBar/>
            <Switch>
                <Route exact path = "/newNft" component = {newNft}/>
				<Route exact path = "/MyNfts" component = {MyNfts}/>
				<Route exact path = "/newAuction" component = {newAuction}/>
				<Route exact path = "/MyAuction" component = {MyAuction}/>
				<Route exact path = "/myInvest" component = {myInvest}/>
            </Switch>
				</BrowserRouter>
			</div>
		);
	}
}
export default App;