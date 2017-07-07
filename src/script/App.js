import {Layout, Menu, Icon, Button, Popconfirm} from 'antd';
import {Link} from "react-router";
import React from "react";
import CookieUtil from './util/CookieUtil';
const {Header, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;

const functionLinks = [
    {link:'/App/OrderList',iconType:'user',name:'服务工单'},
    {link:'/App/PackageList',iconType:'gift',name:'产品'},
    {link:'/App/PackageSale',iconType:'filter',name:'渠道'},
    {link:'/App/Fitting',iconType:'tool',name:'配件'},
    {link:'/App/Service',iconType:'customer-service',name:'服务'},
    {link:'/App/BillList',iconType:'bars',name:'收单列表'},
    {link:'/App/RunningStock',iconType:'car',name:'常备库'},
    {link:'/App/TodayStock',iconType:'shopping-cart',name:'今日库'},
    {link:'/App/FittingOption',iconType:'setting',name:'仓库配置'},
];

//content标签中的表格
//这里是表格的列，columns数组中的一个JSON对象就是一列

//搭载的页面的整体布局
class App extends React.Component {
    state = {
        collapsed: false,
        mode: 'inline',
        links: [],
    };
    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({
            collapsed,
            mode: collapsed ? 'vertical' : 'inline',
        });
    }

    componentDidMount() {
        let role = CookieUtil.getCookie('role');
        let links = [];
        switch(role) {
            case '客服':
                links = [
                    functionLinks[0],
                ];
                break;
            case '运营':
                links = [
                    functionLinks[1],
                    functionLinks[2],
                ];
                break;
            case '技师':
                links = [
                    functionLinks[5],
                ];
                break;
            case '仓管':
                links = [
                    functionLinks[3],
                    functionLinks[8],
                ];
                break;
            case '客服主管':
                links = [
                    functionLinks[0],
                ];
                break;
            case '技师主管':
                links = [
                    functionLinks[5],
                    functionLinks[6],
                    functionLinks[7],
                ];
                break;
            case '服务总监':
                links = [
                    functionLinks[4],
                    functionLinks[5],
                    functionLinks[6],
                    functionLinks[7],
                ];
                break;
        }
        this.setState({links});
    }

    quitAccount(){
        this.props.history.pushState('/');
        CookieUtil.delCookie('name');
        CookieUtil.delCookie('role');
        CookieUtil.delCookie('id');
        CookieUtil.delCookie('regionId');
    }

    render() {
        let key = '';
        const pathName = window.location.hash.match(/#\/([a-zA-Z/]+)(\?.+|$)/);
        if(pathName){
            key = pathName[1];
        }
        console.log(key,666);
        switch(key){
            case 'App':
                key = '1';
                break;
            case 'App/PackageList':
                key = '2';
                break;
            case 'App/PackageSale':
                key = '3';
                break;
            case 'App/Fitting':
                key = '4';
                break;
            case 'App/Service':
                key = '5';
                break;
            case 'App/BillList':
                key = '6';
                break;
            case 'App/RunningStock':
                key = '7';
                break;
            case 'App/TodayStock':
                key = '8';
                break;
            case 'App/FittingOption':
                key = '9';
                break;
        }
        let items = this.state.links.map((item,index)=>{
            return (
                <Menu.Item key={index}>
                    <Link to={item.link}>
                        <Icon type={item.iconType} />
                        <span className="nav-text">{item.name}</span>
                    </Link>
                </Menu.Item>
            );
        });

        return (
            <Layout>
                <Sider
                    collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse}
                >
                    <div className="logo"/>
                    <Menu theme="dark" mode={this.state.mode} defaultSelectedKeys={[key]}>
                        {/*{items}*/}
                        <Menu.Item key="1">
                            <Link to="/App">
                                <Icon type="user"/>
                                <span className="nav-text">服务工单</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to="/App/PackageList">
                                <Icon type="gift" />
                                <span className="nav-text">产品</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link to="/App/PackageSale">
                                <Icon type="filter" />
                                <span className="nav-text">渠道</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Link to="/App/Fitting">
                                <Icon type="tool" />
                                <span className="nav-text">配件</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <Link to="/App/Service">
                                <Icon type="customer-service" />
                                <span className="nav-text">服务</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="6">
                            <Link to="/App/BillList">
                                <Icon type="bars" />
                                <span className="nav-text">收单列表</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="7">
                            <Link to="/App/RunningStock">
                                <Icon type="car" />
                                <span className="nav-text">常备库</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="8">
                            <Link to="/App/TodayStock">
                                <Icon type="shopping-cart" />
                                <span className="nav-text">今日库</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="9">
                            <Link to="/App/FittingOption">
                                <Icon type="setting" />
                                <span className="nav-text">仓库配置</span>
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{background: '#fff', padding: 0, position:'relative'}}>
                        <span style={{marginLeft: "15px",fontSize:'17px'}}>优典养车</span>
                        <div style={{position:'absolute',right:'15px',top:0}}>
                            <span style={{fontSize:'13px'}}>{CookieUtil.getCookie('role')+'：'+CookieUtil.getCookie('name')}</span>
                            <Popconfirm
                                title="确认退出 ？"
                                okText="确定"
                                cancelText="取消"
                                onConfirm={()=>{this.quitAccount()}}
                                onCancel={()=>{console.log('cancel')}}
                            >
                                <Button style={{marginLeft:'20px'}} type="primary">退出</Button>
                            </Popconfirm>
                        </div>
                    </Header>
                    <div className="ant-layout-content">
                        {this.props.children}
                    </div>
                </Layout>
            </Layout>
        );
    }
}

export default App;