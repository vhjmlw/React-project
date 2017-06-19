import {Table, Button, Modal, message, Row, Col, Form, Input, Cascader, DatePicker, Select} from "antd";
import React from "react";
import Request from "./util/Request"
import OrderInfo from "./OrderInfo";
import {browserHistory, Link} from "react-router";
import moment from 'moment';
const Option = Select.Option;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;

const statuses = [
    {value: '0', label: '新建'},
    {value: '1', label: '待服务'},
    {value: '2', label: '已服务'},
    {value: '3', label: '已收单'}
];

const columns = [{
    title: '客户姓名',
    dataIndex: 'customerName',
    key: 'customerName',
}, {
    title: '车牌',
    dataIndex: 'plate',
    key: 'plate',
}, {
    title: '电话',
    dataIndex: 'phone',
    key: 'phone',
}, {
    title: '服务产品',
    dataIndex: 'productName',
    key: 'productName',
}, {
    title: '发卡渠道',
    dataIndex: 'channelName',
    key: 'channelName',
}, {
    title: '服务市场',
    dataIndex: 'serviceRegion',
    key: 'serviceRegion',
}, {
    title: '服务时间',
    dataIndex: 'serviceDate',
    key: 'serviceDate',
}, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
}, {
    title: '操作',
    key: 'action',
    render: (text, record) => {
        return (<span>
                    <a onClick={() => {

                    }}>详情</a>
                    &nbsp;&nbsp;&nbsp;
                    <a onClick={() => {

                    }}>编辑</a>
                    &nbsp;&nbsp;&nbsp;
                    <a href="javascript:alert('打印页面');">打印</a>
                </span>)
    },
}];

class OrderList extends React.Component {
    state = {
        showFlag: 1,
        showDetailId: null,
        channels: [],
        products: [],
        serviceRegions: [],
        condition: {
            createDateBegin: "",
            createDateEnd: "",
            serviceDateBegin: "",
            serviceDateEnd: "",
            plate: "",
            phone: "",
            status: "",
            serviceUserId: "",
            serviceRegion: "",
            channelId: "",
            productId: "",
            pageSize: 10,
            currentPage: 1,
        },
        data: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
    };

    componentDidMount() {
        let serviceRegions = Request.synPost("serviceRegion/list");
        let products = Request.synPost("product/list");
        let channels = Request.synPost("channel/list", {status: 1});
        this.setState({
            serviceRegions: serviceRegions,
            channels: channels,
            products: products
        });
        this.search({});
    }

    search(condition) {
        condition = Object.assign(this.state.condition, condition);
        let pageData = Request.synPost("workOrder/list", condition);
        let data = this.backToFront(pageData.data);
        this.setState({
            showFlag: 1,
            showDetailId: null,
            condition: condition,
            data: data,
            currentPage: pageData.currentPage,
            pageSize: pageData.pageSize,
            total: pageData.totalNum
        });
    }

    handlePageChange(page, pageSize) {
        this.search({
            currentPage: page,
            pageSize: pageSize
        });
    }

