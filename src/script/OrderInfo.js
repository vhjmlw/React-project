import { Form, Input, Cascader, Select, Row, Col, Button, Steps, DatePicker, message, Modal } from 'antd';
import React from 'react';
const Step = Steps.Step;
const FormItem = Form.Item;
const Option = Select.Option;

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
},{
    value: '自己买的',
    label: '自己买的',
}];

const area = [{
    value: '无锡',
    label: '无锡',
},{
    value: '苏州',
    label: '苏州',
},{
    value: '南通',
    label: '南通',
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
},  {
    value: '姑苏区',
    label: '姑苏区',
    children: [
        {value: '平江路', label: '平江路'},
        {value: '观前街', label: '观前街'}
    ],
}];

const brands = [{
    value: '路虎',
    label: '路虎',
}, {
    value: '丰田',
    label: '丰田',
}];

const cartypes = [{
    value: 'A型车',
    label: 'A型车',
},{
    value: 'B型车',
    label: 'B型车',
}];

const displacements = [{
    value: '5.0L',
    label: '5.0L',
},{
    value: '4.0L',
    label: '4.0L',
}];

const oilBrands = [{
    value: '机油',
    label: '机油',
    children: [
        {value:'98#',label:'98#'},
        {value:'93#',label:'93#'}
    ],
},{
    value: '柴油',
    label: '柴油',
    children: [
        {value:'98#',label:'98#'},
        {value:'83#',label:'93#'}
    ],
}];

const filterBrands = [{
    value: '机滤品牌第一个',
    label: '机滤品牌第一个',
},{
    value: '机滤品牌第二个',
    label: '机滤品牌第二个',
}];

const brandSelect = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ];

