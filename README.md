## 区块链与数字货币课程

姓名： 张宏伟

学号： 3190105029

### 编译环境

- 操作系统： Windows 10
- IDE: VS Code
- 浏览器： Chrome
- npm 8.1.0
- node  v14.17.0
- yarn 1.22.10
- Truffle v5.4.15
- Solidity v0.5.16
- web3.js v1.5.3
- ipfs  0.10.0

### 如何运行

1. 配置node,npm,yarn ,  安装truffle、ganache，在Chrome浏览器，安装插件MetaMask

2. 打开Ganache，选择quickstart，将server的端口号改成8545，配置完毕后，点击右上角save and start

3. 进入demo文件夹下的client文件夹，依次输入命令 `truffle compile`  `truffle migrate`

4. 将`truffle migrate`后的结果中的‘myNft' 中的contract address 复制，

   

然后复制到client/src/getWeb3.js文件，将第6行的address变量的值设置为刚刚复制的地址

![image-20211031193919003](C:\Users\zhw\AppData\Roaming\Typora\typora-user-images\image-20211031193919003.png)

5. 在client目录下输入npm start启动项目，然后在google浏览器中访问[http://localhost:3000](http://localhost:3000/)
6. 登陆MetaMask，连接localhost:8545的本地网络，并且从Ganache中导入几个账户，将账户同http://localhost:3000进行连接。 然后即可使用

### 界面截图

1. 创建新的NFT

   ![image-20211031194232708](C:\Users\zhw\AppData\Roaming\Typora\typora-user-images\image-20211031194232708.png)

   

2. 查看我的NFT

   ![image-20211031194331494](C:\Users\zhw\AppData\Roaming\Typora\typora-user-images\image-20211031194331494.png)

   

   

3. 创建拍卖

   ![image-20211031194409075](C:\Users\zhw\AppData\Roaming\Typora\typora-user-images\image-20211031194409075.png)

   

4. 查看所有正在拍卖的NFT

   ![image-20211031194450757](C:\Users\zhw\AppData\Roaming\Typora\typora-user-images\image-20211031194450757.png)

   

5. 查看我的正在拍卖的NFT

   ![image-20211031194520927](C:\Users\zhw\AppData\Roaming\Typora\typora-user-images\image-20211031194520927.png)

   

6. 查看我的投资

   ![image-20211031194610793](C:\Users\zhw\AppData\Roaming\Typora\typora-user-images\image-20211031194610793.png)

   

7. 拍卖结束的NFT

   ![image-20211031194820355](C:\Users\zhw\AppData\Roaming\Typora\typora-user-images\image-20211031194820355.png)

   

8. 竞拍成功的NFT

   ![image-20211031194920251](C:\Users\zhw\AppData\Roaming\Typora\typora-user-images\image-20211031194920251.png)

   

9. 查看历史交易信息

   ![image-20211031195004944](C:\Users\zhw\AppData\Roaming\Typora\typora-user-images\image-20211031195004944.png)

   

10. 出价最高者认领

    ![image-20211031195051991](C:\Users\zhw\AppData\Roaming\Typora\typora-user-images\image-20211031195051991.png)



11. 拍卖失败后原主人认领

    ![image-20211031195152800](C:\Users\zhw\AppData\Roaming\Typora\typora-user-images\image-20211031195152800.png)

