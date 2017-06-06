import {Table, Button, Modal, message, Row, Col, Form, Input, Cascader, DatePicker} from "antd";
import React from "react";
import {browserHistory, Link} from "react-router";
const FormItem = Form.Item;
const {RangePicker} = DatePicker;

const cardChannels = [{
    value: '超市赠送',
    label: '超市赠送',
}, {
    value: '自己买的',
    label: '自己买的',
}];
const area = [
    {value: '苏州', label: '苏州'},
    {value: '无锡', label: '无锡'},
    {value: '常熟', label: '常熟'}
];
const status = [
    {value: '已服务', label: '已服务'},
    {value: '待服务', label: '待服务'}
];
const products = [{
    value: '上门维修',
    label: '上门维修',
}, {
    value: '到店维修',
    label: '到店维修',
}];

class OrderList extends React.Component {
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
            title: '服务市场',
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
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => {
                return (<span>
                    <a onClick={this.handleInfo(record).bind(this)}>详情</a>&nbsp;&nbsp;&nbsp;
                    <a onClick={this.handleModify(record).bind(this)}>编辑</a>&nbsp;&nbsp;&nbsp;
                    <a href="javascript:alert('打印页面');">打印</a>
                </span>)
            },
        }],
        orderListData: null,
        currentPage: 1,
        totalPage: 1,
        pageSize: 10,
        total: 0,
    };

    backToFront(source) {
        let registerDate = source.registerDate;
        registerDate = registerDate ? registerDate.substr(0, 4) + '-' + registerDate.substr(4, 2) + '-' + registerDate.substr(6, 2) : '';
        let serviceTime = source.serviceTime;
        serviceTime = serviceTime ? serviceTime.substr(0, 4) + '-' + serviceTime.substr(4, 2) + '-' + serviceTime.substr(6, 2) : '';
        let engineOilBrand = source.engineOilBrand;
        engineOilBrand = engineOilBrand ? engineOilBrand.split('/') : [];
        let serviceAddress = source.serviceAddress;
        serviceAddress = serviceAddress ? serviceAddress.split('/') : [];
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
            fetch(`v1/customer/${customerId}`).then((response)=> {
                return response.json();
            }).then((json)=> {
                console.log(json);
                if (json.code === '200') {
                    customInfo = json.data;
                    customInfo.customComment = json.data.remark;
                    return fetch(`v1/car/${carId}`);
                } else {
                    message.warning(json.message);
                }
            }).then((response)=> {
                return response.json();
            }).then((json)=> {
                console.log(json);
                if (json.code === "200") {
                    carInfo = json.data;//data为null??
                    carInfo.carComment = json.data.remark;
                    return fetch(`v1/maintain/${maintainId}`);
                } else {
                    message.warning(json.message);
                }
            }).then((response)=> {
                return response.json();
            }).then((json)=> {
                console.log(json);
                if (json.code === '200') {
                    serviceInfo = json.data;
                    serviceInfo.serviceComment = json.data.remark;
                    Object.assign(totalInfo, customInfo, carInfo, serviceInfo);

                    totalInfo.engineFilterBrand = carInfo.engineFilterBrand;
                    totalInfo.engineOilBrand = carInfo.engineOilBrand;
                    console.log(totalInfo);
                    totalInfo = this.backToFront(totalInfo);
                    console.log(totalInfo);
                    if (totalInfo) {
                        Modal.info({
                            title: '',
                            okText: '确定',
                            width: '550px',
                            onOk: function () {
                                console.log('OK')
                            },
                            onCancel: function () {
                                console.log('cancle')
                            },//虽然用不到取消按钮，但是还是要设置onCancel事件，如果不设置onCancel的话，点击按钮会报错
                            maskClosable: true,
                            content: (
                                <div>
                                    <table>
                                        <caption><h2>客户信息</h2></caption>
                                        <tbody>
                                        <tr>
                                            <td>电话</td>
                                            <td>{totalInfo.phoneNumber}</td>
                                        </tr>
                                        <tr>
                                            <td>姓名</td>
                                            <td>{totalInfo.name}</td>
                                        </tr>
                                        <tr>
                                            <td>性别</td>
                                            <td>{totalInfo.sex}</td>
                                        </tr>
                                        <tr>
                                            <td>车牌</td>
                                            <td>{totalInfo.plateNumber}</td>
                                        </tr>
                                        <tr>
                                            <td>验证码</td>
                                            <td>{totalInfo.captcha}</td>
                                        </tr>
                                        <tr>
                                            <td>产品类型</td>
                                            <td>{totalInfo.product[0]}</td>
                                        </tr>
                                        <tr>
                                            <td>发卡渠道</td>
                                            <td>{totalInfo.cardChannel[0]}</td>
                                        </tr>
                                        <tr>
                                            <td>备注</td>
                                            <td>{totalInfo.customComment}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <table>
                                        <caption><h2>车辆信息</h2></caption>
                                        <tbody>
                                        <tr>
                                            <td>品牌</td>
                                            <td>{totalInfo.brand[0]}</td>
                                        </tr>
                                        <tr>
                                            <td>车型</td>
                                            <td>{totalInfo.cartype[0]}</td>
                                        </tr>
                                        <tr>
                                            <td>排量</td>
                                            <td>{totalInfo.displacement[0]}</td>
                                        </tr>
                                        <tr>
                                            <td>年份</td>
                                            <td>{totalInfo.purchaseDate}</td>
                                        </tr>
                                        <tr>
                                            <td>机油品牌</td>
                                            <td>{totalInfo.oilBrand.join('/')}</td>
                                        </tr>
                                        <tr>
                                            <td>机滤品牌</td>
                                            <td>{totalInfo.filterBrand}</td>
                                        </tr>
                                        <tr>
                                            <td>备注</td>
                                            <td>{totalInfo.carComment}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <table>
                                        <caption><h2>服务信息</h2></caption>
                                        <tbody>
                                        <tr>
                                            <td>区域</td>
                                            <td>{totalInfo.address[0]}</td>
                                        </tr>
                                        <tr>
                                            <td>服务地址</td>
                                            <td>{totalInfo.address.join('/')}</td>
                                        </tr>
                                        <tr>
                                            <td>详细地址</td>
                                            <td>{totalInfo.detailAddress}</td>
                                        </tr>
                                        <tr>
                                            <td>服务时间</td>
                                            <td>{totalInfo.serviceDate}</td>
                                        </tr>
                                        <tr>
                                            <td>状态</td>
                                            <td>{totalInfo.state}</td>
                                        </tr>
                                        <tr>
                                            <td>备注</td>
                                            <td>{totalInfo.serviceComment}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ),
                        });
                    }
                } else {
                    message.warning(json.message);
                }
            }).catch((error)=> {
                throw error;
            });
        }

    };

    handleModify(record) {
        return function () {
            const modifyInfoUrl = `/App/ModifyInfo?customerId=${record.key}&carId=${record.carId}&maintainId=${record.maintainId}`;
            this.props.history.pushState(null, modifyInfoUrl);
            window.localStorage.setItem('totalInfo', JSON.stringify(record));
        }
    }

    //点击新增按钮的执行逻辑，<Button><Link to='App/OrderInfo'>新增</Link></Button>会有浏览器兼容性问题
    //火狐 IE浏览器下点击新增无效，页面无法跳转，所以使用onClick点击事件的方式
    handleAddClick(event) {
        event.preventDefault();
        // browserHistory.push("/App/MyForm");
        this.props.history.pushState(null, "/App/OrderInfo");//API已经过时了，但是暂时想不出其他的解决办法
    }

    handleConvert(sourceArray) {
        const newArray = sourceArray.map((source)=> {
            let serviceTime = source.serviceTime;
            if (serviceTime) {
                serviceTime = serviceTime.substr(0, 4) + '-' + serviceTime.substr(4, 2) + '-' + serviceTime.substr(6, 2);
            }
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

    componentDidMount() {
        let orderListData = [];
        fetch('v1/sheet/list', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded',
            }),
            body: `page=1&pageSize=10`
        }).then((response)=> {
            if (response.ok) {
                return response.json();
            }
        }).then((json)=> {
            if (json.code === '200') {
                orderListData = this.handleConvert(json.data.list);
                this.setState({
                    orderListData,
                    total: json.data.total,
                });
                console.log(orderListData);
                console.log(this.state.totalPage);
            } else {
                message.warning(json.message);
            }
        }).catch((error)=> {
            throw error;
        });
    }

    handlePageChange(page, pageSize) {
        fetch('v1/sheet/list', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded',
            }),
            body: `page=${page}&pageSize=${pageSize}`
        }).then((response)=> {
            return response.json();
        }).then((json)=> {
            if (json.code === '200') {
                const orderListData = this.handleConvert(json.data.list);
                this.setState({
                    orderListData,
                    currentPage: page,
                });
            } else {
                message.warning(json.message);
            }
        })
    }

    render() {
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
        };

        return (
            <div className="antd-layout-OrderList">
                <Row gutter={16}>
                    <Col span={6}>
                        <FormItem
                            label="客户姓名"
                            {...formItemLayout}
                        >
                            <Input placeholder='请输入姓名'/>
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            label="车牌"
                            {...formItemLayout}
                        >
                            <Input placeholder='请输入车牌'/>
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            label="电话"
                            {...formItemLayout}
                        >
                            <Input placeholder='请输入电话'/>
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            label="渠道"
                            {...formItemLayout}
                        >
                            <Cascader options={cardChannels} size="large" style={{width: "110px"}}
                                      placeholder="请选择发卡渠道"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={6}>
                        <FormItem
                            label="服务市场"
                            {...formItemLayout}
                        >
                            <Cascader options={area} size="large" style={{width: '110px'}} placeholder="请选择服务市场"/>
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            label="时间"
                            {...formItemLayout}
                        >
                            <RangePicker size='default'/>
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            label="状态"
                            {...formItemLayout}
                        >
                            <Cascader options={status} size="large" style={{width: '110px'}} placeholder="请选择状态"/>
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            label="服务产品"
                            {...formItemLayout}
                        >
                            <Cascader options={products} size="large" style={{width: "110px"}} placeholder="请选择服务产品"/>
                        </FormItem>
                    </Col>
                </Row>
                <div className="clearfix">
                    <Button type="primary">打印工单</Button>
                    <Button type="primary" onClick={this.handleAddClick.bind(this)}>新增</Button>
                    <Button type="primary">查询</Button>
                    <Button type="primary">重置</Button>
                </div>
                <Table
                    columns={this.state.columns}
                    dataSource={this.state.orderListData}
                    pagination={{
                        current: this.state.currentPage,
                        pageSize: this.state.pageSize,
                        total: this.state.total,
                        onChange: (page, pageSize)=> {
                            this.handlePageChange(page, pageSize)
                        }
                    }}
                />
            </div>
        );
    }
}

export default OrderList;
