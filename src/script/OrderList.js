import {Table, Button, Modal, message} from "antd";
import React from "react";
import {browserHistory,Link} from "react-router";

class OrderList extends React.Component{
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
        }],
        orderListData: null,
        currentPage: 1,
        totalPage: 1,
        pageSize: 10,
    };

    backToFront(source){
        const registerDate = source.registerDate ? source.registerDate.substr(0,4)+'-'+source.registerDate.substr(4,2)+'-'+source.registerDate.substr(6,2) : '';
        const serviceTime = source.serviceTime ? source.serviceTime.substr(0,4)+'-'+source.serviceTime.substr(4,2)+'-'+source.serviceTime.substr(6,2) : '';
        const engineOilBrand = source.engineOilBrand ? source.engineOilBrand.split('/') : [];
        const serviceAddress = source.serviceAddress ? source.serviceAddress.split('/') : [];
        return {
            phoneNumber: source.phone || '',
            name: source.name || '',
            sex: source.sex === true ? '男' : '女',
            plateNumber: source.plate || '',
            captcha: source.cardId || '',
            product: [source.productType] || [],
            cardChannel: [source.cardChannel] || [],
            customComment: source.customComment || '',
            brand: [source.brandId] || [],
            cartype: [source.modelId] || [],
            displacement: [source.displacement] || [],
            purchaseDate: registerDate,
            oilBrand: engineOilBrand,
            filterBrand: [source.engineFilterBrand] || [],
            carComment: source.carComment || '',
            address: serviceAddress,
            detailAddress: source.detailAddress || '',
            state: source.status || '',
            serviceDate: serviceTime,
            serviceComment: source.serviceComment || '',
        };
    }

    handleInfo(record) {
        return function () {
            let customInfo = null;
            let carInfo = null;
            let serviceInfo = null;
            let totalInfo = {};
            const customerId = record.key;
            const carId = record.carId;
            const maintainId = record.maintainId;
            fetch(`v1/customer/${customerId}`).then((response)=>{
                return response.json();
            }).then((json)=>{
                console.log(json);
                if(json.code === '200'){
                    customInfo = json.data;
                    customInfo.customComment = json.data.remark;
                    return fetch(`v1/car/${carId}`);
                } else {
                    message.warning(json.message);
                }
            }).then((response)=>{
                return response.json();
            }).then((json)=>{
                console.log(json);
                if(json.code === "200"){
                    carInfo = json.data;
                    carInfo.carComment = json.data.remark;
                    return fetch(`v1/maintain/${maintainId}`);
                } else {
                    message.warning(json.message);
                }
            }).then((response)=>{
                return response.json();
            }).then((json)=>{
                console.log(json);
                if(json.code === '200'){
                    serviceInfo = json.data;
                    serviceInfo.serviceComment = json.data.remark;
                    Object.assign(totalInfo,customInfo,carInfo,serviceInfo);

                    totalInfo.engineFilterBrand = carInfo.engineFilterBrand;
                    totalInfo.engineOilBrand = carInfo.engineOilBrand;
                    console.log(totalInfo);
                    totalInfo = this.backToFront(totalInfo);
                    console.log(totalInfo);
                    if(totalInfo){
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
                                        <tr><td>电话</td><td>{totalInfo.phoneNumber}</td></tr>
                                        <tr><td>姓名</td><td>{totalInfo.name}</td></tr>
                                        <tr><td>性别</td><td>{totalInfo.sex}</td></tr>
                                        <tr><td>车牌</td><td>{totalInfo.plateNumber}</td></tr>
                                        <tr><td>验证码</td><td>{totalInfo.captcha}</td></tr>
                                        <tr><td>产品类型</td><td>{totalInfo.product[0]}</td></tr>
                                        <tr><td>发卡渠道</td><td>{totalInfo.cardChannel[0]}</td></tr>
                                        <tr><td>备注</td><td>{totalInfo.customComment}</td></tr>
                                        </tbody>
                                    </table>
                                    <table>
                                        <caption><h2>车辆信息</h2></caption>
                                        <tbody>
                                        <tr><td>品牌</td><td>{totalInfo.brand[0]}</td></tr>
                                        <tr><td>车型</td><td>{totalInfo.cartype[0]}</td></tr>
                                        <tr><td>排量</td><td>{totalInfo.displacement[0]}</td></tr>
                                        <tr><td>年份</td><td>{totalInfo.purchaseDate}</td></tr>
                                        <tr><td>机油品牌</td><td>{totalInfo.oilBrand.join('/')}</td></tr>
                                        <tr><td>机滤品牌</td><td>{totalInfo.filterBrand}</td></tr>
                                        <tr><td>备注</td><td>{totalInfo.carComment}</td></tr>
                                        </tbody>
                                    </table>
                                    <table>
                                        <caption><h2>服务信息</h2></caption>
                                        <tbody>
                                        <tr><td>区域</td><td>{totalInfo.address[0]}</td></tr>
                                        <tr><td>服务地址</td><td>{totalInfo.address.join('/')}</td></tr>
                                        <tr><td>详细地址</td><td>{totalInfo.detailAddress}</td></tr>
                                        <tr><td>服务时间</td><td>{totalInfo.serviceDate}</td></tr>
                                        <tr><td>状态</td><td>{totalInfo.state}</td></tr>
                                        <tr><td>备注</td><td>{totalInfo.serviceComment}</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            ),
                        });
                    }
                } else {
                    message.warning(json.message);
                }
            }).catch((error)=>{
                throw error;
            });
        }

    };

    handleModify(record) {
        return function () {
            const modifyInfoUrl = `/App/ModifyInfo?customerId=${record.key}&carId=${record.carId}&maintainId=${record.maintainId}`;
            this.props.history.pushState(null,modifyInfoUrl);
            window.localStorage.setItem('totalInfo',JSON.stringify(record));
        }
    }

    //点击新增按钮的执行逻辑，<Button><Link to='App/OrderInfo'>新增</Link></Button>会有浏览器兼容性问题
    //火狐 IE浏览器下点击新增无效，页面无法跳转，所以使用onClick点击事件的方式
    handleClick (event) {
        event.preventDefault();
        // browserHistory.push("/App/MyForm");
        this.props.history.pushState(null, "/App/OrderInfo");//API已经过时了，但是暂时想不出其他的解决办法
    }

    handleConvert(sourceArray){
        const newArray = sourceArray.map((source)=>{
            const serviceTime = source.serviceTime.substr(0,4)+'-'+source.serviceTime.substr(4,2)+'-'+source.serviceTime.substr(6,2);
            return {
                key: source.customerId,
                carId: source.carId,
                maintainId: source.maintainId,
                name: source.customerName,
                plateNumber: source.plate,
                phoneNumber: source.phone,
                product: source.productName,
                cardChannel: source.cardChannel,
                area: source.address,
                serviceDate: serviceTime,
                state: source.status,
            };
        });
        return newArray;
    }

    componentDidMount(){
        let orderListData = [];
        fetch('v1/sheet/list',{
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded',
            }),
        }).then((response)=>{
            if(response.ok){
                return response.json();
            }
        }).then((json)=>{
            if(json.code === '200'){
                orderListData = this.handleConvert(json.data);
                this.setState({
                    orderListData
                });
                console.log(orderListData);
            } else {
                message.warning(json.message);
            }
        }).catch((error)=>{
            throw error;
        });
    }

    handleChangePage(page, pageSize){

    }

    render(){

        return (
            <div className="antd-layout-OrderList">
                <div className="clearfix">
                    <Button type="primary">打印工单</Button>
                    <Button type="primary" onClick={this.handleClick.bind(this)}>新增</Button>
                </div>
                <Table
                    columns={this.state.columns}
                    dataSource={this.state.orderListData}
                    pagination={{
                        current: this.state.currentPage,
                        pageSize: this.state.pageSize,
                        total: this.state.totalPage,
                        onChange: (page, pageSize)=>{this.handleChangePage(page, pageSize)}
                    }}
                />
            </div>
        );
    }
}

export default OrderList;
