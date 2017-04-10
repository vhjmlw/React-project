import {Table,Button,Modal} from "antd";
import React from "react";
import {browserHistory,Link} from "react-router";

class TableList extends React.Component{
    state = {
        columns: [{
            title: '客户姓名',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '车牌',
            dataIndex: 'plateNumber',
            key: 'plateNumber',
        }, {
            title: '电话',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        }, {
            title: '服务产品',
            dataIndex: 'product',
            key: 'product',
        }, {
            title: '发卡渠道',
            dataIndex: 'cardChannel',
            key: 'cardChannel',
        }, {
            title: '服务区域',
            dataIndex: 'area',
            key: 'area',
        }, {
            title: '服务时间',
            dataIndex: 'serviceDate',
            key: 'serviceDate',
        }, {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
        },{
            title: '操作',
            key: 'action',
            render: (text, record) => {
                return (<span>
                    <a onClick={this.handleInfo(record).bind(this)}>详情</a>&nbsp;&nbsp;&nbsp;
                    <a onClick={this.handleModify(record).bind(this)} >编辑</a>&nbsp;&nbsp;&nbsp;
                    <a href="javascript:alert('打印页面');">打印</a>
                </span>)
            },
        }]
    };

    handleInfo(record) {
        return function () {
            Modal.info({
            title: '',
            okText: '确定',
            // width: '50%',
            onOk: function(){console.log('OK')},
            onCancel: function() {console.log('cancle')},//虽然用不到取消按钮，但是还是要设置onCancel事件，如果不设置onCancel的话，点击按钮会报错
            maskClosable: true,
            content: (
                <div>
                    <table>
                        <caption><h2>客户信息</h2></caption>
                        <tbody>
                        <tr><td>电话</td><td>{record.phoneNumber}</td></tr>
                        <tr><td>姓名</td><td>{record.name}</td></tr>
                        <tr><td>车牌</td><td>{record.plateNumber}</td></tr>
                        <tr><td>验证码</td><td>{record.captcha}</td></tr>
                        <tr><td>产品类型</td><td>{record.product[0]}</td></tr>
                        <tr><td>发卡渠道</td><td>{record.cardChannel[0]}</td></tr>
                        <tr><td>备注</td><td>{record.customComment}</td></tr>
                        </tbody>
                    </table>
                    <table>
                        <caption><h2>车辆信息</h2></caption>
                        <tbody>
                        <tr><td>品牌</td><td>{record.brand[0]}</td></tr>
                        <tr><td>车型</td><td>{record.cartype[0]}</td></tr>
                        <tr><td>排量</td><td>{record.displacement[0]}</td></tr>
                        <tr><td>年份</td><td>{record.purchaseDate}</td></tr>
                        <tr><td>机油品牌</td><td>{record.oilBrand.join('—')}</td></tr>
                        <tr><td>机滤品牌</td><td>{record.filterBrand}</td></tr>
                        <tr><td>备注</td><td>{record.carComment}</td></tr>
                        </tbody>
                    </table>
                    <table>
                        <caption><h2>服务信息</h2></caption>
                        <tbody>
                        <tr><td>区域</td><td>{record.address[0]}</td></tr>
                        <tr><td>服务地址</td><td>{record.address.join('—')}</td></tr>
                        <tr><td>详细地址</td><td>{record.detailAddress}</td></tr>
                        <tr><td>服务时间</td><td>{record.serviceDate}</td></tr>
                        <tr><td>状态</td><td>{record.state}</td></tr>
                        <tr><td>备注</td><td>{record.serviceComment}</td></tr>
                        </tbody>
                    </table>
                </div>
            ),
        });
        }
    };

    handleModify(record) {
        return function () {
            this.props.history.pushState(null,"/App/ModifyInfo");
            window.localStorage.setItem('totalInfo',JSON.stringify(record));
            console.log(window.localStorage);
        }
    }

    //点击新增按钮的执行逻辑，<Button><Link to='App/OrderInfo'>新增</Link></Button>会有浏览器兼容性问题
    //火狐 IE浏览器下点击新增无效，页面无法跳转，所以使用onClick点击事件的方式
    handleClick (event) {
        event.preventDefault();
        // browserHistory.push("/App/MyForm");
        this.props.history.pushState(null, "/App/OrderInfo");//API已经过时了，但是暂时想不出其他的解决办法
    }
    render(){
        console.log(JSON.parse(window.localStorage.getItem("tableList")));
        return (
            <div className="antd-layout-TableList">
                <div className="clearfix">
                    <Button type="primary">打印工单</Button>
                    <Button type="primary" onClick={this.handleClick.bind(this)}>新增</Button>
                </div>
                <Table columns={this.state.columns} dataSource={JSON.parse(window.localStorage.getItem("tableList"))} />
            </div>
        );
    }
}

export default TableList;
