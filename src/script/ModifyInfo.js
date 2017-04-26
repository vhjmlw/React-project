import { Form, Input, Cascader, Select, Row, Col, Button, DatePicker, message, Modal } from 'antd';
import React from 'react';
import moment from 'moment';
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

	state = {
		customInfo: {
			phoneNumber: '',
			name: '',
			sex: '',
			plateNumber: '',
			captcha: '',
			product: [],
			cardChannel: [],
			customComment: '',
		},
		carInfo: {
			brand: [],
			cartype: [],
			displacement: [],
			purchaseDate: null,
			oilBrand: [],
			filterBrand: [],
			carComment: '',
		},
		serviceInfo: {
			address: [],
			detailAddress: '',
			serviceDate: null,
			serviceComment: '',
		},
		brands: ['大众', '路虎', '丰田', '标致'],
		brandValue: '',
		factorys: ['一汽大众', '上汽大众', '广汽大众'],
		cartypes: ['车型一','车型二','车型三'],
		cartypeValue: '',
		carseries: ['车系一', '车系二', '车系三', '车系四'],
		carseriesValue: '',
		displacements: [{value: '5.0L', label: '5.0L',},{value: '4.0L', label: '4.0L',}],
		years: [{value: '2016', label: '2016',},{value: '2017', label: '2017',}],
	}

	handleSearch(param){
		var regexp =new RegExp('(^|&)'+ param +'=([^&]*)(&|$)','i');
		//window.location.search.substr(1).match(regexp);会出错，无法获取到URL中的search
		//因为：query的规定是以第一个?开始，至行尾或#结束。fragment以#为开始，行尾为结束。
		//query一定要放在fragment的前面
		//如果使用上面的方式，获取到的search为空，
		// hash为"#/App/ModifyInfo?customerId=122&carId=15&maintainId=8"
		var paramArray = window.location.hash.split('?')[1].match(regexp);
		if(paramArray){
			return paramArray[2];
		}
		return null;
	}

	backToFront(source){
		let registerDate = source.registerDate;
		registerDate = registerDate ? moment(registerDate.substr(0,4)+'-'+registerDate.substr(4,2)+'-'+registerDate.substr(6,2), "YYYY-MM-DD") : null;
		let serviceTime = source.serviceTime;
		serviceTime = serviceTime ? moment(serviceTime.substr(0,4)+'-'+serviceTime.substr(4,2)+'-'+serviceTime.substr(6,2), "YYYY-MM-DD") : null;
		let engineOilBrand = source.engineOilBrand;
		engineOilBrand = engineOilBrand ? engineOilBrand.split('/') : [];
		let serviceAddress = source.serviceAddress;
		serviceAddress = serviceAddress ? serviceAddress.split('/') : [];
		return {
			phoneNumber: source.phone || '',
			name: source.name || '',
			sex: source.sex === true ? '男' : '女',
			plateNumber: source.plate || '',
			captcha: source.cardId || '',
			product: [source.productType] || [],
			cardChannel: [source.cardChannel] || [],
			customComment: source.customComment || '',
			brand: [source.brandId] || [],
			cartype: [source.modelId] || [],
			displacement: [source.displacement] || [],
			purchaseDate: registerDate,
			oilBrand: engineOilBrand,
			filterBrand: [source.engineFilterBrand] || [],
			carComment: source.carComment || '',
			address: serviceAddress,
			detailAddress: source.detailAddress || '',
			serviceDate: serviceTime,
			serviceComment: source.serviceComment || '',
		};
	}

	frontToBack(source){
		const purchaseDate = source.purchaseDate ? new Date(source.purchaseDate).toISOString().substr(0,10).replace(/[^0-9]/g,'') : '';
		const serviceDate = source.serviceDate ? new Date(source.serviceDate).toISOString().substr(0,10).replace(/[^0-9]/g,'') : '';
		return {
			phone: source.phoneNumber || '',
			name: source.name || '',
			sex: source.sex === '男' ? '1' : '0',
			plate: source.plateNumber || '',
			cardId: source.captcha || '',
			productType: source.product[0] || '',
			cardChannel: source.cardChannel[0] || '',
			customComment: source.customComment || '',
			brandId: source.brand[0] || '',
			modelId: source.cartype[0] || '',
			displacement: source.displacement[0] || '',
			registerDate: purchaseDate,
			engineOilBrand: source.oilBrand.join('/') || '',
			engineFilterBrand: source.filterBrand[0] || '',
			carComment: source.carComment || '',
			serviceAddress: source.address.join('/')|| '',
			detailAddress: source.detailAddress || '',
			serviceTime: serviceDate,
			serviceComment: source.serviceComment || '',
		};
	}

	componentWillMount(){

		let customInfo = null;
		let carInfo = null;
		let serviceInfo = null;
		let totalInfo = {};
		const customerId = this.handleSearch('customerId');
		const carId = this.handleSearch('carId');
		const maintainId = this.handleSearch('maintainId');

		fetch(`v1/customer/${customerId}`).then((response)=>{
			return response.json();
		}).then((json)=>{
			console.log(json);
			if(json.code === '200'){
				customInfo = json.data;
				customInfo.customComment = json.data.remark;
				return fetch(`v1/car/${carId}`);
			} else {
				message.warning(json.message);
			}
		}).then((response)=>{
			return response.json();
		}).then((json)=>{
			console.log(json);
			if(json.code === "200"){
				carInfo = json.data;
				carInfo.carComment = json.data.remark;
				return fetch(`v1/maintain/${maintainId}`);
			} else {
				message.warning(json.message);
			}
		}).then((response)=>{
			return response.json();
		}).then((json)=>{
			console.log(json);
			if(json.code === '200'){
				serviceInfo = json.data;
				serviceInfo.serviceComment = json.data.remark;
				Object.assign(totalInfo,customInfo,carInfo,serviceInfo);
				totalInfo.engineFilterBrand = carInfo.engineFilterBrand;
				totalInfo.engineOilBrand = carInfo.engineOilBrand;
				console.log(totalInfo);
				totalInfo = this.backToFront(totalInfo);
				console.log(totalInfo);
				if(totalInfo){
					this.setState({
						customInfo: {
							phoneNumber: totalInfo.phoneNumber,
							name: totalInfo.name,
							sex: totalInfo.sex,
							plateNumber: totalInfo.plateNumber,
							captcha: totalInfo.captcha,
							product: totalInfo.product,
							cardChannel: totalInfo.cardChannel,
							customComment: totalInfo.customComment,
						},
						carInfo: {
							brand: totalInfo.brand,
							cartype: totalInfo.cartype,
							displacement: totalInfo.displacement,
							purchaseDate: totalInfo.purchaseDate,
							oilBrand: totalInfo.oilBrand,
							filterBrand: totalInfo.filterBrand,
							carComment: totalInfo.carComment,
						},
						serviceInfo: {
							address: totalInfo.address,
							detailAddress: totalInfo.detailAddress,
							serviceDate: totalInfo.serviceDate,
							serviceComment: totalInfo.serviceComment,
						}
					});
				}
			} else {
				message.warning(json.message);
			}
		}).catch((error)=>{
			throw error;
		});
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
				values = this.frontToBack(values);
				console.log(values);
				const customerId = this.handleSearch('customerId');
				const carId = this.handleSearch('carId');
				const maintainId = this.handleSearch('maintainId');

				let customParam = ``;
				customParam += `id=${customerId}`;
				customParam += `&name=${values.name}`;
				customParam += `&phone=${values.phone}`;
				customParam += `&sex=${values.sex}`;
				customParam += `&remark=${values.customComment}`;
				fetch('v1/customer/update',{
					method: 'POST',
					headers: new Headers({
						'Content-Type': 'application/x-www-form-urlencoded',
					}),
					body: customParam,
				}).then( (response)=> {
					return response.json();
				}).then( (json)=> {
					if(json.code === "200"){
						let carParam = ``;
						carParam += `id=${carId}`;
						carParam += `&customerId=${customerId}`;
						carParam += `&plate=${values.plate}`;
						carParam += `&registerDate= ${values.registerDate}`;
						carParam += `&brandId=12`;
						carParam += `&modelId=12`;
						carParam += `&displacement=${values.displacement}`;
						carParam += `&engineOilBrand=${values.engineOilBrand}`;
						carParam += `&engineFilterBrand=${values.engineFilterBrand}`;
						carParam += `&remark=${values.carComment}`;
						return fetch('v1/car/update',{
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
						let serviceParam = ``;
						serviceParam += `id=${maintainId}`;
						serviceParam += `&customerId=${customerId}`;
						serviceParam += `&carId=${carId}`;
						serviceParam += `&cardId=${values.cardId}`;
						serviceParam += `&productType=${values.productType}`;
						serviceParam += `&cardChannel=${values.cardChannel}`;
						serviceParam += `&serviceAddress=${values.serviceAddress}`;
						serviceParam += `&detailAddress=${values.detailAddress}`;
						serviceParam += `&serviceTime=${values.serviceTime}`;
						serviceParam += `&status=待服务`;
						return fetch('v1/maintain/update',{
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
						message.success('提交成功',1.5,()=>{this.props.history.pushState(null, "/App")});
					} else {
						message.warning(json.message);
					}
				}).catch( (err)=> {
					throw err;
				});
			}
		});
	}

	handleBack(){
		this.props.history.pushState(null,'App');
	}

	//选择汽车品牌的逻辑
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
			width: '650px',
			maskClosable: true,
			okText: "确定",
			cancelText: "取消",
			onOk: ()=>{
				if(this.state.brandValue){
					this.handleCartypeSelect.bind(this)();
					this.setState({
						brandValue: '',
					});
				}
			},
			onCancel: ()=>{
				this.setState({
					brandValue: '',
				});
			},
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

	//选择汽车车型的逻辑
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
			this.setState({
				cartypeValue: cartype,
			});
			document.querySelectorAll('.ant-confirm-brand button').forEach((item,index)=>{
				item.classList.remove('ant-btn-primary');
			});
			e.target.classList.add('ant-btn-primary');
		}

	}

	handleCartypeSelect(){
		if(this.state.factorys.length===0){
			message.error('请先选择汽车品牌');
		} else {
			Modal.confirm({
				title: '请选择车型',
				width: '650px',
				maskClosable: true,
				onOk: ()=>{
					if(this.state.cartypeValue){
						this.handleCarseriesSelect.bind(this)();
						this.setState({
							cartypeValue: '',
						});
					}
				},
				onCancel: ()=>{
					this.setState({
						cartypeValue: '',
					});
				},
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
	}

	//选择汽车车系的逻辑
	handleCarseriesClick(series){
		return (e)=>{
			this.props.form.setFieldsValue({
				carseries: series,
			});
			this.setState({
				carseriesValue: series,
			});
			document.querySelectorAll('.ant-confirm-brand button').forEach((item,index)=>{
				item.classList.remove('ant-btn-primary');
			});
			e.target.classList.add('ant-btn-primary');
		}
	}

	handleCarseriesSelect(){
		if(this.state.factorys.length===0){
			message.error('请选择品牌');
		} else if(this.state.carseries.length===0){
			message.error('请先选择车型');
		} else {
			Modal.confirm({
				title: '请选择车系',
				width: '650px',
				maskClosable: true,
				onOk: ()=>{console.log('OK')},
				onCancel: ()=>console.log('cancle'),
				content: (
					<div>
						<div className="ant-confirm-divNav">
							排量：<Cascader options={this.state.displacements} size="default" style={{width:"110px"}} placeholder="请选择排量"/>&nbsp;&nbsp;
							年份：<Cascader options={this.state.years} size="default" style={{width:"110px"}} placeholder="请选择年份"/>
						</div>
						<div className="ant-confirm-divBrand">
							<ul className="clearfix">
								{
									this.state.carseries.map((series)=>{
										return (
											<li className='ant-confirm-brand'>
												<button onClick={this.handleCarseriesClick(series).bind(this)} className="ant-btn">{series}</button>
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
							}],
							initialValue: this.state.customInfo.name,
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
							initialValue: this.state.customInfo.sex,
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
									rules: [{ required: true, message: '请输入验证码' }],
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
							initialValue: this.state.carInfo.cartype,
						})(
							<Input
								onClick={this.handleCartypeSelect.bind(this)}
								placeholder="请选择车型"
							/>
						)}
					</FormItem>
					<FormItem
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
					{/*<FormItem
						{...formItemLayout}
						label="服务区域"
					>
						{getFieldDecorator('area', {
							rules: [{type: 'array', required: true, message: '请选择服务区域'}],
							initialValue: this.state.serviceInfo.area,
						})(
							<Cascader options={area} size="large" style={{width:'110px'}} placeholder="请选择服务区域" />
						)}
					</FormItem>*/}
					<FormItem
						{...formItemLayout}
						label="服务地址"
					>
						{getFieldDecorator('address', {
							rules: [{type: 'array', required: true, message: '请选择服务地址'}],
							initialValue: this.state.serviceInfo.address,
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