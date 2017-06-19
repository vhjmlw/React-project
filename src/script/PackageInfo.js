import { Tabs, Form, Input, Button, Select, Tag, Popconfirm, message, InputNumber } from 'antd';
import React from 'react';
import Request from "./util/Request";
import $ from 'jquery';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

class PackageInfoForm extends React.Component {
    state = {
        allServices: [],
        serviceMap: {},
        serviceCates: [],
        services: [],
        selectServices: [],
        currentService: "",
        currentServiceCate: "",
        currentServiceNum: 0,
        serviceSelectVisible: false
    };

    componentDidMount() {
        let allServices = Request.synPost("service/list");
        let serviceCates = [], serviceMap = {};
        for (let service of allServices) {
            serviceCates.push(service.cate);
            serviceMap[service.id] = service.name;
        }
        serviceCates = [...new Set(serviceCates)];
        this.setState({
            allServices: allServices,
            serviceCates: serviceCates,
            serviceMap: serviceMap
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (this.state.selectServices.length === 0) {
                    message.warning("请添加服务!");
                } else {
                    const services = this.state.selectServices;
                    let serviceArr = [];
                    for(let item of services){
                        let obj = {
                            num: item.num,
                            serviceId: item.serviceId
                        }
                        serviceArr.push(obj);
                    }
                    values.serviceLists = serviceArr;
                    values.createUser = 1;
                    $.ajax({
                        url: '/product/create',
                        type: 'POST',
                        data: JSON.stringify(values),
                        datatype: 'json',
                        contentType: 'application/json',
                        success: (response)=>{
                            if(response.code==='200' && response.data){
                                message.success('添加成功',1.5,()=>{
                                    this.props.changeRoute(null,'App/PackageList')
                                });
                            } else {
                                message.warning('请求异常');
                            }
                        },
                        error: (err)=>{
                            throw err;
                        }
                    });
                    /*let id = Request.synPost("product/create", values);
                    if (id) {
                        message.success("添加成功!", 1, ()=>this.props.changeRoute(null,'App/PackageList'));
                    }*/
                }
            }
        });
    }

    openServiceSelect() {
        this.setState({
            serviceSelectVisible: true,
            currentService: "",
            currentServiceCate: "",
            currentServiceNum: 0
        });
    }

    closeServiceSelect() {
        this.setState({
            serviceSelectVisible: false,
            currentService: "",
            currentServiceCate: "",
            currentServiceNum: 0
        });
    }

    addService() {
        if (this.state.currentService && this.state.currentServiceNum) {
            let selectServices = this.state.selectServices;
            let flag = true;
            for (let selectService of selectServices) {
                if (selectService.serviceId == this.state.currentService) {
                    selectService.num = this.state.currentServiceNum;
                    selectService.desc = this.state.serviceMap[this.state.currentService] + " * " + this.state.currentServiceNum;
                    flag = false;
                    break;
                }
            }
            if (flag) {
                selectServices.push({
                    serviceId: this.state.currentService,
                    num: this.state.currentServiceNum,
                    desc: this.state.serviceMap[this.state.currentService] + " * " + this.state.currentServiceNum
                })
            }
            this.setState({
                selectServices: selectServices,
                serviceSelectVisible: false
            });
        } else {
            message.warning("请填写完整信息!");
        }
    }

    deleteService(item) {
        let selectSerivices = this.state.selectServices;
        for (let index in selectSerivices) {
            if (item.id == selectSerivices[index].id) {
                selectSerivices.splice(index, 1);
            }
        }
        this.setState({
            selectSerivices: selectSerivices
        });
    }

    selectServiceCate(value) {
        let services = [];
        for (let service of this.state.allServices) {
            if (service.cate === value) {
                services.push(service);
            }
        }
        this.setState({
            services: services,
            currentService: "",
            currentServiceCate: value
        });
    }
    selectService(value) {
        this.setState({
            currentService: value
        });
    }
    changeServiceNum(num) {
        this.setState({
            currentServiceNum: num
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                span: 14,
                offset: 6,
            },
        };

        const serviceCateOptions = this.state.serviceCates.map(cate => <Option key={cate} value={cate}>{cate}</Option>);
        const serviceOptions = this.state.services.map(service => <Option key={service.id} value={service.id}>{service.name}</Option>);
        const confirmDOM = (
            <Form>
                <FormItem
                label="类别"
                {...formItemLayout}
                >
                    <Select
                        style={{ width: 90 }}
                        onChange={(value)=>{
                            this.selectServiceCate(value);
                        }}
                        value={this.state.currentServiceCate}
                    >
                        <Option value="">请选择</Option>
                        {serviceCateOptions}
                    </Select>
                </FormItem>
                <FormItem
                label="名称"
                {...formItemLayout}
                >
                    <Select
                        value={this.state.currentService}
                        style={{ width: 90 }}
                        onChange={(value)=>{
                            this.selectService(value);
                        }}
                    >
                        <Option value="">请选择</Option>
                        {serviceOptions}
                    </Select>
                </FormItem>
                <FormItem
                label="数量"
                {...formItemLayout}
                >
                    <span>
                        <InputNumber
                            size='large'
                            min={0}
                            value={this.state.currentServiceNum}
                            onChange={(value) => {
                                this.changeServiceNum(value);
                            }}
                            style={{ width: '65%', marginRight: '3%' }}
                        />
                        次
                    </span>
                </FormItem>
            </Form>
        );

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="名称"
                    hasFeedback
                >
                    {getFieldDecorator('name', {
                        rules: [{
                            required: true, message: '请输入名称',
                        }],
                    })(
                        <Input placeholder="请输入名称"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="代码"
                    hasFeedback
                >
                    {getFieldDecorator('code', {
                        rules: [{
                            required: true, message: '请输入代码',
                        }],
                    })(
                        <Input placeholder="请输入代码"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="价格"
                    hasFeedback
                >
                    {getFieldDecorator('price', {
                        rules: [{
                            required: true, message: '请输入价格',
                        }],
                    })(
                        <Input placeholder="请输入价格"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='服务'
                >
                    <div>
                        {this.state.selectServices.map((selectService, index) => {
                            const tagElem = (
                                <Tag key={index} closable={true} afterClose={() => this.deleteService(selectService)}>
                                    {selectService.desc}
                                </Tag>
                            );
                            return tagElem;
                        })}
                        <Popconfirm
                            placement="rightTop"
                            onConfirm={() => {
                                this.addService();
                            }}
                            onCancel={() => {
                                this.closeServiceSelect();
                            }}
                            title={confirmDOM}
                            okText="确定"
                            cancelText="取消"
                            visible={this.state.serviceSelectVisible}
                        >
                            <Button type="primary" size="small" onClick={
                                () => {
                                    this.openServiceSelect();
                                }
                            }>+</Button>
                        </Popconfirm>
                    </div>
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" size="large" onClick={()=>{
                        this.props.changeRoute(null,'App/PackageList');
                    }}>返回</Button>
                    <Button type="primary" htmlType="submit" size="large">提交</Button>
                </FormItem>
            </Form>
        );
    }
}

const PackageInfoComp = Form.create()(PackageInfoForm);

class PackageInfo extends React.Component {
    render(){
        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab="添加" key="1">
                    <PackageInfoComp changeRoute={this.props.history.pushState} />
                </TabPane>
            </Tabs>
        );
    }
}

export default PackageInfo;