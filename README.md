### 使用create-react-app + ant-design快速搭建前端项目

#### create-react-app

create-react-app是来自于Facebook出品的零配置命令行工具，能够帮你自动创建基于Webpack+ES6的最简易的React项目模板，有助于初学者快速上手实践。

create-react-app的方式也非常简单，可以直接使用 npm 命令进行全局安装。

```
npm install -g create-react-app
```

新建一个项目

```
create-react-app antd-demo
```

等待一段时间后，工具会自动初始化一个`antd-demo`目录并安装 React 项目的各种必要依赖。
进入项目并启动。

```
cd antd-demo
npm start
```

此时浏览器会访问 http://localhost:3000/ ，看到 Welcome to React 的界面就算成功了。

使用create-react-app生成的目录结构如下：
```
├── README.md
├── package.json
├── .gitignore
├── node_modules
├── public
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   └── logo.svg
└── yarn.lock
```

目前为止，已经使用create-react-app脚手架搭建好了一个react项目。

如果需要对 create-react-app 的默认配置进行自定义。可以使用 eject 命令将所有内建的配置暴露出来。

```
npm run eject
```

以上指令执行完后，原项目目录里面会新生成两个目录：`config`  `scripts`    
`config`目录存放的是webpack的配置文件。   
`scripts`目录存放的是package.json配置文件中scripts字段用到的脚本文件。


**create-react-app的三个命令：**    
1.npm start：开发阶段的命令    
> "start": "node scripts/start.js"   执行npm start的时候调用start.js文件    

执行该指令之后，将会在public目录下开启一个服务器，自动读取index.html文件。更改源代码，效果会在浏览器同步的显示。    
执行该指令的时候会调用config目录下的webpack.config.dev.js配置文件进行打包。

2.npm run build：部署阶段的命令    
> "build": "node scripts/build.js"  执行npm run build的时候调用build.js文件

执行该指令的时候，会调用config目录下的webpack.config.prod.js配置文件进行打包。    
执行该命令之后，会自动将整个应用打包发布，它会自动使用Webpack控件进行优化与压缩，新生成一个`build`目录，目录中存放的是待发布的文件。    

3.npm run test：测试命令    
> 暂时没用过

```
npm run如果不加任何参数，直接运行，会列出package.json里面所有可以执行的脚本命令。
npm内置了两个命令简写，npm test等同于执行npm run test，npm start等同于执行npm run start。
```

现在整个项目的完整目录结构如下：
```
├── build					//npm run build命令执行后新生成的目录，文件待部署
│   ├── static/
│   ├── asset-manifest.json
│   ├── favicon.ico
│   └── index.html
├── README.md				//create-react-app的官方文档
├── package.json			//npm的配置文件
├── .gitignore				//记录不需要使用git版本控制的文件或目录
├── node_modules/			//npm安装的package都在这里面			
├── config					//配置文件夹
│   ├── jest/
│   ├── env.js
│   ├── paths.js
│   ├── polyfills.js
│   ├── webpack.config.dev.js	//webpack的配置文件，npm start的时候调用
│   └── webpack.config.prod.js	//webpack的配置文件，npm run build的时候调用
├── scripts
│   ├── build.js				//npm run build时执行的js文件
│   ├── start.js				//npm run start时执行的js文件
│   └── test.js					//npm run test时执行的js文件
├── public						//npm run start时在此目录开启一个服务器
│   ├── favicon.ico
│   └── index.html
├── src							//项目的源代码放在此目录
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   └── logo.svg
└── yarn.lock					//package.json配置文件的补充文件
```

**开发阶段的跨域问题：**    

执行npm run start命令后，会开启一个服务器，在开发阶段如果需要调用后台的API接口与后台进行交互，会遇到跨域的问题，解决办法如下：    
在package.json配置文件中新添加一个字段：`proxy": "http://192.168.1.128:8088"`    
这样的话，webpack开启的本地服务器会作为一个代理服务器，将请求转发给我们指定的服务器，如这里的http://192.168.1.128:8088 从而解决了跨域的问题。    

详情可以参考链接：    
https://segmentfault.com/q/1010000008508440   
https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#proxying-api-requests-in-development

关于create-react-app，详情可以参考官方链接：   
https://github.com/facebookincubator/create-react-app

#### ant-design    

Ant Design是第一个由国内团队开发的面向世界的集视觉规范、交互模式、前端组件于一体的Web设计语言，或者可以称为Web设计规范。    
Ant Design 提供了一套非常完整的 组件化设计规范 与 组件化编码规范，大幅提高了部分产品的设计研发效率及质量。   

在create-react-app搭建的项目中使用ant-design：     
**使用npm安装antd：**

```
npm install antd --save
```

**在src/App.js文件中，引入antd的按钮组件：**

```javascript
//使用ES6的语法，import引入需要使用的组件即可，如Button
import React, { Component } from 'react';
import { Button } from 'antd';
class App extends Component {
  render() {
    return (
      <div className="App">
        <Button type="primary">Button</Button>
      </div>
    );
  }
}

export default App;
```

**在src/App.css文件中，在文件顶部引入 antd/dist/antd.css：**    

```
/*手动引入ant-design的样式文件*/
@import '~antd/dist/antd.css';

.App {
  text-align: center;
}

...
```

关于ant-design，详情可以参考链接：    
https://ant.design/docs/react/introduce-cn    
https://www.zhihu.com/question/33629737     

#### react-router

React Router 一个针对React而设计的路由解决方案、可以友好的帮你解决React components 到URl之间的同步映射关系。

