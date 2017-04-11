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

/*const totalInfo = {
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
 };*/

class ModifyInfoForm extends React.Component {

	componentWillMount(){
		let totalInfo = window.localStorage.getItem("totalInfo");
		if(totalInfo){
			totalInfo = JSON.parse(totalInfo);
			totalInfo.purchaseDate = moment(totalInfo.purchaseDate, "YYYY-MM-DD");
			totalInfo.serviceDate = moment(totalInfo.serviceDate, "YYYY-MM-DD");

			this.setState({
				confirmDirty: false,
				key: totalInfo.key,
				customInfo: {
					phoneNumber: totalInfo.phoneNumber || '',
					name: totalInfo.name || '',
					plateNumber: totalInfo.plateNumber || '',
					captcha: totalInfo.captcha || '',
					product: totalInfo.product || [],
					cardChannel: totalInfo.cardChannel || [],
					customComment: totalInfo.customComment || '',
				},
				carInfo: {
					brand: totalInfo.brand || [],
					cartype: totalInfo.cartype || [],
					displacement: totalInfo.displacement || [],
					purchaseDate: totalInfo.purchaseDate || null,
					oilBrand: totalInfo.oilBrand || [],
					filterBrand: totalInfo.filterBrand || [],
					carComment: totalInfo.carComment || '',
				},
				serviceInfo: {
					address: totalInfo.address || [],
					detailAddress: totalInfo.detailAddress || '',
					serviceDate: totalInfo.serviceDate || null,
					serviceComment: totalInfo.serviceComment || '',
				}
			});
		}
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				values.key = this.state.key;
				values.purchaseDate = new Date(values.purchaseDate).toISOString().substr(0,10);
				values.serviceDate = new Date(values.serviceDate).toISOString().substr(0,10);
				console.log('Received values of form: ', values);
				let orderList = JSON.parse(window.localStorage.orderList);
				for(let item of orderList){
					if(item.key === this.state.key){
						Object.assign(item,values);
						break;
					}
				}
				window.localStorage.setItem('orderList',JSON.stringify(orderList));
				message.success('保存成功',1.5,()=>{this.props.history.pushState(null, "/App")});
			}
		});
	}

	handleBack(){
		this.props.history.pushState(null,'App');
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

	render(){

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
				<Form onSubmit={this.handleSubmit.bind(this)}>
					<h3>用户信息：</h3>
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
							initialValue: this.state.customInfo.phoneNumber,
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
							initialValue: this.state.customInfo.name,
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
							}],
							initialValue: this.state.customInfo.plateNumber,
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
									initialValue: this.state.customInfo.captcha,
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
							initialValue: this.state.customInfo.product,
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
							initialValue: this.state.customInfo.cardChannel,
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
							initialValue: this.state.customInfo.customComment,
						})(
							<Input type="textarea" autosize={{minRows:3}}/>
						)}
					</FormItem>
					<h3>车辆信息：</h3>
					<FormItem
						{...formItemLayout}
						label="品牌"
					>
						{getFieldDecorator('brand', {
							rules: [{ required: true, message: '请选择品牌' }],
							initialValue: this.state.carInfo.brand,
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
							initialValue: this.state.carInfo.cartype,
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
							initialValue: this.state.carInfo.displacement,
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
							initialValue: this.state.carInfo.purchaseDate,
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
							initialValue: this.state.carInfo.oilBrand,
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
							initialValue: this.state.carInfo.filterBrand,
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
							initialValue: this.state.carInfo.carComment,
						})(
							<Input type="textarea" autosize={{minRows:3}}/>
						)}
					</FormItem>
					<h3>服务信息：</h3>
					<FormItem
						{...formItemLayout}
						label="服务地址"
					>
						{getFieldDecorator('address', {
							rules: [{type: 'array', required: true, message: '请选择服务地址'}],
							initialValue: this.state.serviceInfo.address,
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
							initialValue: this.state.serviceInfo.detailAddress,
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
							initialValue: this.state.serviceInfo.serviceDate,
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
							initialValue: this.state.serviceInfo.serviceComment,
						})(
							<Input type="textarea" autosize={{minRows:3}}/>
						)}
					</FormItem>
					<FormItem {...tailFormItemLayout}>
						<Button type="primary" size="large" onClick={this.handleBack.bind(this)}>返回</Button>
						<Button type="primary" htmlType="submit" size="large">保存</Button>
					</FormItem>
				</Form>
			</div>
		);
	}
}

const ModifyInfo = Form.create()(ModifyInfoForm);
export default ModifyInfo;