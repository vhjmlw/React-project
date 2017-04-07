import { Form, Input, Cascader, Select, Row, Col, Checkbox, Button, DatePicker, message, Tabs } from 'antd';
import React from 'react';
import moment from 'moment';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

function callback(key) {
  console.log(key);
}

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

const Addresses = [{
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

const orderInfo = {
	phoneNumber: '15226374837',
	name: '中德联信',
	plateNumber: '苏NYR808',
	captcha: '1234',
	product: ['到店维修'],
	cardChannel: ['超市赠送'],
	customComment: '客户信息的备注',
	brand: ['丰田'],
	cartype: ['A型车'],
	displacement: ['5.0L'],
	purchaseDate: moment("2017-03-29", "YYYY-MM-DD"),
	oilBrand: ["柴油","83#"],
	filterBrand: ["机滤品牌第二个"],
	carComment: '车辆信息的备注',
	address: ["高新区","马涧路"],
	detailAddress: '这里是详细的地址',
	serviceDate: moment("2017-03-29", "YYYY-MM-DD"),
	serviceComment: '服务信息的备注',
};
let {phoneNumber,name,plateNumber,captcha,product,cardChannel,customComment,brand,cartype,
		displacement,purchaseDate,oilBrand,filterBrand,carComment,address,detailAddress,serviceDate,serviceComment} = orderInfo;

class CustomInfoForm extends React.Component {
	state = {
		confirmDirty: false,
	};
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
				window.localStorage.setItem("customInfo",JSON.stringify(values));
			}
		});
	}
	handleConfirmBlur = (e) => {
		const value = e.target.value;
		this.setState({ confirmDirty: this.state.confirmDirty || !!value });
	}

	checkConfirm = (rule, value, callback) => {
		const form = this.props.form;
		if (value && this.state.confirmDirty) {
			form.validateFields(['confirm'], { force: true });
		}
		callback();
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
			<div>
				<Form onSubmit={this.handleSubmit}>
					<FormItem
						{...formItemLayout}
						label="电话"
						hasFeedback
					>
						{getFieldDecorator('phoneNumber', {
							rules: [{
								pattern: /^1(3|4|5|7|8)[0-9]\d{8}$/, message: '电话号码格式不正确',
							}, {
								required: true, message: '请输入电话号码',
							}],
							initialValue: phoneNumber,
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
							},{
								pattern: /^([a-zA-Z\u4e00-\u9fa5\·]{1,10})$/, message: '姓名格式不正确',
							}],
							initialValue: name,
						})(
							<Input />
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
							},{/*{
							 pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}\s*[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/, message: '车牌号格式不正确',
							 }*/}],
							initialValue: plateNumber,
						})(
							<Input />
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="验证码"
						extra="We must make sure that your are a human."
					>
						<Row gutter={8}>
							<Col span={12}>
								{getFieldDecorator('captcha', {
									rules: [{ required: true, message: 'Please input the captcha you got!' }],
									initialValue: captcha,
								})(
									<Input size="large" />
								)}
							</Col>
							<Col span={12}>
								<Button size="large">Get captcha</Button>
							</Col>
						</Row>
					</FormItem>

					<FormItem
						{...formItemLayout}
						label="产品类型"
					>
						{getFieldDecorator('product', {
							rules: [{ required: true, message: '请选择产品类型' }],
							initialValue: product,
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
							initialValue: cardChannel,
						})(
							<Cascader options={cardChannels} size="large" style={{width:"110px"}} placeholder="请选择发卡渠道"/>
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="备注"
						hasFeedback
					>
						{getFieldDecorator('customComment', {
							initialValue: customComment,
						})(
							<Input />
						)}
					</FormItem>
					<FormItem {...tailFormItemLayout}>
						<Button type="primary" htmlType="submit" size="large">保存</Button>
					</FormItem>
				</Form>
			</div>
		);
	}
}

const CustomInfo = Form.create()(CustomInfoForm);

