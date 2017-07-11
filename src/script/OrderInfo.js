import {Form, Input, Cascader, Select, Row, Col, Button, DatePicker, message, Modal, Radio} from 'antd';
import React from 'react';
import Request from "./util/Request";
import CarModalSelect from "./CarModalSelect";
import moment from 'moment';
import CookieUtil from './util/CookieUtil';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
let currentValue;
let timeout;
const serviceRegions = [{
    value: 1,
    label: '苏州',
}, {
    value: 2,
    label: '无锡',
}, {
    value: 3,
    label: '常州',
}, {
    value: 4,
    label: '南京',
}, {
    value: 5,
    label: '南通',
}, {
    value: 6,
    label: '江阴',
}];

class OrderInfoForm extends React.Component {

    state = {
        modalDes: "",
        modalId: "",
        serviceRegions: [],
        channels: [],
        products: [],
        matchedAddresses: [],
        selectedChannel: "",
        selectedProduct: "",
        modalVisible: false,
        detailAddress: '',
        uid: '',
        verifyStatus: 0,
    };

    componentDidMount() {
        let channels = Request.synPost("channel/listByNameAndCode");
        let products = Request.synPost("product/list");
        this.setState({
            // serviceRegions: serviceRegions,
            channels: this.convertValueLabel(channels),
            products: this.convertProductValueLabel(products)
        });

        if(this.props.showDetailId){
            const workOrderInfo = Request.synPost('workOrder/getDetailByWorkOrderId',{id:this.props.showDetailId});
            let serviceDate;
            if(workOrderInfo.serviceDate){
                serviceDate = moment(workOrderInfo.serviceDate,'YYYYMMDD');
            } else {
                serviceDate = null;
            }
            if(workOrderInfo){
                this.props.form.setFieldsValue({
                    phone: workOrderInfo.phone,
                    customerName: workOrderInfo.customerName,
                    sex: workOrderInfo.sex,
                    plate: workOrderInfo.plate,
                    verifyCode: workOrderInfo.verifyCode,
                    channelId: [workOrderInfo.channelId],
                    productId: [workOrderInfo.productId],
                    modalDes: workOrderInfo.modalDes,
                    serviceRegion: [workOrderInfo.serviceRegion],
                    address: workOrderInfo.addressCode,
                    serviceDate: serviceDate,
                    comment: workOrderInfo.remark,
                });
                const matchedAddresses = [{
                    uid: workOrderInfo.addressCode,
                    district: '',
                    name: workOrderInfo.address
                }];
                this.setState({
                    modalId:workOrderInfo.modalId,
                    verifyStatus:workOrderInfo.verifyStatus,
                    detailAddress: workOrderInfo.address,
                    uid: workOrderInfo.addressCode,
                    matchedAddresses,
                    carId: workOrderInfo.carId,
                    customerId: workOrderInfo.customerId,
                    channelProduct: workOrderInfo.channelProduct,//渠道产品关系ID
                });
            }
        }
    }

    convertValueLabel(items) {
        for (let item of items) {
            item.value = item.id;
            item.label = item.name;
        }
        return items;
    }
    convertProductValueLabel(items){
        for (let item of items) {
            item.value = item.productId;
            item.label = item.name;
        }
        return items;
    }

    // 改变渠道事件
    changeChannel(channel) {
        let products = Request.synPost("product/list", {channelId: channel[0]});
        this.setState({
            products: this.convertProductValueLabel(products),
            selectedChannel: channel
        });
    }

    // 改变产品事件
    changeProduct(product) {
        let channels = Request.synPost("channel/findByProductId", {productId: product[0]});
        this.setState({
            channels: this.convertValueLabel(channels),
            selectedProduct: product
        });
    }

    //服务地址改变的逻辑
    modifyAddress(address) {
        this.requestAddress(address);
        // this.props.form.setFieldsValue({address});
    }

    //请求服务地址的逻辑，控制函数节流
    requestAddress(value) {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        currentValue = value;

        const fake = ()=> {
            this.setState({
                detailAddress: value,//在Select选择器中输入内容的时候，将输入的内容设为address、addressCode
                uid: value,
            });
            let matchedAddresses = [];
            if (value) {
                const serviceRegion = this.props.form.getFieldValue('serviceRegion') || [];
                let regionLabel = '';
                for(let item of serviceRegions){
                    if(item.value === serviceRegion[0]){
                        regionLabel = item.label;
                        break;
                    }
                }
                if(regionLabel === '江阴'){
                    regionLabel = '无锡';
                }

                let addressesObj = Request.synPost("address/matche", {
                    region: regionLabel || '苏州',
                    query: value
                });
                if(currentValue === value){
                    if (addressesObj.message === "ok") {
                        matchedAddresses = addressesObj.result.slice(1);//移除第一个返回的结果，第一个没有意义
                    }
                }
            }
            this.setState({
                matchedAddresses: matchedAddresses,
            });
        }
        timeout = setTimeout(fake, 300);
    }

