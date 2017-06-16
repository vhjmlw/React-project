import {Table, Button, Modal, Form} from "antd";
import React from "react";
import Request from './util/Request';
const FormItem = Form.Item;

const packageList = [
    {
        packageName: '保养套餐1',
        packagePrice: '666',
        packageItem: '发动机清洗',
        packageAccessory: '东风机滤一个',
    },{
        packageName: '保养套餐1',
        packagePrice: '666',
        packageItem: '发动机清洗',
        packageAccessory: '东风机滤一个',
    },
];

class PackageList extends React.Component{
    state = {
        columns: [{
            title: '名称',
            dataIndex: 'packageName',
            key: 'packageName',
            width: '20%',
        }, {
            title: '价格',
            dataIndex: 'packagePrice',
            key: 'packagePrice',
            width: '20%',
        }, {
            title: '服务项目',
            dataIndex: 'packageItem',
            key: 'packageItem',
            width: '20%',
        }, {
            title: '配件',
            dataIndex: 'packageAccessory',
            key: 'packageAccessory',
            width: '20%',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => {
                return (<span>
                    <a onClick={()=>{this.showDetail(record)}}>查看</a>
                </span>)
            },
        }],
        modalVisible: false,
        productInfo: {},
        serviceArray: []
    };

    /*handleModify(record) {
        return function () {
            record.packageItem = record.packageItem.split(" - ");
            record.packageAccessory = record.packageAccessory.split(" - ");
            window.localStorage.setItem('modifyPackage',JSON.stringify(record));
            this.props.history.pushState(null,"/App/ModifyPackage");
        }
    }*/

    showDetail(record) {
        const productInfo = Request.synPost('/product/detailByChannelProduct',{channelProduct:record.key});
        let serviceArray = [];
        if(productInfo.servicePartDtos && productInfo.servicePartDtos.length > 0){
            for(let service of productInfo.servicePartDtos){
                let serviceStr = ``;
                serviceStr += `${service.serviceCate} ${service.serviceName} ${service.servicePrice} (`;
                if(service.partDtos && service.partDtos.length > 0){
                    for(let part of service.partDtos){
                        serviceStr += `${part.partCateName}${part.partBrandName}${part.partName}`;
                        serviceStr += `${part.standard}${part.num}${part.unit} `;
                    }
                }
                serviceStr += `)`;
                serviceArray.push(serviceStr);
            }
        }

        this.setState({
            productInfo,
            modalVisible: true,
            serviceArray,
        });
    }

    //点击新增按钮的执行逻辑，<Button><Link to='App/PackageInfo'>新增</Link></Button>会有浏览器兼容性问题
    //火狐 IE浏览器下点击新增无效，页面无法跳转，所以使用onClick点击事件的方式
    handleClick (event) {
        event.preventDefault();
        // browserHistory.push("/App/MyForm");
        this.props.history.pushState(null, "/App/PackageInfo");//API已经过时了，但是暂时想不出其他的解决办法
    }

    render(){
        /*console.log(JSON.parse(window.localStorage.getItem("packageList")));
        let packageList = JSON.parse(window.localStorage.getItem('packageList'));
        if(packageList){
            packageList = packageList.map((item)=>{
                item.packageItem = item.packageItem.join(" - ");
                item.packageAccessory = item.packageAccessory.join(" - ");
                return item;
            });
        }*/
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        }
        const modalHTML = (
            <Form>
                <FormItem
                    label="名称"
                    {...formItemLayout}
                >
                    <span>{this.state.productInfo.channelName}</span>
                </FormItem>
                <FormItem
                    label="代码"
                    {...formItemLayout}
                >
                    <span>{this.state.productInfo.code}</span>
                </FormItem>
                <FormItem
                    label="价格"
                    {...formItemLayout}
                >
                    <span>{this.state.productInfo.channelPrice}</span>
                </FormItem>
                <FormItem
                    label="服务"
                    {...formItemLayout}
                >
                    {this.state.serviceArray.map((service)=>{
                        return (
                            <h4>{service}</h4>
                        );
                    })}
                </FormItem>
            </Form>
        );

        return (
            <div className="antd-layout-OrderList">
                <Modal
                    title={modalHTML}
                    width={350}
                    visible={this.state.modalVisible}
                    okText="确定"
                    footer={[<Button type="primary" onClick={()=>{this.setState({modalVisible:false})}}>确定</Button>]}
                    onOk={()=>{alert('ok')}}
                    onCancel={()=>{this.setState({modalVisible:false})}}
                />
                <div className="clearfix">
                    <Button type="primary" onClick={this.handleClick.bind(this)}>添加</Button>
                </div>
                <Table
                    columns={this.state.columns}
                    dataSource={packageList}
                    pagination={false}
                    scroll={{y: 700}}
                />
            </div>
        );
    }
}

export default PackageList;