class CarInfoForm extends React.Component {
	state = {
		confirmDirty: false,
	};
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
				window.localStorage.setItem("carInfo",JSON.stringify(values));
			}
		});
	}

	handleConfirmBlur = (e) => {
		const value = e.target.value;
		this.setState({ confirmDirty: this.state.confirmDirty || !!value });
	}
	checkConfirm = (rule, value, callback) => {
		const form = this.props.form;
		if (value && this.state.confirmDirty) {
			form.validateFields(['confirm'], { force: true });
		}
		callback();
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
			<div>
				<Form onSubmit={this.handleSubmit}>
					<FormItem
						{...formItemLayout}
						label="品牌"
					>
						{getFieldDecorator('brand', {
							rules: [{ required: true, message: '请选择品牌' }],
							initialValue: brand,
						})(
							<Cascader options={brands} size="large" style={{width:"110px"}} placeholder="请选择品牌"/>
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="车型"
					>
						{getFieldDecorator('cartype', {
							rules: [{ required: true, message: '请选择车型' }],
							initialValue: cartype,
						})(
							<Cascader options={cartypes} size="large" style={{width:"110px"}} placeholder="请选择车型"/>
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="排量"
					>
						{getFieldDecorator('displacement', {
							rules: [{ required: true, message: '请选择排量' }],
							initialValue: displacement,
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
							initialValue: purchaseDate,
						})(
							<DatePicker />
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="机油品牌"
					>
						{getFieldDecorator('oilBrand', {
							rules: [{type: 'array', required: true, message: '请选择机油品牌'}],
							initialValue: oilBrand,
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
							initialValue: filterBrand,
						})(
							<Cascader options={filterBrands} size="large" style={{width:"110px"}} placeholder="请选择机滤品牌"/>
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="备注"
						hasFeedback
					>
						{getFieldDecorator('carComment', {
							initialValue: carComment,
						})(
							<Input />
						)}
					</FormItem>
					<FormItem {...tailFormItemLayout}>
						<Button type="primary" htmlType="submit" size="large">保存</Button>
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
			if (!err) {
				console.log('Received values of form: ', values);
				window.localStorage.setItem("serviceInfo",JSON.stringify(values));
				const orderInfo = {};
				const customInfo = JSON.parse(window.localStorage.getItem("customInfo"));
				const carInfo = JSON.parse(window.localStorage.getItem("carInfo"));
				const serviceInfo = JSON.parse(window.localStorage.getItem("serviceInfo"));
				Object.assign(orderInfo,customInfo,carInfo,serviceInfo);
				orderInfo.purchaseDate = new Date(orderInfo.purchaseDate).toLocaleDateString();
				orderInfo.serviceDate = new Date(orderInfo.serviceDate).toLocaleDateString();
				orderInfo.area = orderInfo.address[0];
				orderInfo.state = "已服务";
				orderInfo.key = new Date().getTime();
				// window.localStorage.setItem("orderInfo",JSON.stringify(orderInfo));
				const tableList = window.localStorage.getItem("tableList");
				if(tableList){
					const newTabList = JSON.parse(tableList);
					newTabList.push(orderInfo);
					window.localStorage.setItem("tableList",JSON.stringify(newTabList));
				} else {
					const array = [];
					array.push(orderInfo);
					window.localStorage.setItem("tableList", JSON.stringify(array));
				}
				console.log(window.localStorage);
				message.success('提交成功',1.5,()=>{this.props.changeRoute(null, "/App");});

			}
		});
	}
	handleConfirmBlur = (e) => {
		const value = e.target.value;
		this.setState({ confirmDirty: this.state.confirmDirty || !!value });
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
			<div>
				<Form onSubmit={this.handleSubmit}>
					<FormItem
						{...formItemLayout}
						label="服务地址"
					>
						{getFieldDecorator('address', {
							rules: [{type: 'array', required: true, message: '请选择服务地址'}],
							initialValue: address,
						})(
							<Cascader options={Addresses} size="large" placeholder="请选择服务地址" />
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="详细地址"
						hasFeedback
					>
						{getFieldDecorator('detailAddress', {
							rules: [{required: true, message: '请输入详细地址'}],
							initialValue: detailAddress,
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
							initialValue: serviceDate,
						})(
							<DatePicker />
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="备注"
						hasFeedback
					>
						{getFieldDecorator('serviceComment', {
							initialValue: serviceComment,
						})(
							<Input />
						)}
					</FormItem>
					<FormItem {...tailFormItemLayout}>
						<Button type="primary" htmlType="submit" size="large">保存</Button>
					</FormItem>
				</Form>
			</div>
		);
	}
}

const ServiceInfo = Form.create()(ServiceInfoForm);

class ModifyInfo extends React.Component {
	render(){
		const back = <Button type="primary">返回</Button>
		return (
			<Tabs onChange={callback}
				  animated={false}
				  tabBarExtraContent={back}
			>
		    <TabPane tab="客户信息" key="1">
				<CustomInfo />
			</TabPane>
		    <TabPane tab="车辆信息" key="2">
				<CarInfo />
			</TabPane>
		    <TabPane tab="服务信息" key="3">
				<ServiceInfo />
			</TabPane>
		  </Tabs>
		);
	}
}

export default ModifyInfo;