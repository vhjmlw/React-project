import {Form, Input, Cascader, Select, Row, Col, Button, Steps, DatePicker, message, Modal, Radio} from 'antd';
import React from 'react';
import Request from "./util/Request";
import CarModalSelect from "./CarModalSelect";

const Step = Steps.Step;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const products = [{
    value: '上门维修',
    label: '上门维修',
}, {
    value: '到店维修',
    label: '到店维修',
}];

const cardChannels = [{
    value: '超市赠送',
    label: '超市赠送',
}, {
    value: '自己买的',
    label: '自己买的',
}];

const address = [{
    value: '工业园区',
    label: '工业园区',
    children: [
        {value: '星龙节街459号', label: '星龙节街459号'},
        {value: '西周路', label: '西周路'}
    ],
}, {
    value: '高新区',
    label: '高新区',
    children: [
        {value: '马涧路', label: '马涧路'},
        {value: '建林路', label: '建林路'}
    ],
}, {
    value: '姑苏区',
    label: '姑苏区',
    children: [
        {value: '平江路', label: '平江路'},
        {value: '观前街', label: '观前街'}
    ],
}];

const area = [
    {value: '苏州', label: '苏州'},
    {value: '无锡', label: '无锡'},
    {value: '常熟', label: '常熟'}
];

class OrderInfoForm extends React.Component {

    state = {
        brandLetters: ['A', 'B', 'C', 'D'],
        selectedLetter: 'A',
        selectedBrandId: "",
        selectedBrandName: "",
        brands: [],
        carseries: [],
        factorys: [],
        displacements: [],
        years: [],
        cartypes: [],
        carseriesValue: '',
        factoryValue: '',
        yearValue: '',
        displacementValue: '',
        cartypeValue: '',
        brandVisible: false,
        carsereisVisible: false,
        cartypeVisible: false,
    };

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    selectCarModal() {
        this.refs.CarModalSelect.init();
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
                    {getFieldDecorator('phoneNumber', {
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
                    {getFieldDecorator('name', {
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
                            <Radio value="男">男</Radio>
                            <Radio value="女">女</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="车牌"
                    hasFeedback
                >
                    {getFieldDecorator('plateNumber', {
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
                            {getFieldDecorator('captcha', {
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
                        <Cascader options={cardChannels} size="large" style={{width: "110px"}} placeholder="请选择发卡渠道"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="服务产品"
                >
                    {getFieldDecorator('product', {
                        rules: [{required: true, message: '请选择服务产品'}],
                    })(
                        <Cascader options={products} size="large" style={{width: "110px"}} placeholder="请选择服务产品"/>
                    )}
                </FormItem>

                {/*选择车辆型号*/}
                <CarModalSelect ref="CarModalSelect"/>
                <h3>车辆信息</h3>
                <FormItem
                    {...formItemLayout}
                    label="车型"
                >
                    {getFieldDecorator('brandSeriesType', {
                        rules: [{required: true, message: '车型'}],
                    })(
                        <Input
                            onClick={this.selectCarModal.bind(this)}
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
                            type: 'array', required: true, message: '请选择服务地址'
                        }],
                    })(
                        <Cascader options={address} size="large" placeholder="请选择服务地址"/>
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
                    {getFieldDecorator('area', {
                        rules: [{
                            type: 'array', required: true, message: '请选择服务市场'
                        }],
                    })(
                        <Cascader options={area} size="large" style={{width: '110px'}} placeholder="请选择服务市场"/>
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