import {Layout, Menu, Icon} from 'antd';
import {Link} from "react-router";
import React from "react";
const {Header, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;

//content标签中的表格
//这里是表格的列，columns数组中的一个JSON对象就是一列

//搭载的页面的整体布局
class App extends React.Component {
    state = {
        collapsed: false,
        mode: 'inline',
    };
    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({
            collapsed,
            mode: collapsed ? 'vertical' : 'inline',
        });
    }

    render() {
        return (
            <Layout>
                <Sider
                    collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse}
                >
                    <div className="logo"/>
                    <Menu theme="dark" mode={this.state.mode} defaultSelectedKeys={['6']}>
                        <Menu.Item key="1">
                            <Link to="/">
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
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{background: '#fff', padding: 0}}><h2 style={{marginLeft: "15px"}}>优典养车</h2></Header>
                    <div className="ant-layout-content">
                        {this.props.children}
                    </div>
                    <Footer style={{textAlign: 'center'}}>
                        苏州中德联信汽车服务股份有限公司
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

export default App;