class CustomInfoForm extends React.Component {
    state = {
        confirmDirty: false,
    };
    handleSubmit = (e) => {
        e.preventDefault();
        const next = {
            CustomInfo:1,
            CustomInfoAlpha:0,
            CarInfo:10,
            CarInfoAlpha:1,
            ServiceInfo:1,
            ServiceInfoAlpha:0,
        };
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                window.localStorage.setItem("customInfo",JSON.stringify(values));
                this.handleClick(next);
            }
        });
    }
    handleClick = (obj)=>{
        this.props.callbackParent(obj);
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

        return (
            <div
                className="antd-layout-AddOrder"
                style={{zIndex:this.props.visibleState.CustomInfo,opacity:this.props.visibleState.CustomInfoAlpha}}>
                <Steps current={0} className="layout-AddOrder-steps">
                    <Step title="客户信息" />
                    <Step title="车辆信息" />
                    <Step title="服务信息" />
                </Steps>
                <Form onSubmit={this.handleSubmit} className="layout-AddOrder-form">
                    <FormItem
                        {...formItemLayout}
                        label="电话"
                        hasFeedback
                    >
                        {getFieldDecorator('phoneNumber', {
                            rules: [{
                                required: true, message: '请输入电话号码',
                            }],
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
                        {getFieldDecorator('sex',{
                            rules: [{
                                required: true, message: '请选择性别'
                            }],
                            initialValue: '男',
                        })(
                            <Select style={{width: 110}}>
                                <Option value="男">男</Option>
                                <Option value="女">女</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="车牌"
                        hasFeedback
                    >
                        {getFieldDecorator('plateNumber', {
                            rules: [{
                                required: true, message: '请输入车牌号',
                            }],
                            initialValue: "苏",
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="验证码"
                        extra="我们必须确认您非机器人"
                    >
                        <Row gutter={8}>
                            <Col span={12}>
                                {getFieldDecorator('captcha', {
                                    rules: [
                                        { required: true, message: '请输入验证码' },
                                        { pattern: /^[0-9]+$/, message: '验证码必须为数字'},
                                    ],
                                })(
                                    <Input size="large" />
                                )}
                            </Col>
                            <Col span={12}>
                                <Button size="large">获取验证码</Button>
                            </Col>
                        </Row>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="产品类型"
                    >
                        {getFieldDecorator('product', {
                            rules: [{ required: true, message: '请选择产品类型' }],
                        })(
                            <Cascader options={products} size="large" style={{width:"110px"}} placeholder="请选择产品类型"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="发卡渠道"
                    >
                        {getFieldDecorator('cardChannel', {
                            rules: [{ required: true, message: '请选择发卡渠道' }],
                        })(
                            <Cascader options={cardChannels} size="large" style={{width:"110px"}} placeholder="请选择发卡渠道"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注"
                        hasFeedback
                    >
                        {getFieldDecorator('customComment')(
                            <Input type="textarea" autosize={{minRows:3}}/>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" size="large">下一步</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

const CustomInfo = Form.create()(CustomInfoForm);

class CarInfoForm extends React.Component {
    state = {
        brands: ['大众', '路虎', '丰田', '标致'],
        brandValue: '',
        factorys: ['一汽大众', '上汽大众', '广汽大众'],
        cartypes: ['车型一','车型二','车型三'],
    };
    handleSubmit = (e) => {
        e.preventDefault();
        const next = {
            CustomInfo:1,
            CustomInfoAlpha:0,
            CarInfo:1,
            CarInfoAlpha:0,
            ServiceInfo:10,
            ServiceInfoAlpha:1,
        };
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                window.localStorage.setItem("carInfo",JSON.stringify(values));
                this.handleClick(next);
            }
        });
    }
    handleClick = (obj)=>{
        this.props.callbackParent(obj);

    }

    handleCharClick(e){
        document.querySelectorAll('.ant-confirm-brandNav a').forEach((item,index)=>{
            item.classList.remove('brandChar');
        });
        e.target.classList.add('brandChar');
    }

    handleBrandClick(brand){
        return (e)=>{
            this.props.form.setFieldsValue({
                brand: brand,
            });
            this.setState({
                brandValue: brand,
            });
            document.querySelectorAll('.ant-confirm-brand button').forEach((item,index)=>{
                item.classList.remove('ant-btn-primary');
            });
            e.target.classList.add('ant-btn-primary');
        }
    }

    handleBrandSelect(){
        Modal.confirm({
            title: '按照首字母选择汽车品牌',
            maskClosable: true,
            okText: "确定",
            cancelText: "取消",
            onOk: ()=>console.log('OK'),
            onCancel: ()=>console.log('cancle'),
            content: (
                <div>
                    <div className="ant-confirm-divNav">
                        <ul className="clearfix">
                            {
                                brandSelect.map((item)=>{
                                    return (
                                        <li className="ant-confirm-brandNav">
                                            <a onClick={this.handleCharClick.bind(this)} className={item==='A'?'brandChar':''}>{item}</a>
                                        </li>
                                    );
                                })
                            }

                        </ul>
                    </div>
                    <div className="ant-confirm-divBrand">
                        <ul className="clearfix">
                            {
                                this.state.brands.map((brand)=>{
                                    return (
                                        <li className='ant-confirm-brand'>
                                            <button onClick={this.handleBrandClick(brand).bind(this)} className="ant-btn">{brand}</button>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </div>
                </div>
            ),
        });
    }

    handleFactoryClick(factory){
        return (e)=>{
            document.querySelectorAll('.ant-confirm-brandNav a').forEach((item,index)=>{
                item.classList.remove('brandChar');
            });
            e.target.classList.add('brandChar');
        }
    }

    handleCartypeClick(cartype){
        return (e)=>{
            this.props.form.setFieldsValue({
                cartype: cartype,
            });
            document.querySelectorAll('.ant-confirm-brand button').forEach((item,index)=>{
                item.classList.remove('ant-btn-primary');
            });
            e.target.classList.add('ant-btn-primary');
        }

    }

    handleCartypeSelect(){
        Modal.confirm({
            title: '请选择车型',
            maskClosable: true,
            onOk: ()=>console.log('OK'),
            onCancel: ()=>console.log('cancle'),
            content: (
                <div>
                    <div className="ant-confirm-divNav">
                        <ul className="clearfix">
                            {
                                this.state.factorys.map((factory)=>{
                                    return (
                                        <li className="ant-confirm-brandNav">
                                            <a onClick={this.handleFactoryClick(factory).bind(this)}>{factory}</a>
                                        </li>
                                    );
                                })
                            }

                        </ul>
                    </div>
                    <div className="ant-confirm-divBrand">
                        <ul className="clearfix">
                            {
                                this.state.cartypes.map((cartype)=>{
                                    return (
                                        <li className='ant-confirm-brand'>
                                            <button onClick={this.handleCartypeClick(cartype).bind(this)} className="ant-btn">{cartype}</button>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </div>
                </div>
            ),
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
        const back = {
            CustomInfo:10,
            CustomInfoAlpha:1,
            CarInfo:1,
            CarInfoAlpha:0,
            ServiceInfo:1,
            ServiceInfoAlpha:0,
        };

        return (
            <div
                className="antd-layout-AddOrder"
                style={{zIndex:this.props.visibleState.CarInfo,opacity:this.props.visibleState.CarInfoAlpha}}>
                <Steps current={1} className="layout-AddOrder-steps">
                    <Step title="客户信息" />
                    <Step title="车辆信息" />
                    <Step title="服务信息" />
                </Steps>
                <Form onSubmit={this.handleSubmit} className="layout-AddOrder-form">
                    <FormItem
                        {...formItemLayout}
                        label="品牌"
                    >
                        {getFieldDecorator('brand', {
                            rules: [{ required: true, message: '请选择品牌' }],
                        })(
                            <Input
                                onClick={this.handleBrandSelect.bind(this)}
                                placeholder="请选择品牌"
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="车型"
                    >
                        {getFieldDecorator('cartype', {
                            rules: [{ required: true, message: '请选择车型' }],
                        })(
                            <Input
                                onClick={this.handleCartypeSelect.bind(this)}
                                placeholder="请选择车型"
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="排量"
                    >
                        {getFieldDecorator('displacement', {
                            rules: [{ required: true, message: '请选择排量' }],
                        })(
                            <Cascader options={displacements} size="large" style={{width:"110px"}} placeholder="请选择排量"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="年份"
                    >
                        {getFieldDecorator('purchaseDate', {
                            rules: [{ type: 'object', required: true, message: '请选择购买日期' }],
                        })(
                            <DatePicker />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="机油品牌"
                    >
                        {getFieldDecorator('oilBrand', {
                            rules: [{
                                type: 'array', required: true, message: '请选择机油品牌'
                            }],
                        })(
                            <Cascader options={oilBrands} size="large" style={{width:"110px"}} placeholder="请选择机油品牌"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="机滤品牌"
                    >
                        {getFieldDecorator('filterBrand', {
                            rules: [{ required: true, message: '请选择机滤品牌' }],
                        })(
                            <Cascader options={filterBrands} size="large" style={{width:"110px"}} placeholder="请选择机滤品牌"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注"
                        hasFeedback
                    >
                        {getFieldDecorator('carComment')(
                            <Input type="textarea" autosize={{minRows:3}}/>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" size="large">下一步</Button>
                        <Button type="primary" onClick={this.handleClick.bind(this,back)} size="large">上一步</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

const CarInfo = Form.create()(CarInfoForm);

class ServiceInfoForm extends React.Component {
    state = {
        confirmDirty: false,
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            let customID = '';
            if (!err) {
                console.log('Received values of form: ', values);
                window.localStorage.setItem("serviceInfo",JSON.stringify(values));
                //发送客户信息的请求
                const customInfo = JSON.parse(window.localStorage.customInfo);
                let customParam = ``;
                customParam += `name=${customInfo.name}`;
                customParam += `&phone=${customInfo.phoneNumber}`;
                customParam += `&sex=${customInfo.sex === '男'? '1': '0'}`;
                customParam += `&remark=${customInfo.customComment}`;
                fetch('v1/customer/create',{
                    method: 'POST',
                    headers: new Headers({
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }),
                    body: customParam,
                }).then( (response)=> {
                    return response.json();
                }).then( (json)=> {
                    if(json.code === "200"){
                        const customerId = json.data + "";
                        customID = customerId;
                        const plate = JSON.parse(window.localStorage.getItem('customInfo')).plateNumber;
                        const carInfo = JSON.parse(window.localStorage.carInfo);
                        let registerDate = new Date(carInfo.purchaseDate).toISOString().substr(0,10);
                        registerDate = registerDate.replace(/[^0-9]/g,'');
                        let carParam = ``;
                        carParam += `customerId=${customerId}`;
                        carParam += `&plate=${plate}`;
                        carParam += `&registerDate= ${registerDate}`;
                        carParam += `&brandId=12`;
                        carParam += `&modelId=12`;
                        carParam += `&displacement=${carInfo.displacement[0]}`;
                        carParam += `&engineOilBrand=${carInfo.oilBrand.join('/')}`;
                        carParam += `&engineFilterBrand=${carInfo.filterBrand[0]}`;
                        carParam += `&remark=${carInfo.carComment}`;
                        return fetch('v1/car/create',{
                            method: 'POST',
                            headers: new Headers({
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }),
                            body: carParam,
                        })
                    } else {
                        message.warning(json.message);
                    }
                }).then((response)=>{
                    return response.json();
                }).then((json)=>{
                    console.log(json);
                    if(json.code === '200'){
                        const carId = json.data + '';
                        const customerId = customID;
                        console.log(customID);
                        const customInfo = JSON.parse(window.localStorage.customInfo);
                        const cardId = customInfo.captcha;
                        const productType = customInfo.product;
                        const cardChannel = customInfo.cardChannel;
                        let serviceTime = new Date(values.serviceDate).toISOString().substr(0,10);
                        serviceTime = serviceTime.replace(/[^0-9]/g,'');
                        let serviceParam = ``;
                        serviceParam += `customerId=${customerId}`;
                        serviceParam += `&carId=${carId}`;
                        serviceParam += `&cardId=${cardId}`;
                        serviceParam += `&productType=${productType}`;
                        serviceParam += `&cardChannel=${cardChannel}`;
                        serviceParam += `&serviceAddress=${values.address.join('/')}`;
                        serviceParam += `&detailAddress=${values.detailAddress}`;
                        serviceParam += `&serviceTime=${serviceTime}`;
                        serviceParam += `&status=待服务`;
                        return fetch('v1/maintain/create',{
                            method: 'POST',
                            headers: new Headers({
                                'Content-Type': 'application/x-www-form-urlencoded',
                            }),
                            body: serviceParam,
                        })
                    } else {
                        message.warning(json.message);
                    }

                }).then((response)=>{
                    return response.json();
                }).then((json)=>{
                    if(json.code === '200'){
                        message.success('提交成功',1.5,()=>{this.props.changeRoute(null, "/App")});
                    } else {
                        message.warning(json.message);
                    }
                }).catch( (err)=> {
                    throw err;
                });
            }
        });
    }
    handleClick = (obj)=>{
        this.props.callbackParent(obj);
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
        const back = {
            CustomInfo:1,
            CustomInfoAlpha:0,
            CarInfo:10,
            CarInfoAlpha:1,
            ServiceInfo:1,
            ServiceInfoAlpha:0,
        };

        return (
            <div
                className="antd-layout-AddOrder"
                style={{zIndex:this.props.visibleState.ServiceInfo,opacity:this.props.visibleState.ServiceInfoAlpha}}>
                <Steps current={2} className="layout-AddOrder-steps">
                    <Step title="客户信息" />
                    <Step title="车辆信息" />
                    <Step title="服务信息" />
                </Steps>
                <Form onSubmit={this.handleSubmit} className="layout-AddOrder-form">
                    {/*<FormItem
                        {...formItemLayout}
                        label="服务区域"
                    >
                        {getFieldDecorator('area', {
                            rules: [{
                                type: 'array', required: true, message: '请选择服务区域'
                            }],
                        })(
                            <Cascader options={area} size="large" style={{width:'110px'}} placeholder="请选择服务区域" />
                        )}
                    </FormItem>*/}
                    <FormItem
                        {...formItemLayout}
                        label="服务地址"
                    >
                        {getFieldDecorator('address', {
                            rules: [{
                                type: 'array', required: true, message: '请选择服务地址'
                            }],
                        })(
                            <Cascader options={address} size="large" placeholder="请选择服务地址" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="详细地址"
                        hasFeedback
                    >
                        {getFieldDecorator('detailAddress', {
                            rules: [{
                                required: true, message: '请输入详细地址',
                            }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="服务时间"
                    >
                        {getFieldDecorator('serviceDate', {
                            rules: [{ type: 'object', required: true, message: '请选择服务时间' }],
                        })(
                            <DatePicker />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注"
                        hasFeedback
                    >
                        {getFieldDecorator('serviceComment')(
                            <Input type="textarea" autosize={{minRows:3}}/>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" size="large">提交</Button>
                        <Button type="primary" size="large" onClick={this.handleClick.bind(this,back)}>上一步</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

const ServiceInfo = Form.create()(ServiceInfoForm);

class OrderInfo extends React.Component{
    //点击上一步 下一步的时候，同时更改z-index(10-1)和opacity(1-0)属性
    //属性的传递过程：父组件state——>子组件props——>子组件style
    //父组件的handleClick用来更改其state，将该方法传递给子组件的props，子组件点击按钮的时候调用该方法，
    //传入一个state对象来更改父组件的state，同时子组件的props和style也同步的更改，达到切换页面的效果
    state = {
        CustomInfo:10,//控制z-index属性
        CustomInfoAlpha:1,//控制opacity属性
        CarInfo:1,
        CarInfoAlpha:0,
        ServiceInfo:1,
        ServiceInfoAlpha:0,
    }
    handleClick(obj){
        this.setState(obj);
    }
    render(){
        return (
            <div className="ant-layout-orderInfo">
                    <CustomInfo visibleState={this.state} callbackParent={this.handleClick.bind(this)} />
                    <CarInfo visibleState={this.state} callbackParent={this.handleClick.bind(this)} />
                    <ServiceInfo visibleState={this.state} callbackParent={this.handleClick.bind(this)} changeRoute={this.props.history.pushState} />
            </div>
        );
    }
}

export default OrderInfo;
