import {Form, Input, Cascader, Select, Row, Col, Button, Steps, DatePicker, message, Modal, Radio} from 'antd';
import React from 'react';
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

    //选择汽车品牌的逻辑
    handleInitialClick(item) {
        return (e)=> {
            if (item === this.state.initialValue) {
                return;
            }
            document.querySelectorAll('.selectBrand .ant-confirm-navList a').forEach((item, index)=> {
                item.classList.remove('navList');
            });
            e.target.classList.add('navList');
            document.querySelectorAll('.selectBrand .ant-confirm-contentList button').forEach((item, index)=> {
                item.classList.remove('ant-btn-primary');
            });
            fetch(`car/brand?initial=${item}`).then((response)=> {
                return response.json();
            }).then((json)=> {
                console.log(json);
                this.setState({
                    brands: json.brands,
                    initialValue: item,
                    brandValue: '',
                });
            }).catch((error)=> {
                throw error;
            });
        }
    }

    handleBrandClick(brand) {
        return (e)=> {
            if (brand === this.state.brandValue) {
                return;
            }
            this.setState({
                brandValue: brand,
            });
            this.resetSeries.bind(this)();
            this.resetType.bind(this)();
            document.querySelectorAll('.selectBrand .ant-confirm-contentList button').forEach((item, index)=> {
                item.classList.remove('ant-btn-primary');
            });
            e.target.classList.add('ant-btn-primary');
        }
    }

    handleBrandSelect() {
        fetch(`car/brand?initial=${this.state.initialValue || 'A'}`).then((response)=> {
            return response.json();
        }).then((json)=> {
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
        }).catch((error)=> {
            message.error(`请求出错：${error}`);
            throw error;
        });
    }

    //选择汽车车系的逻辑
    handleCarseriesClick(series) {
        return (e)=> {
            if (series === this.state.carseriesValue) {
                return;
            }
            this.setState({
                carseriesValue: series,
            });
            this.resetType.bind(this)();
            document.querySelectorAll('.selectSeries .ant-confirm-contentList button').forEach((item, index)=> {
                item.classList.remove('ant-btn-primary');
            });
            e.target.classList.add('ant-btn-primary');
        }
    }

    //显示
    handleCarseriesSelect() {
        if (!this.state.brandValue) {
            message.warning('请选择汽车品牌');
            return;
        }
        fetch(`/car/series?brand_name=${this.state.brandValue}`).then((response)=> {
            return response.json();
        }).then((json)=> {
            console.log(json);
            this.setState({
                carseriesVisible: true,
                carseries: json.series,
                // carseriesValue: '',
            });
            /*document.querySelectorAll('.selectSeries .ant-confirm-contentList button').forEach((item,index)=>{
             item.classList.remove('ant-btn-primary');
             });*/
        }).catch((error)=> {
            throw error;
        });
    }

    //选择汽车车型的逻辑
    //选择组机场的逻辑
    handleFactoryClick(factory) {
        return (e)=> {
            document.querySelectorAll('.selectType .ant-confirm-factoryList a').forEach((item, index)=> {
                item.classList.remove('navList');
            });
            e.target.classList.add('navList');
            document.querySelectorAll('.selectType .ant-confirm-contentList button').forEach((item, index)=> {
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
            fetch(`/car/type?${param}`).then((response)=> {
                return response.json();
            }).then((json)=> {
                this.setState({
                    cartypes: json.types,
                });
            }).catch((error)=> {
                throw error;
            });
        }
    }

    //选择年份的逻辑
    handleYearClick(year) {
        return (e)=> {
            document.querySelectorAll('.selectType .ant-confirm-yearList a').forEach((item, index)=> {
                item.classList.remove('navList');
            });
            e.target.classList.add('navList');
            document.querySelectorAll('.selectType .ant-confirm-contentList button').forEach((item, index)=> {
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
            fetch(`/car/type?${param}`).then((response)=> {
                return response.json();
            }).then((json)=> {
                this.setState({
                    cartypes: json.types,
                });
            }).catch((error)=> {
                throw error;
            });
        }
    }

    //选择排量的逻辑
    handleDisplacementClick(displacement) {
        return (e)=> {
            document.querySelectorAll('.selectType .ant-confirm-navList a').forEach((item, index)=> {
                item.classList.remove('navList');
            });
            e.target.classList.add('navList');
            document.querySelectorAll('.selectType .ant-confirm-contentList button').forEach((item, index)=> {
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
            fetch(`/car/type?${param}`).then((response)=> {
                return response.json();
            }).then((json)=> {
                this.setState({
                    cartypes: json.types,
                });
            }).catch((error)=> {
                throw error;
            });
        }
    }

    //选择车型的逻辑
    handleCartypeClick(cartype) {
        return (e)=> {
            this.setState({
                cartypeValue: cartype,
            });
            document.querySelectorAll('.selectType .ant-confirm-contentList button').forEach((item, index)=> {
                item.classList.remove('ant-btn-primary');
            });
            e.target.classList.add('ant-btn-primary');
        }
    }

    //显示选择车型的modal
    handleCartypeSelect() {
        if (!this.state.brandValue) {
            message.warning('请选择汽车品牌');
            return;
        } else if (!this.state.carseriesValue) {
            message.warning('请选择车系');
            return;
        } else {
            fetch(`/car/type?serie_name=${this.state.carseriesValue}`).then((response)=> {
                return response.json();
            }).then((json)=> {
                console.log(json);

                let factoryValue = '';
                let yearValue = '';
                let displacementValue = '';

                if (json.factorys.length === 1) {
                    factoryValue = json.factorys[0];
                }
                if (json.years.length === 1) {
                    yearValue = json.years[0];
                }
                if (json.displacements.length === 1) {
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
            }).catch((error)=> {
                throw error;
            });
        }
    }

    //点击品牌下一步的逻辑
    handleBrandNext() {
        if (this.state.brandValue) {
            this.handleCarseriesSelect.bind(this)();
            this.setState({
                brandVisible: false,
            });
        } else {
            message.warning('请选择汽车品牌');
        }
    }

    //点击车系下一步的逻辑
    handleSeriesNext() {
        if (this.state.carseriesValue) {
            this.handleCartypeSelect.bind(this)();
            this.setState({
                carseriesVisible: false,
            });
        } else {
            message.warning('请选择车系');
        }
    }

    //点击车系上一步的逻辑
    handleSeriesPrevious() {
        this.setState({
            brandVisible: true,
            carseriesVisible: false,
        });
    }

    //点击车型上一步的逻辑
    handleTypePrevious() {
        this.setState({
            carseriesVisible: true,
            cartypeVisible: false,
        });
    }

    //点击车型下一步的逻辑
    handleTypeNext() {
        if (this.state.cartypeValue) {
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
    resetSeries() {
        this.setState({
            carseriesValue: '',
        });
        document.querySelectorAll('.selectSeries .ant-confirm-contentList button').forEach((item, index)=> {
            item.classList.remove('ant-btn-primary');
        });
    }

    //重置车型
    resetType() {
        this.setState({
            factoryValue: '',
            yearValue: '',
            displacementValue: '',
            cartypeValue: '',
        });
        document.querySelectorAll('.selectType .ant-confirm-navList a').forEach((item, index)=> {
            item.classList.remove('navList');
        });
        document.querySelectorAll('.selectType .ant-confirm-yearList a').forEach((item, index)=> {
            item.classList.remove('navList');
        });
        document.querySelectorAll('.selectType .ant-confirm-factoryList a').forEach((item, index)=> {
            item.classList.remove('navList');
        });
        document.querySelectorAll('.selectType .ant-confirm-contentList button').forEach((item, index)=> {
            item.classList.remove('ant-btn-primary');
        });
    }

    disabledDate(current) {
        return current && current.valueOf() < Date.now();
    }

    handleBack(){
        this.props.history.pushState(null,'/App');
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

                <Modal
                    title={`品牌：${this.state.brandValue}`}
                    width='650px'
                    maskClosable={false}
                    visible={this.state.brandVisible}
                    wrapClassName="selectBrand"
                    footer={[
                        <Button key="next" type="primary" size="large" onClick={this.handleBrandNext.bind(this)}>
                            下一步
                        </Button>,
                    ]}
                    onCancel={()=> {
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
                                        this.state.brandSelect.map((item)=> {
                                            return (
                                                <li className="ant-confirm-navList">
                                                    <a
                                                        onClick={this.handleInitialClick(item).bind(this)}
                                                        className={item === 'A' ? 'navList' : ''}
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
                                        this.state.brands.map((brand)=> {
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
                    title={`${this.state.brandValue}  ${this.state.carseriesValue}`}
                    width='650px'
                    maskClosable={false}
                    visible={this.state.carseriesVisible}
                    wrapClassName="selectSeries"
                    footer={[
                        <Button key="seriesPrevious" size='large' onClick={this.handleSeriesPrevious.bind(this)}>
                            上一步
                        </Button>,
                        <Button key="seriesNext" size='large' type="primary" onClick={this.handleSeriesNext.bind(this)}>
                            下一步
                        </Button>
                    ]}
                    onCancel={()=> {
                        this.setState({
                            carseriesVisible: false,
                        });
                    }}
                >
                    {
                        <div className="ant-confirm-divContent">
                            <ul className="clearfix">
                                {
                                    this.state.carseries.map((series)=> {
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
                    title={`${this.state.brandValue} ${this.state.carseriesValue} ${this.state.cartypeValue}`}
                    width='650px'
                    maskClosable={false}
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
                    onCancel={()=> {
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
                                        this.state.factorys.map((factory)=> {
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
                                        this.state.years.map((year)=> {
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
                                        this.state.displacements.map((displacement)=> {
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
                                        this.state.cartypes.map((cartype)=> {
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
                <h3>车辆信息</h3>
                <FormItem
                    {...formItemLayout}
                    label="车型"
                >
                    {getFieldDecorator('brandSeriesType', {
                        rules: [{required: true, message: '车型'}],
                    })(
                        <Input
                            onClick={this.handleBrandSelect.bind(this)}
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
                        <DatePicker
                            disabledDate={this.disabledDate.bind(this)}
                        />
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
                    <Button type='primary' size="large" onClick={this.handleBack.bind(this)}>返回</Button>
                    <Button type="primary" htmlType="submit" size="large">提交</Button>
                </FormItem>
            </Form>
        );
    }
}

const OrderInfo = Form.create()(OrderInfoForm);

export default OrderInfo;