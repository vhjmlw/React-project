import React from "react";
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
import {Link} from "react-router";

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
          <div className="logo" />
          <Menu theme="dark" mode={this.state.mode} defaultSelectedKeys={['6']}>
            <SubMenu
              key="sub1"
              title={<span><Icon type="aliwangwang-o" /><span className="nav-text">客服</span></span>}
            >
              <Menu.Item key="1"><Link to="/">项目一</Link></Menu.Item>
              <Menu.Item key="2"><Link to="/App">项目二</Link></Menu.Item>
              <Menu.Item key="3"><Link to="/App">项目三</Link></Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={<span><Icon type="team" /><span className="nav-text">套餐</span></span>}
            >
              <Menu.Item key="4"><Link to="/App/PackageList">项目一</Link></Menu.Item>
              <Menu.Item key="5"><Link to="/App/PackageSale">项目二</Link></Menu.Item>
            </SubMenu>
            <Menu.Item key="6">
              <span>
                <Icon type="file" />
                <span className="nav-text">菜单三</span>
              </span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0}}> <h2 style={{marginLeft:"15px"}}>中德联信</h2> </Header>
          <div className="ant-layout-content">
            {this.props.children}
          </div>
          <Footer style={{ textAlign: 'center' }}>
            苏州中德联信汽车服务股份有限公司
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default App;
