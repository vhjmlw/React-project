import { Table, Button, Popconfirm, Form, message, Input, Select, DatePicker } from 'antd';
import React from 'react';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
}
const packageData = ['套餐一','套餐二','套餐三','套餐四','套餐五'];

class PackageSale extends React.Component {
    state = {
        columns: [{
            title: '姓名',
            dataIndex: 'channel',
            key: 'channel',
        }, {
            title: '年龄',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '保养套餐',
            dataIndex: 'packageAndNumber',
            key: 'packageAndNumber',
        }, {
            title: '操作',
            key: 'Action',
            render: (text, record) => (
                <span>
                    <Popconfirm
                        placement="bottomLeft"
                        onConfirm={this.handleModifyOK.bind(this)}
                        onCancel={this.handleModifyCancel.bind(this)}
                        title={this.addConfirm.bind(this)()}
                        okText="确定"
                        cancelText="取消"
                        visible={this.state.modifyVisible}
                    >
                        <a onClick={this.handleModifyClick(record)}>修改</a>&nbsp;&nbsp;
                    </Popconfirm>
                    <Popconfirm
                        placement="bottomRight"
                        onConfirm={this.handlePackageOK.bind(this)}
                        onCancel={this.handlePackageCancel.bind(this)}
                        title={this.packageConfirm.bind(this)()}
                        okText="确定"
                        cancelText="取消"
                        visible={this.state.packageVisible}
                    >
                        <a onClick={this.handlePackageClick(record)}>保养套餐销售</a>
                    </Popconfirm>
                </span>
            ),
        }],
        addVisible: false,
        modifyVisible: false,
        packageVisible: false,
        channel: '',
        name: '',
        key: 0,
        packageAndNumber: '',
        package: '',
        date: '',
        number: '',
    }

    handleModifyClick(record){
        return ()=>{
            this.setState({
                modifyVisible:true,
                channel:record.channel,
                name:record.name,
                key:record.key
            })
        }
    }

    handlePackageClick(record){
        return ()=>{
                if(record.packageAndNumber){
                    this.setState({
                        packageVisible: true,
                        packageAndNumber: record.packageAndNumber,
                        package: record.package,
                        date: record.date,
                        number: record.number,
                        key: record.key,
                    });
                } else {
                    this.setState({
                        packageVisible: true,
                        packageAndNumber: '',
                        package: '',
                        date: '',
                        number: '',
                        key: record.key,
                    });
                }
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

    handleNumberChange(e){
        e.preventDefault();
        this.setState({
            number: e.target.value,
        });
    }

    handlePackageOK(){
        const pkg = this.state.package;
        const date = this.state.date;
        const number = Number(this.state.number);
        console.log(pkg,date,number);
        if(!pkg){
            message.error('请选择套餐');
            return;
        }
        if(!date){
            message.error('请选择销售日期');
            return;
        }
        if(!number){
            message.error('请输入数量');
            return;
        }
        const packageAndNumber = pkg + number + '份';
        const saleList = JSON.parse(window.localStorage.getItem('saleList'));
        for(let item of saleList){
            if(item.key === this.state.key){
                Object.assign(item,{packageAndNumber,package:pkg,date,number});
                break;
            }
        }
        window.localStorage.setItem('saleList',JSON.stringify(saleList));
        this.setState({
            packageVisible: false,
            packageAndNumber: '',
            package: '',
            date: '',
            number: '',
            key: 0,
        });
    }

    handlePackageCancel(){
        this.setState({
            packageVisible: false,
            packageAndNumber: '',
            package: '',
            date: '',
            number: '',
            key: 0,
        });
    }

    handleAddOK(){
        const channel = this.state.channel;
        const name = this.state.name;
        if(!channel){
            message.error('请输入渠道编号');
            return;
        } else if(!name){
            message.error('请输入姓名');
            return;
        } else {
            const packageSale = {
                channel,
                name,
                key: new Date().getTime(),
            };
            let saleList = window.localStorage.getItem('saleList');
            if(!saleList){
                saleList = [];
            } else {
                saleList = JSON.parse(saleList);
            }
            saleList.push(packageSale);
            window.localStorage.setItem('saleList',JSON.stringify(saleList));
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
        if(!channel){
            message.error('请输入渠道编号');
            return;
        } else if(!name){
            message.error('请输入姓名');
            return;
        } else {
            let saleList = JSON.parse(window.localStorage.getItem('saleList'));
            saleList = saleList.map((item)=>{
                if(item.key === this.state.key){
                    Object.assign(item,{channel,name});
                }
                return item;
            });
            window.localStorage.setItem('saleList',JSON.stringify(saleList));
            this.setState({
                modifyVisible: false,
                channel: '',
                name: '',
                key: 0,
            });
        }
    }

    handleModifyCancel(){
        this.setState({
            modifyVisible: false,
            channel: '',
            name: '',
            key: 0,
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
                        placeholder="请输入姓名"
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
        const packageOptions = packageData.map((item)=><Option value={item}>{item}</Option>);
        const confirm = (
            <Form>
                <FormItem
                    {...formItemLayout}
                    label="套餐"
                >
                    <Select
                        style={{ width: 120 }}
                        placeholder="请选择套餐"
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
                    <Input
                        placeholder="请输入数量"
                        type="number"
                        value={this.state.number}
                        style={{ width: '65%', marginRight: '3%' }}
                        onChange={this.handleNumberChange.bind(this)}
                    />份
                </FormItem>
            </Form>
        );
        return confirm;
    }

    render(){
        const saleList = JSON.parse(window.localStorage.getItem('saleList'));

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
                        <Button type="primary" onClick={()=>this.setState({addVisible:true})}>添加</Button>
                    </Popconfirm>
                </div>
                <Table columns={this.state.columns} dataSource={saleList}/>
            </div>
        );
    }
}

export default PackageSale;