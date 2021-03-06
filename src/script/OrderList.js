import {Table, Button, Modal, message, Row, Col, Form, Input, Cascader, DatePicker, Select} from "antd";
import React from "react";
import Request from "./util/Request"
import OrderInfo from "./OrderInfo";
import {browserHistory, Link} from "react-router";
import moment from 'moment';
import CookieUtil from './util/CookieUtil';
const Option = Select.Option;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;

const statuses = [
    {value: '0', label: '新建'},
    {value: '1', label: '待服务'},
    {value: '2', label: '已服务'},
    {value: '3', label: '已收单'}
];

class OrderList extends React.Component {
    state = {
        columns: [{
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
            dataIndex: 'serviceRegionName',
            key: 'serviceRegionName',
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
                    <a onClick={this.handleInfo.bind(this)(record)}>详情</a>
                    <span className="ant-divider"/>
                    <a onClick={this.handleModify.bind(this)(record)}>编辑</a>
                </span>)
            },
        }],
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
            serviceRegionName: "",
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
        let channels = Request.synPost("channel/listByNameAndCode");
        this.setState({
            serviceRegions: serviceRegions,
            channels: channels,
            products: products
        });
        this.search({});
    }

    //查询的逻辑
    search(condition) {
        const role = CookieUtil.getCookie('role');
        const createUserId = CookieUtil.getCookie('id');
        if(role === '客服'){
            condition.createUserId = createUserId;
        }

        condition = Object.assign(this.state.condition, condition);
        let pageData = Request.synPost("/workOrder/list", condition);
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

    //点击分页的逻辑
    handlePageChange(page, pageSize) {
        this.search({
            currentPage: page,
            pageSize: pageSize
        });
    }

    //后端请求返回的字段转换为前端字段
    backToFront(data) {
        let result = [];
        for (let item of data) {
            item.serviceDate = item.serviceDate.substring(0, 4) + "-" + item.serviceDate.substring(4, 6) + "-" + item.serviceDate.substring(6, 8);
            item.key = item.workOrderId;
            for(let status of statuses){
                if(item.status == status.value){
                    item.status = status.label;
                }
            }
            result.push(item);
        }
        return result;
    }

    //点击详情的逻辑
    handleInfo(record) {
        return ()=> {
            const workOrderInfo = Request.synPost('workOrder/getDetailByWorkOrderId', {id: record.key});
            const formItemLayout = {
                labelCol: {span: 8},
                wrapperCol: {span: 16}
            };
            if (workOrderInfo) {
                const serviceDate = workOrderInfo.serviceDate;
                let date = '';
                date += serviceDate.substr(0,4) + '-' + serviceDate.substr(4,2) + '-' + serviceDate.substr(6,2);
                // date += ' ' + serviceDate.substr(8,2) + ':' + serviceDate.substr(10,2) + ':' + serviceDate.substr(12,2);
                let verifyStatus = '';
                switch (workOrderInfo.verifyStatus){
                    case 0:
                        verifyStatus = '未验证';
                        break;
                    case 1:
                        verifyStatus = '验证成功';
                        break;
                    case 9:
                        verifyStatus = '验证失败';
                        break;
                }
                Modal.info({
                    title: '',
                    okText: '确定',
                    width: '450px',
                    onOk: function () {
                        console.log('OK')
                    },
                    onCancel: function () {
                        console.log('cancle')
                    },//虽然用不到取消按钮，但是还是要设置onCancel事件，如果不设置onCancel的话，点击按钮会报错
                    maskClosable: true,
                    content: (
                        <div className="modal-workOrder-Info">
                            <Form>
                                <FormItem
                                    label="电话"
                                    {...formItemLayout}
                                >
                                    <span>{workOrderInfo.phone}</span>
                                </FormItem>
                                <FormItem
                                    label="姓名"
                                    {...formItemLayout}
                                >
                                    <span>{workOrderInfo.customerName}</span>
                                </FormItem>
                                <FormItem
                                    label="性别"
                                    {...formItemLayout}
                                >
                                    <span>{workOrderInfo.sex==1?'男':'女'}</span>
                                </FormItem>
                                <FormItem
                                    label="车牌"
                                    {...formItemLayout}
                                >
                                    <span>{workOrderInfo.plate}</span>
                                </FormItem>
                                <FormItem
                                    label="验证码"
                                    {...formItemLayout}
                                >
                                    <span>{workOrderInfo.verifyCode}</span>
                                </FormItem>
                                <FormItem
                                    label="验证状态"
                                    {...formItemLayout}
                                >
                                    <span>{verifyStatus}</span>
                                </FormItem>
                                <FormItem
                                    label="发卡渠道"
                                    {...formItemLayout}
                                >
                                    <span>{workOrderInfo.channelName}</span>
                                </FormItem>
                                <FormItem
                                    label="服务产品"
                                    {...formItemLayout}
                                >
                                    <span>{workOrderInfo.productName}</span>
                                </FormItem>
                                <FormItem
                                    label="车型"
                                    {...formItemLayout}
                                >
                                    <span>{workOrderInfo.modalDes}</span>
                                </FormItem>
                                <FormItem
                                    label="服务地址"
                                    {...formItemLayout}
                                >
                                    <span>{workOrderInfo.address}</span>
                                </FormItem>
                                <FormItem
                                    label="服务时间"
                                    {...formItemLayout}
                                >
                                    <span>{date}</span>
                                </FormItem>
                                <FormItem
                                    label="服务市场"
                                    {...formItemLayout}
                                >
                                    <span>{workOrderInfo.serviceRegionName}</span>
                                </FormItem>
                                <FormItem
                                    label="备注"
                                    {...formItemLayout}
                                >
                                    <span>{workOrderInfo.remark}</span>
                                </FormItem>
                            </Form>
                        </div>
                    ),
                });
            }
        }

    };

    //点击编辑的逻辑
    handleModify(record) {
        return ()=> {
            this.setState({
                showDetailId: record.key,
                showFlag: 2,
            });
        }
    }

    //点击新增的逻辑
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

    //更改查询条件
    changeCondition(obj) {
        let condition = this.state.condition;
        condition = Object.assign(condition, obj);
        this.setState({
            condition: condition
        });
    }

    render() {
        if (this.state.showFlag === 2) {
            return (
                <OrderInfo
                    showDetailId={this.state.showDetailId}
                    back={
                        ()=> {
                            this.search(this.state.condition);
                        }
                    }
                    commit={
                        ()=>{
                            let condition = {};
                            if (this.state.showDetailId === null) {
                                condition = {
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
                            } else {
                                condition = this.state.condition;
                            }
                            this.search(condition);
                        }
                    }
                />
            );
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
                                        serviceRegionName: value
                                    })
                                }}
                                value={this.state.condition.serviceRegionName}
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
                                            <Option key={index} value={item.productId}>{item.name}</Option>
                                        );
                                    });
                                })()}
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <div className="clearfix">
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
                                serviceRegionName: "",
                                channelId: "",
                                productId: "",
                                pageSize: 10,
                                currentPage: 1
                            }
                        });
                    }}>重置</Button>
                </div>
                <Table
                    columns={this.state.columns}
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