    //点击提交按钮的逻辑
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('接收到提交的表单数据',values);
                values.modalId = this.state.modalId;
                values.sex = values.sex;
                values.serviceDate = values.serviceDate.format('YYYYMMDD');
                values.status = 0;
                values.channelId = values.channelId[0];
                values.productId = values.productId[0];
                values.serviceRegion = values.serviceRegion[0];
                values.createUser = CookieUtil.getCookie('id') || '';//获取客户人员的ID
                values.remark = values.comment;
                values.addressCode = this.state.uid;//更改服务地址的uid
                values.address = this.state.detailAddress;
                values.verifyStatus = this.state.verifyStatus;
                if(this.props.showDetailId){
                    values.workOrderId = this.props.showDetailId;
                    values.carId = this.state.carId;
                    values.customerId = this.state.customerId;
                    values.channelProduct = this.state.channelProduct;
                    Request.synPost('workOrder/modify', values);
                    message.success('修改成功',1.5,()=>{this.props.commit()});
                } else {
                    let id = Request.synPost("workOrder/create", values);
                    if (id) {
                        message.success('新增成功',1.5,()=>{this.props.commit()});
                    }
                }
            }
        });
    }

    openCarModal() {
        this.refs.CarModalSelect.init();
    }

    selectModal(modalId, modalDes) {
        this.props.form.setFieldsValue({
            modalDes: modalDes,
        });
        this.setState({
           modalId: modalId,
           modalDes: modalDes
        });
    }

    detailAddress(value,option){
        //如果Select的value是字母和数字的随机组合（如：b9e5d0b8efe410bc81a12ec5）
        //则value为服务地址的uid，此时搜索服务地址的详细地址
        //如果value为中文字符串，则就是手动输入的详细地址
        const regexp = /^[a-zA-z0-9]+$/g;
        if(regexp.test(value)){
            const addressObj = Request.synPost('address/getDetail',{uid:value});
            if(addressObj && addressObj.message === 'ok') {
                const detailAddress = addressObj.result.address + addressObj.result.name;
                console.log(detailAddress,option);
                // const option = (<Option key={item.uid} value={item.uid}>{item.district + item.name}</Option>);
                const matchedAddresses = [{
                    uid: addressObj.result.uid,
                    district: addressObj.result.address || '',
                    name: addressObj.result.name || ''
                }];
                this.setState({
                    matchedAddresses,
                    detailAddress,
                    uid: addressObj.result.uid,
                });
                // this.props.form.setFieldsValue({address:option.props.children});
            }
        }

    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        const tailFormItemLayout = {
            wrapperCol: {
                span: 14,
                offset: 6,
            },
        };

        return (
            <Form onSubmit={this.handleSubmit.bind(this)} className="layout-AddOrder-form">
                <h3>新增工单</h3>
                <FormItem
                    {...formItemLayout}
                    label="电话"
                    hasFeedback
                >
                    {getFieldDecorator('phone', {
                        rules: [
                            {required: true, message: '请输入电话号码',},
                            {
                                pattern: /^(0[0-9]{2,3}\-?)?([2-9][0-9]{6,7})+(\-?[0-9]{1,4})?$|^1[3|4|5|7|8][0-9]{9}$/,
                                message: '电话格式有误'
                            }
                        ],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="姓名"
                    hasFeedback
                >
                    {getFieldDecorator('customerName', {
                        rules: [{
                            required: true, message: '请输入姓名',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="性别"
                >
                    {getFieldDecorator('sex', {
                        rules: [{
                            required: true, message: '请选择性别'
                        }],
                    })(
                        <RadioGroup>
                            <Radio value={1}>男</Radio>
                            <Radio value={0}>女</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="车牌"
                    hasFeedback
                >
                    {getFieldDecorator('plate', {
                        rules: [
                            {required: true, message: '请输入车牌号',},
                            {
                                pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
                                message: '车牌格式有误'
                            }
                        ],
                        initialValue: "苏",
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="验证码"
                >
                    <Row gutter={8} style={{width:600}}>
                        <Col span={10} style={{width:'30%'}}>
                            {getFieldDecorator('verifyCode', {
                                rules: [
                                    {required: true, message: '请输入验证码'},
                                    {pattern: /^[0-9a-zA-Z]+$/, message: '验证码格式有误'},
                                ],
                            })(
                                <Input size="large"/>
                            )}
                        </Col>
                        <Col span={14} style={{width:'70%'}}>
                            {/*<Button size="default">校验</Button>*/}
                            <Button
                                size="default"
                                style={{margin:0,float:'left'}}
                                type={this.state.verifyStatus === 1?'primary':''}
                                /*className={this.state.verifyStatus === 1 ? 'ant-btn ant-btn-primary' : 'ant-btn'}*/
                                onClick={()=>{this.setState({verifyStatus:1})}}
                            >验证成功</Button>
                            <Button
                                size="default"
                                style={{margin:0,float:'left',marginLeft:'10px'}}
                                type={this.state.verifyStatus === 9?'primary':''}
                                /*className={this.state.verifyStatus === 9 ? 'ant-btn ant-btn-primary' : 'ant-btn'}*/
                                onClick={()=>{this.setState({verifyStatus:9})}}
                            >验证失败</Button>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="发卡渠道"
                >
                    {getFieldDecorator('channelId', {
                        rules: [{required: true, message: '请选择发卡渠道'}],
                    })(
                        <Cascader
                            options={this.state.channels} size="large" style={{width: "110px"}}
                            onChange={
                                (value) => {
                                    this.changeChannel(value);
                                }
                            }
                            placeholder="请选择发卡渠道"
                        />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="服务产品"
                >
                    {getFieldDecorator('productId', {
                        rules: [{required: true, message: '请选择服务产品'}],
                    })(
                        <Cascader
                            options={this.state.products} size="large" style={{width: "110px"}}
                            onChange={
                                (value) => {
                                    this.changeProduct(value);
                                }
                            }
                            placeholder="请选择服务产品"
                        />
                    )}
                </FormItem>

                {/*选择车辆型号*/}
                <CarModalSelect ref="CarModalSelect" modalId={this.state.modalId} selectModal={
                    (modalId, desc)=>{
                        this.selectModal(modalId, desc);
                    }
                }/>
                <FormItem
                    {...formItemLayout}
                    label="车型"
                >
                    {getFieldDecorator('modalDes', {
                        rules: [{required: true, message: '车型'}],
                    })(
                        <Input
                            onClick={this.openCarModal.bind(this)}
                            placeholder="请选择车型"
                        />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="服务市场"
                >
                    {getFieldDecorator('serviceRegion', {
                        rules: [{
                            type: 'array', required: true, message: '请选择服务市场'
                        }],
                    })(
                        <Cascader options={serviceRegions} size="large" style={{width: '110px'}} placeholder="请选择服务市场"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="服务地址"
                    hasFeedback
                >
                    {getFieldDecorator('address', {
                        rules: [{
                            required: true, message: '请填写服务地址'
                        }],
                    })(
                        <Select
                            /*mode="combobox"*/
                            combobox={true}
                            placeholder="请填写服务地址"
                            filterOption={false}
                            optionLabelProp='children'
                            onSearch={(value) => this.modifyAddress(value)}
                            onSelect={(value,option)=>{this.detailAddress(value,option)}}
                        >
                            {
                                this.state.matchedAddresses.map((item, index) => {
                                    return (
                                        <Option key={item.uid} value={item.uid}>{item.district + item.name}</Option>
                                    );
                                })
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="服务时间"
                >
                    {getFieldDecorator('serviceDate', {
                        rules: [{type: 'object', required: true, message: '请选择服务时间'}],
                    })(
                        <DatePicker />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="备注"
                    hasFeedback
                >
                    {getFieldDecorator('comment')(
                        <Input type="textarea" autosize={{minRows: 3}}/>
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type='primary' onClick={()=>{
                        this.setState({modalVisible:true})
                    }} size="large">返回</Button>
                    <Button type="primary" htmlType="submit" size="large">提交</Button>
                </FormItem>
                <Modal
                    title='确定返回 ？'
                    width='300px'
                    visible={this.state.modalVisible}
                    okText="确定"
                    cancelText="取消"
                    onOk={()=>{this.props.back()}}
                    onCancel={()=>{this.setState({modalVisible:false})}}
                />
            </Form>
        );
    }
}

const OrderInfo = Form.create()(OrderInfoForm);

export default OrderInfo;