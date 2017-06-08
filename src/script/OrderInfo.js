import {Form, Input, Cascader, Select, Row, Col, Button, Steps, DatePicker, message, Modal, Radio} from 'antd';
import React from 'react';
import Request from "./util/Request";
import CarModalSelect from "./CarModalSelect";

const Step = Steps.Step;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const area = [
    {value: '苏州', label: '苏州'},
    {value: '无锡', label: '无锡'},
    {value: '常熟', label: '常熟'}
];

class OrderInfoForm extends React.Component {

    state = {
        modalDes: "",
        modalId: "",
        serviceRegions: [],
        channels: [],
        products: []
    };

    componentDidMount() {
        let serviceRegions = Request.synPost("serviceRegion/list");
        for (let serviceRegion of serviceRegions) {
            serviceRegion.value = serviceRegion.id;
            serviceRegion.label = serviceRegion.name;
        }
        this.setState({
            serviceRegions: serviceRegions
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
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
                <h3>客户信息</h3>
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
                            <Radio value="1">男</Radio>
                            <Radio value="2">女</Radio>
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
                    <Row gutter={8}>
                        <Col span={12}>
                            {getFieldDecorator('verifyCode', {
                                rules: [
                                    {required: true, message: '请输入验证码'},
                                    {pattern: /^[0-9a-zA-Z]+$/, message: '验证码格式有误'},
                                ],
                            })(
                                <Input size="large"/>
                            )}
                        </Col>
                        <Col span={12}>
                            <Button size="default">校验</Button>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="发卡渠道"
                >
                    {getFieldDecorator('cardChannel', {
                        rules: [{required: true, message: '请选择发卡渠道'}],
                    })(
                        <Cascader options={this.state.channels} size="large" style={{width: "110px"}} placeholder="请选择发卡渠道"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="服务产品"
                >
                    {getFieldDecorator('product', {
                        rules: [{required: true, message: '请选择服务产品'}],
                    })(
                        <Cascader options={this.state.products} size="large" style={{width: "110px"}} placeholder="请选择服务产品"/>
                    )}
                </FormItem>

                {/*选择车辆型号*/}
                <CarModalSelect ref="CarModalSelect" modalId={this.state.modalId} selectModal={
                    (modalId, desc)=>{
                        this.selectModal(modalId, desc);
                    }
                }/>
                <h3>车辆信息</h3>
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
                <h3>服务信息</h3>
                <FormItem
                    {...formItemLayout}
                    label="服务地址"
                >
                    {getFieldDecorator('address', {
                        rules: [{
                            type: 'array', required: true, message: '请填写服务地址'
                        }],
                    })(
                        <Input
                            onClick={this.openCarModal.bind(this)}
                            placeholder="请填写服务地址"
                        />
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
                    label="服务市场"
                >
                    {getFieldDecorator('serviceRegion', {
                        rules: [{
                            type: 'array', required: true, message: '请选择服务市场'
                        }],
                    })(
                        <Cascader options={this.state.serviceRegions} size="large" style={{width: '110px'}} placeholder="请选择服务市场"/>
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
                        this.props.back();
                    }} size="large">返回</Button>
                    <Button type="primary" htmlType="submit" size="large">提交</Button>
                </FormItem>
            </Form>
        );
    }
}

const OrderInfo = Form.create()(OrderInfoForm);

export default OrderInfo;