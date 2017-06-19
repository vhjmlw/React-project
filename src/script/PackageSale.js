import { Table, Button, Popconfirm, Form, message, Input, Select, DatePicker, InputNumber } from 'antd';
import React from 'react';
import moment from 'moment';
import Request from "./util/Request";
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
}
// const packageData = ['产品一','产品二','产品三','产品四','产品五'];

class PackageSale extends React.Component {
    state = {
        columns: [{
            title: '渠道编号',
            dataIndex: 'code',
            key: 'code',
            width: '25%',
        }, {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: '25%',
        }, {
            title: '产品',
            dataIndex: 'packageAndNumber',
            key: 'packageAndNumber',
            width: '25%',
        }, {
            title: '操作',
            key: 'Action',
            render: (text, record) => (
                <span>
                    <Popconfirm
                        placement="bottomRight"
                        onConfirm={this.handleModifyOK.bind(this)}
                        onCancel={this.handleModifyCancel.bind(this)}
                        title={this.addConfirm.bind(this)()}
                        okText="确定"
                        cancelText="取消"
                        visible={this.state.key===record.key&&this.state.which==='modify'}
                    >
                        <a onClick={this.handleModifyClick(record)}>修改</a>
                    </Popconfirm>
                    <span className="ant-divider"/>
                    <Popconfirm
                        placement="bottomRight"
                        onConfirm={this.handlePackageOK.bind(this)}
                        onCancel={this.handlePackageCancel.bind(this)}
                        title={this.packageConfirm.bind(this)()}
                        okText="确定"
                        cancelText="取消"
                        visible={this.state.key===record.key&&this.state.which==='package'}
                    >
                        <a onClick={this.handlePackageClick(record)}>产品销售</a>
                    </Popconfirm>
                </span>
            ),
        }],
        addVisible: false,
        channel: '',
        name: '',
        key: 0,
        packageAndNumber: '',
        package: '',
        date: '',
        number: '',
        which: '',
        channels: [],
        price: '',
        productArr: []
    }

    componentDidMount() {
        this.search();
    }

    search() {
        let channels = Request.synPost("/channel/listByNameAndCode").map((item) => {
            item.key = item.id;
            let productStr = '';
            if(item.productSales && item.productSales.length > 0){
                for(let product of item.productSales){
                    productStr += product.productName + product.num + '份 ';
                }
            }
            item.packageAndNumber = productStr;
            return item;
        });
        this.setState({
            channels: channels,
            addVisible: false
        });
    }

    handleModifyClick(record){
        return ()=>{
            this.setState({
                channel:record.code,
                name:record.name,
                key:record.key,
                which: 'modify',
            })
        }
    }

    handlePackageClick(record){
        return ()=>{
            /*if(record.packageAndNumber){
                this.setState({
                    packageAndNumber: record.packageAndNumber,
                    package: record.package,
                    date: record.date,
                    number: record.number,
                    key: record.key,
                    which: 'package',
                });
            } else {
                this.setState({
                    packageAndNumber: '',
                    package: '',
                    date: '',
                    number: '',
                    key: record.key,
                    which: 'package',
                });
            }*/
            const productList = Request.synPost('/product/list');
            let productArr = [];
            if(productList && productList.length > 0){
                for(let item of productList){
                    let obj = {
                        value: item.productId,
                        label: item.name
                    }
                    productArr.push(obj);
                }
            }
            this.setState({
                productArr,
                key: record.key,
                which: 'package',
            });
        }
    }

    handleChannelChange(e){
        e.preventDefault();
        this.setState({
            channel: e.target.value,
        });
    }

    handleNameChange(e){
        e.preventDefault();
        this.setState({
            name: e.target.value,
        });
    }

    handlePackageChange(value){
        this.setState({
            package: value,
        });
    }

    handleDateChange(date, dateString){
        this.setState({
            date: dateString,
        });
    }

    handleNumberChange(value){
        this.setState({
            number: value,
        });
    }

    handlePackageOK(){
        const pkg = this.state.package;
        const number = this.state.number;
        const price = this.state.price;
        const date = this.state.date;
        const saleDate = date.replace(/[^0-9]/g,'');
        console.log(pkg,date,number,price);
        if(!pkg){
            message.warning('请选择产品');
            return;
        }
        if(!date){
            message.warning('请选择销售日期');
            return;
        }
        if(!number){
            message.warning('请输入数量');
            return;
        }
        if(!price){
            message.warning('请输入价格');
            return;
        }
        const packageAndNumber = pkg + number + '份';
        /*const saleList = JSON.parse(window.localStorage.getItem('saleList'));
        for(let item of saleList){
            if(item.key === this.state.key){
                Object.assign(item,{packageAndNumber,package:pkg,date,number});
                break;
            }
        }
        window.localStorage.setItem('saleList',JSON.stringify(saleList));*/
        Request.synPost('/channel/addProduct',{
            num: number,
            price: price,
            channeId: this.state.key,
            productId: pkg,
            createUser: 1,
            saleDate: saleDate,
        });
        this.setState({
            packageAndNumber: '',
            package: '',
            date: '',
            number: '',
            key: 0,
            which: '',
            price: '',
        });
        this.search();
    }

