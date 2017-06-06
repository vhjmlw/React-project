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
        brandSelect: [],
        brands: [],
        carseries: [],
        factorys: [],
        displacements: [],
        years: [],
        cartypes: [],
        initialValue: '',
        brandValue: '',
        carseriesValue: '',
        factoryValue: '',
        yearValue: '',
        displacementValue: '',
        cartypeValue: '',
        brandVisible : false,
        carsereisVisible: false,
        cartypeVisible: false,
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

    //选择汽车品牌的逻辑
    handleInitialClick(item){
        return (e)=>{
            if(item===this.state.initialValue){
                return;
            }
            document.querySelectorAll('.selectBrand .ant-confirm-navList a').forEach((item,index)=>{
                item.classList.remove('navList');
            });
            e.target.classList.add('navList');
            document.querySelectorAll('.selectBrand .ant-confirm-contentList button').forEach((item,index)=>{
                item.classList.remove('ant-btn-primary');
            });
            fetch(`car/brand?initial=${item}`).then((response)=>{
                return response.json();
            }).then((json)=>{
                console.log(json);
                this.setState({
                    brands: json.brands,
                    initialValue: item,
                    brandValue: '',
                });
            }).catch((error)=>{
                throw error;
            });
        }
    }

    handleBrandClick(brand){
        return (e)=>{
            if(brand===this.state.brandValue){
                return;
            }
            this.setState({
                brandValue: brand,
            });
            this.resetSeries.bind(this)();
            this.resetType.bind(this)();
            document.querySelectorAll('.selectBrand .ant-confirm-contentList button').forEach((item,index)=>{
                item.classList.remove('ant-btn-primary');
            });
            e.target.classList.add('ant-btn-primary');
        }
    }

    handleBrandSelect(){
        fetch(`car/brand?initial=${this.state.initialValue || 'A'}`).then((response)=>{
            return response.json();
        }).then((json)=>{
            this.setState({
                brands: json.brands,
                brandSelect: json.initials,
                brandVisible: true,
                // brandValue: '',
            });
            /*document.querySelectorAll('.selectBrand .ant-confirm-navList a').forEach((item,index)=>{
                item.classList.remove('navList');
            });
            document.querySelector('.selectBrand .ant-confirm-navList:first-child a').classList.add('navList');
            document.querySelectorAll('.selectBrand .ant-confirm-contentList button').forEach((item,index)=>{
                item.classList.remove('ant-btn-primary');
            });*/
        }).catch((error)=>{
            message.error(`请求出错：${error}`);
            throw error;
        });
    }

    //选择汽车车系的逻辑
    handleCarseriesClick(series){
        return (e)=>{
            if(series===this.state.carseriesValue){
                return;
            }
            this.setState({
                carseriesValue: series,
            });
            this.resetType.bind(this)();
            document.querySelectorAll('.selectSeries .ant-confirm-contentList button').forEach((item,index)=>{
                item.classList.remove('ant-btn-primary');
            });
            e.target.classList.add('ant-btn-primary');
        }
    }

    //显示
    handleCarseriesSelect(){
        if(!this.state.brandValue){
            message.warning('请选择汽车品牌');
            return;
        }
        fetch(`/car/series?brand_name=${this.state.brandValue}`).then((response)=>{
            return response.json();
        }).then((json)=>{
            console.log(json);
            this.setState({
                carseriesVisible: true,
                carseries: json.series,
                // carseriesValue: '',
            });
            /*document.querySelectorAll('.selectSeries .ant-confirm-contentList button').forEach((item,index)=>{
                item.classList.remove('ant-btn-primary');
            });*/
        }).catch((error)=>{
            throw error;
        });
    }

    //选择汽车车型的逻辑
    //选择组机场的逻辑
    handleFactoryClick(factory){
        return (e)=>{
            document.querySelectorAll('.selectType .ant-confirm-factoryList a').forEach((item,index)=>{
                item.classList.remove('navList');
            });
            e.target.classList.add('navList');
            document.querySelectorAll('.selectType .ant-confirm-contentList button').forEach((item,index)=>{
                item.classList.remove('ant-btn-primary');
            });

            this.setState({
                factoryValue: factory,
                cartypeValue: '',
            });

            let param = `serie_name=${this.state.carseriesValue}`;
                param += `&factory_name=${encodeURIComponent(factory)}`;
                param += `&product_year=${encodeURIComponent(this.state.yearValue)}`;
                param += `&displacement=${encodeURIComponent(this.state.displacementValue)}`;
            fetch(`/car/type?${param}`).then((response)=>{
                return response.json();
            }).then((json)=>{
                this.setState({
                    cartypes: json.types,
                });
            }).catch((error)=>{
                throw error;
            });
        }
    }

    //选择年份的逻辑
    handleYearClick(year){
        return (e)=>{
            document.querySelectorAll('.selectType .ant-confirm-yearList a').forEach((item,index)=>{
                item.classList.remove('navList');
            });
            e.target.classList.add('navList');
            document.querySelectorAll('.selectType .ant-confirm-contentList button').forEach((item,index)=>{
                item.classList.remove('ant-btn-primary');
            });

            this.setState({
                yearValue: year,
                cartypeValue: '',
            });

            let param = `serie_name=${this.state.carseriesValue}`;
                param += `&factory_name=${encodeURIComponent(this.state.factoryValue)}`;
                param += `&product_year=${encodeURIComponent(year)}`;
                param += `&displacement=${encodeURIComponent(this.state.displacementValue)}`;
            fetch(`/car/type?${param}`).then((response)=>{
                return response.json();
            }).then((json)=>{
                this.setState({
                    cartypes: json.types,
                });
            }).catch((error)=>{
                throw error;
            });
        }
    }

    //选择排量的逻辑
    handleDisplacementClick(displacement){
        return (e)=>{
            document.querySelectorAll('.selectType .ant-confirm-navList a').forEach((item,index)=>{
                item.classList.remove('navList');
            });
            e.target.classList.add('navList');
            document.querySelectorAll('.selectType .ant-confirm-contentList button').forEach((item,index)=>{
                item.classList.remove('ant-btn-primary');
            });

            this.setState({
                displacementValue: displacement,
                cartypeValue: '',
            });

            let param = `serie_name=${this.state.carseriesValue}`;
                param += `&factory_name=${encodeURIComponent(this.state.factoryValue)}`;
                param += `&product_year=${encodeURIComponent(this.state.yearValue)}`;
                param += `&displacement=${encodeURIComponent(displacement)}`;
            fetch(`/car/type?${param}`).then((response)=>{
                return response.json();
            }).then((json)=>{
                this.setState({
                    cartypes: json.types,
                });
            }).catch((error)=>{
                throw error;
            });
        }
    }

    //选择车型的逻辑
    handleCartypeClick(cartype){
        return (e)=>{
            this.setState({
                cartypeValue: cartype,
            });
            document.querySelectorAll('.selectType .ant-confirm-contentList button').forEach((item,index)=>{
                item.classList.remove('ant-btn-primary');
            });
            e.target.classList.add('ant-btn-primary');
        }
    }

    //显示选择车型的modal
    handleCartypeSelect(){
        if(!this.state.brandValue) {
            message.warning('请选择汽车品牌');
            return;
        } else if(!this.state.carseriesValue){
            message.warning('请选择车系');
            return;
        } else {
            fetch(`/car/type?serie_name=${this.state.carseriesValue}`).then((response)=>{
                return response.json();
            }).then((json)=>{
                console.log(json);

                let factoryValue = '';
                let yearValue = '';
                let displacementValue = '';

                if(json.factorys.length===1){
                    factoryValue = json.factorys[0];
                }
                if(json.years.length===1){
                    yearValue = json.years[0];
                }
                if(json.displacements.length===1){
                    displacementValue = json.displacements[0];
                }

                this.setState({
                    factorys: json.factorys,
                    displacements: json.displacements,
                    years: json.years,
                    cartypes: json.types,
                    cartypeVisible: true,
                    /*factoryValue: factoryValue,
                    yearValue: yearValue,
                    displacementValue: displacementValue,
                    cartypeValue: '',*/
                });

                /*document.querySelectorAll('.selectType .ant-confirm-navList a').forEach((item,index)=>{
                    item.classList.remove('navList');
                });
                document.querySelectorAll('.selectType .ant-confirm-yearList a').forEach((item,index)=>{
                    item.classList.remove('navList');
                });
                document.querySelectorAll('.selectType .ant-confirm-factoryList a').forEach((item,index)=>{
                    item.classList.remove('navList');
                });
                document.querySelectorAll('.selectType .ant-confirm-contentList button').forEach((item,index)=>{
                    item.classList.remove('ant-btn-primary');
                });*/
            }).catch((error)=>{
                throw error;
            });
        }
    }

    //点击品牌下一步的逻辑
    handleBrandNext(){
        if(this.state.brandValue){
            this.handleCarseriesSelect.bind(this)();
            this.setState({
                brandVisible: false,
            });
        } else {
            message.warning('请选择汽车品牌');
        }
    }

    //点击车系下一步的逻辑
    handleSeriesNext(){
        if(this.state.carseriesValue){
            this.handleCartypeSelect.bind(this)();
            this.setState({
                carseriesVisible: false,
            });
        } else {
            message.warning('请选择车系');
        }
    }

    //点击车系上一步的逻辑
    handleSeriesPrevious(){
        this.setState({
            brandVisible: true,
            carseriesVisible: false,
        });
    }

    //点击车型上一步的逻辑
    handleTypePrevious(){
        this.setState({
            carseriesVisible: true,
            cartypeVisible: false,
        });
    }

    //点击车型下一步的逻辑
    handleTypeNext(){
        if(this.state.cartypeValue){
            this.setState({
                cartypeValue: this.state.cartypeValue,
                cartypeVisible: false,
            });
            var brandSeriesType = ``;
            brandSeriesType += `品牌:${this.state.brandValue};`;
            brandSeriesType += `车系:${this.state.carseriesValue};`;
            brandSeriesType += `车型:${this.state.cartypeValue};`;
            this.props.form.setFieldsValue({
                brandSeriesType: brandSeriesType,
            });
        } else {
            message.warning('请选择车型');
        }
    }

    //重置车系
    resetSeries(){
        this.setState({
            carseriesValue: '',
        });
        document.querySelectorAll('.selectSeries .ant-confirm-contentList button').forEach((item,index)=>{
            item.classList.remove('ant-btn-primary');
        });
    }

    //重置车型
    resetType(){
        this.setState({
            factoryValue: '',
            yearValue: '',
            displacementValue: '',
            cartypeValue: '',
        });
        document.querySelectorAll('.selectType .ant-confirm-navList a').forEach((item,index)=>{
            item.classList.remove('navList');
        });
        document.querySelectorAll('.selectType .ant-confirm-yearList a').forEach((item,index)=>{
            item.classList.remove('navList');
        });
        document.querySelectorAll('.selectType .ant-confirm-factoryList a').forEach((item,index)=>{
            item.classList.remove('navList');
        });
        document.querySelectorAll('.selectType .ant-confirm-contentList button').forEach((item,index)=>{
            item.classList.remove('ant-btn-primary');
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
                style={{zIndex:this.props.visibleState.CarInfo,opacity:this.props.visibleState.CarInfoAlpha}}
            >
                <Modal
                    title= {`品牌：${this.state.brandValue}`}
                    width= '650px'
                    maskClosable= {false}
                    visible={this.state.brandVisible}
                    wrapClassName="selectBrand"
                    footer={[
                        <Button key="next" type="primary" size="large" onClick={this.handleBrandNext.bind(this)}>
                            下一步
                        </Button>,
                    ]}
                    onCancel= {()=>{
                        this.setState({
                            brandVisible: false,
                        });
                    }}
                >
                    {
                        <div>
                            <div className="ant-confirm-divNav">
                                <ul className="clearfix">
                                    {
                                        this.state.brandSelect.map((item)=>{
                                            return (
                                                <li className="ant-confirm-navList">
                                                    <a
                                                        onClick={this.handleInitialClick(item).bind(this)}
                                                        className={item==='A'?'navList':''}
                                                    >
                                                        {item}
                                                    </a>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                            </div>
                            <div className="ant-confirm-divContent">
                                <ul className="clearfix">
                                    {
                                        this.state.brands.map((brand)=>{
                                            return (
                                                <li className='ant-confirm-contentList'>
                                                    <button
                                                        onClick={this.handleBrandClick(brand).bind(this)}
                                                        className="ant-btn"
                                                    >
                                                        {brand}
                                                    </button>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    }
                </Modal>
                <Modal
                    title= {`${this.state.brandValue}  ${this.state.carseriesValue}`}
                    width= '650px'
                    maskClosable= {false}
                    visible= {this.state.carseriesVisible}
                    wrapClassName="selectSeries"
                    footer={[
                        <Button key="seriesPrevious" size='large' onClick={this.handleSeriesPrevious.bind(this)}>
                            上一步
                        </Button>,
                        <Button key="seriesNext" size='large' type="primary" onClick={this.handleSeriesNext.bind(this)}>
                            下一步
                        </Button>
                    ]}
                    onCancel= {()=>{
                        this.setState({
                            carseriesVisible: false,
                        });
                    }}
                >
                    {
                        <div className="ant-confirm-divContent">
                            <ul className="clearfix">
                                {
                                    this.state.carseries.map((series)=>{
                                        return (
                                            <li className='ant-confirm-contentList'>
                                                <button
                                                    onClick={this.handleCarseriesClick(series).bind(this)}
                                                    className="ant-btn"
                                                >
                                                    {series}
                                                </button>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                    }
                </Modal>
                <Modal
                    title= {`${this.state.brandValue} ${this.state.carseriesValue} ${this.state.cartypeValue}`}
                    width= '650px'
                    maskClosable= {false}
                    visible={this.state.cartypeVisible}
                    wrapClassName="selectType"
                    footer={[
                        <Button key="typePrevious" size="large" onClick={this.handleTypePrevious.bind(this)}>
                            上一步
                        </Button>,
                        <Button key='typeNext' size="large" type="primary" onClick={this.handleTypeNext.bind(this)}>
                            确定
                        </Button>
                    ]}
                    onCancel= {()=>{
                        this.setState({
                            /*cartypeValue: '',
                            factoryValue: '',
                            yearValue: '',
                            displacementValue: '',*/
                            cartypeVisible: false,
                        });
                    }}
                >
                    {
                        <div>
                            <div className="ant-confirm-divNav">
                                组机厂：
                                <ul className="clearfix">
                                    {
                                        this.state.factorys.map((factory)=>{
                                            return (
                                                <li className="ant-confirm-factoryList">
                                                    <a onClick={this.handleFactoryClick(factory).bind(this)}>{factory}</a>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                                年份：
                                <ul className="clearfix">
                                    {
                                        this.state.years.map((year)=>{
                                            return (
                                                <li className="ant-confirm-yearList">
                                                    <a onClick={this.handleYearClick(year).bind(this)}>{year}</a>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                                排量：
                                <ul className="clearfix">
                                    {
                                        this.state.displacements.map((displacement)=>{
                                            return (
                                                <li className="ant-confirm-navList">
                                                    <a onClick={this.handleDisplacementClick(displacement).bind(this)}>{displacement}</a>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                            </div>
                            <div className="ant-confirm-divContent">
                                <ul className="clearfix">
                                    {
                                        this.state.cartypes.map((cartype)=>{
                                            return (
                                                <li className='ant-confirm-contentList'>
                                                    <button
                                                        onClick={this.handleCartypeClick(cartype).bind(this)}
                                                        className="ant-btn"
                                                    >
                                                        {cartype}
                                                    </button>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    }
                </Modal>
                <Steps current={1} className="layout-AddOrder-steps">
                    <Step title="客户信息" />
                    <Step title="车辆信息" />
                    <Step title="服务信息" />
                </Steps>
                <Form onSubmit={this.handleSubmit} className="layout-AddOrder-form">
                    <FormItem
                        {...formItemLayout}
                        label="品牌、车系、车型"
                    >
                        {getFieldDecorator('brandSeriesType', {
                            rules: [{ required: true, message: '请选择品牌' }],
                        })(
                                <Input
                                    onClick={this.handleBrandSelect.bind(this)}
                                    placeholder="请选择品牌、车系、车型"
                                />
                        )}
                    </FormItem>
                    {/*<FormItem
                        {...formItemLayout}
                        label="车系"
                    >
                        {getFieldDecorator('carseries', {
                            rules: [{ required: true, message: '请选择车系' }],
                        })(
                                <Input
                                    onClick={this.handleCarseriesSelect.bind(this)}
                                    placeholder="请选择车系"
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
                    </FormItem>*/}
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
                        //下面的代码要更改
                        /*let registerDate = new Date(carInfo.purchaseDate).toISOString().substr(0,10);
                        registerDate = registerDate.replace(/[^0-9]/g,'');*/
                        let carParam = ``;
                        carParam += `customerId=${customerId}`;
                        carParam += `&plate=${plate}`;
                        // carParam += `&registerDate= ${registerDate}`;
                        carParam += `&brandId=12`;
                        carParam += `&modelId=12`;
                        // carParam += `&displacement=${carInfo.displacement[0]}`;
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