    backToFront(data) {
        let result = [];
        for (let item of data) {
            item.serviceDate = item.serviceDate.substring(0, 4) + "-" + item.serviceDate.substring(4, 6) + "-" + item.serviceDate.substring(6, 8);
            item.status = statuses.map((e)=>{
                if (item.status == e.value) {
                    return e.label;
                }
            })[0];
            result.push(item);
        }
        return result;
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

    handleAddClick(event) {
        this.setState({
            showFlag: 2,
            showDetailId: null
        });
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

    changeCondition(obj) {
        let condition = this.state.condition;
        condition = Object.assign(condition, obj);
        this.setState({
            condition: condition
        });
    }

    render() {
        if (this.state.showFlag === 2) {
            return <OrderInfo
                showDetailId={this.state.showDetailId}
                back={
                    ()=>{
                        let condtion = {};
                        if (this.state.showDetailId === null) {
                            condtion = {
                                createDateBegin: "",
                                createDateEnd: "",
                                serviceDateBegin: "",
                                serviceDateEnd: "",
                                plate: "",
                                phone: "",
                                status: "",
                                serviceUserId: "",
                                serviceRegionName: "",
                                channelId: "",
                                productId: "",
                                pageSize: 10,
                                currentPage: 1,
                            }
                            this.search(condtion);
                        }
                    }
                }
            />;
        }

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
                            <Input
                                placeholder='请输入姓名'
                                value={this.state.condition.customerName}
                                onChange={(e)=>{
                                    this.changeCondition({
                                        customerName: e.target.value
                                    })
                                }}
                            />
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            label="车牌"
                            {...formItemLayout}
                        >
                            <Input
                                value={this.state.condition.plate}
                                onChange={(e)=>{
                                    this.changeCondition({
                                        plate: e.target.value
                                    })
                                }} placeholder='请输入车牌'/>
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            label="电话"
                            {...formItemLayout}
                        >
                            <Input
                                value={this.state.condition.phone}
                                onChange={(e)=>{
                                    this.changeCondition({
                                        phone: e.target.value
                                    })
                                }} placeholder='请输入电话'/>
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            label="渠道"
                            {...formItemLayout}
                        >
                            <Select
                                style={{ width: 120 }}
                                onChange={(value)=>{
                                    this.changeCondition({
                                        channelId: value
                                    })
                                }}
                                value={this.state.condition.channelId}
                            >
                                <Option value="">请选择</Option>
                                {(()=> {
                                    return this.state.channels.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.id}>{item.name}</Option>
                                        );
                                    });
                                })()}
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={6}>
                        <FormItem
                            label="服务市场"
                            {...formItemLayout}
                        >
                            <Select
                                style={{ width: 120 }}
                                onChange={(value)=>{
                                    this.changeCondition({
                                        serviceRegion: value
                                    })
                                }}
                                value={this.state.condition.serviceRegion}
                            >
                                <Option value="">请选择</Option>
                                {(()=> {
                                    return this.state.serviceRegions.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.id}>{item.name}</Option>
                                        );
                                    });
                                })()}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            label="时间"
                            {...formItemLayout}
                        >
                            <RangePicker
                                format="YYYY-MM-DD"
                                value={
                                    (()=>{
                                        let beginTime, endTime;
                                        if (this.state.condition.serviceDateBegin) {
                                            beginTime = moment(this.state.condition.serviceDateBegin, 'YYYYMMDD')
                                        }
                                        if (this.state.condition.serviceDateEnd) {
                                            endTime = moment(this.state.condition.serviceDateEnd, 'YYYYMMDD')
                                        }
                                        return [beginTime, endTime]
                                    })()
                                }
                                onChange={(dates, dateStrings) => {
                                    let condition = this.state.condition, beginTime = dateStrings[0], endTime = dateStrings[1];
                                    beginTime = beginTime.replace(/(-)/g, "").replace(" ", "").replace(/(:)/g, "");
                                    condition.serviceDateBegin = beginTime;
                                    endTime = endTime.replace(/(-)/g, "").replace(" ", "").replace(/(:)/g, "");
                                    condition.serviceDateEnd = endTime;
                                    this.setState({
                                        condition: condition
                                    });
                                }}
                                size='default'/>
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            label="状态"
                            {...formItemLayout}
                        >
                            <Select
                                style={{ width: 120 }}
                                onChange={(value)=>{
                                    this.changeCondition({
                                        status: value
                                    });
                                }}
                                value={this.state.condition.status}
                            >
                                <Option value="">请选择</Option>
                                {(()=> {
                                    return statuses.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.value}>{item.label}</Option>
                                        );
                                    });
                                })()}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            label="服务产品"
                            {...formItemLayout}
                        >
                            <Select
                                style={{ width: 120 }}
                                onChange={(value)=>{
                                    this.changeCondition({
                                        productId: value
                                    });
                                }}
                                value={this.state.condition.productId}
                            >
                                <Option value="">请选择</Option>
                                {(()=> {
                                    return this.state.products.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.id}>{item.name}</Option>
                                        );
                                    });
                                })()}
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <div className="clearfix">
                    <Button type="primary">打印工单</Button>
                    <Button type="primary" onClick={this.handleAddClick.bind(this)}>新增</Button>
                    <Button type="primary" onClick={()=>this.search({pageSize: 10, currentPage: 1})}>查询</Button>
                    <Button type="primary" onClick={()=>{
                        this.setState({
                            condition: {
                                createDateBegin: "",
                                createDateEnd: "",
                                serviceDateBegin: "",
                                serviceDateEnd: "",
                                plate: "",
                                phone: "",
                                status: "",
                                serviceUserId: "",
                                serviceRegion: "",
                                channelId: "",
                                productId: "",
                                pageSize: 10,
                                currentPage: 1
                            }
                        });
                    }}>重置</Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={this.state.data}
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