    handlePackageCancel(){
        this.setState({
            packageAndNumber: '',
            package: '',
            date: '',
            number: '',
            key: 0,
            which: '',
            price: '',
        });
    }

    handleAddOK(){
        const channel = this.state.channel;
        const name = this.state.name;
        if(!channel){
            message.error('请输入渠道编号');
            return;
        } else if(!name){
            message.error('请输入渠道名称');
            return;
        } else {
            Request.synPost('/channel/add',{
                name: this.state.name,
                code: this.state.channel,
                userId: 1,
            });
            message.success('添加成功',1);
            this.search();
            this.setState({
                addVisible: false,
                channel: '',
                name: '',
            });
        }
    }

    handleAddCancel(){
        this.setState({
            addVisible: false,
            channel: '',
            name: '',
        });
    }

    handleModifyOK(){
        const channel = this.state.channel;
        const name = this.state.name;
        const channelId = this.state.key;
        if(!channel){
            message.warning('请输入渠道编号');
            return;
        } else if(!name){
            message.warning('请输入渠道名称');
            return;
        } else {
            Request.synPost('/channel/modify',{
                name,
                code: channel,
                modifyUser: 1,
                id: channelId,
            });
            this.search();
            this.setState({
                which: '',
                key: 0,
                name: '',
                channel: '',
            });
        }
    }

    handleModifyCancel(){
        this.setState({
            channel: '',
            name: '',
            key: 0,
            which: '',
        });
    }

    addConfirm(){
        const confirm = (
            <Form>
                <FormItem
                    {...formItemLayout}
                    label='渠道编号'
                    hasFeedback
                >
                    <Input
                        placeholder="请输入编号"
                        value={this.state.channel}
                        onChange={this.handleChannelChange.bind(this)}
                    />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="名称"
                    hasFeedback
                >
                    <Input
                        placeholder="请输入渠道名称"
                        value={this.state.name}
                        onChange={this.handleNameChange.bind(this)}
                    />
                </FormItem>
            </Form>
        );
        return confirm;
    }

    checkDate(){
        const date = this.state.date;
        if(date){
            return moment(date,"YYYYMMDD");
        } else {
            return null;
        }
    }

    packageConfirm(){
        const packageOptions = this.state.productArr.map((item)=><Option value={item.value}>{item.label}</Option>);
        const confirm = (
            <Form>
                <FormItem
                    {...formItemLayout}
                    label="产品"
                >
                    <Select
                        style={{ width: 120 }}
                        placeholder="请选择产品"
                        value={this.state.package}
                        onChange={this.handlePackageChange.bind(this)}
                    >
                        {packageOptions}
                    </Select>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="日期"
                >
                    <DatePicker
                        format="YYYY-MM-DD"
                        placeholder="销售日期"
                        value={this.checkDate.bind(this)()}
                        onChange={this.handleDateChange.bind(this)}
                    />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="数量"
                >
                    <InputNumber
                        min={0}
                        value={this.state.number}
                        style={{ width: '65%', marginRight: '3%' }}
                        onChange={this.handleNumberChange.bind(this)}
                    />份
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="价格"
                >
                    <InputNumber
                        min={0}
                        value={this.state.price}
                        style={{ width: '65%', marginRight: '3%' }}
                        onChange={(value)=>{this.setState({price:value})}}
                    />元
                </FormItem>
            </Form>
        );
        return confirm;
    }

    render(){
        return (
            <div className="antd-layout-OrderList">
                <div className="clearfix">
                    <Popconfirm
                        placement="bottomRight"
                        onConfirm={this.handleAddOK.bind(this)}
                        onCancel={this.handleAddCancel.bind(this)}
                        title={this.addConfirm.bind(this)()}
                        okText="确定"
                        cancelText="取消"
                        visible={this.state.addVisible}
                    >
                        <Button type="primary" onClick={()=>{this.setState({addVisible:true})}}>添加</Button>
                    </Popconfirm>
                </div>
                <Table
                    columns={this.state.columns}
                    dataSource={this.state.channels}
                    pagination={false}
                    scroll={{y: 700}}
                />
            </div>
        );
    }
}

export default PackageSale;