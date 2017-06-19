import {Table, Button, Modal, Form} from "antd";
import React from "react";
import Request from './util/Request';
const FormItem = Form.Item;

/*const packageList = [
    {
        packageName: '保养套餐1',
        packagePrice: '666',
        packageItem: '发动机清洗',
        packagePart: '东风机滤一个',
    },{
        packageName: '保养套餐1',
        packagePrice: '666',
        packageItem: '发动机清洗',
        packagePart: '东风机滤一个',
    },
];*/

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
            dataIndex: 'packagePart',
            key: 'packagePart',
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

    componentDidMount() {
        const productList = Request.synPost('/product/list');
        const frontArray = this.backToFront(productList);
        this.setState({
            packageList: frontArray
        });
    }

    backToFront(backArray){
        let frontArray = [];
        for(let item of backArray){
            let obj = {
                key: item.productId,
                packageName: item.name,
                packagePrice: item.price,
                packageItem: '',
                packagePart: '',
            }
            if(item.services && item.services.length > 0){
                for(let service of item.services){
                    obj.packageItem += service.serviceCate + service.serviceName + service.num + '次 ';
                    if(service.partDtos && service.partDtos.length > 0){
                        obj.packagePart += service.serviceCate + '(';
                        for(let part of service.partDtos){
                            obj.packagePart += part.partCateName + part.partBrandName + part.partName + part.standard + part.num + part.unit + ' ';
                        }
                        obj.packagePart += ')';
                    }
                }
            }
            frontArray.push(obj);
        }
        return frontArray;
    }

    showDetail(record) {
        const productInfo = Request.synPost('/product/findDetailByProductId',{productId:record.key});
        let serviceArray = [];
        if(productInfo.services && productInfo.services.length > 0){
            for(let serviceItem of productInfo.services){
                let serviceStr = ``;
                serviceStr += `${serviceItem.serviceCate} ${serviceItem.serviceName} ${serviceItem.servicePrice}元`;
                if(serviceItem.partDtos && serviceItem.partDtos.length > 0){
                    serviceStr += `(`;
                    for(let part of serviceItem.partDtos){
                        serviceStr += `${part.partCateName}${part.partBrandName}${part.partName}`;
                        serviceStr += `${part.standard}${part.num}${part.unit} `;
                    }
                    serviceStr += `)`;
                }
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
                    <span>{this.state.productInfo.name}</span>
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
                    <span>{this.state.productInfo.price}</span>
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
                    dataSource={this.state.packageList}
                    pagination={false}
                    scroll={{y: 700}}
                />
            </div>
        );
    }
}

export default PackageList;
