import React from 'react';
import {Button, Form, Popconfirm, Tag, Cascader, InputNumber, message, Modal} from 'antd';
import Request from './util/Request';
const FormItem = Form.Item;

const popTypes = [{
    value: '类型一',
    label: '类型一',
},{
    value: '类型二',
    label: '类型二',
}];
const popBrands = [{
    value: '类型一',
    label: '类型一',
},{
    value: '类型二',
    label: '类型二',
}];
const popNames = [{
    value: '类型一',
    label: '类型一',
},{
    value: '类型二',
    label: '类型二',
}];
const popStandards = [{
    value: '类型一',
    label: '类型一',
},{
    value: '类型二',
    label: '类型二',
}];

class BillInfo extends React.Component {
    state = {
        tags: ['hello', 'world', 'hello world'],
        popVisible: false,
        popType: [],
        popBrand: [],
        popName: [],
        popStandard: [],
        popAmount: '',
        popPrice: '',
        backVisible: false,
        recoverVisible: false,
        dataObj: {},
        serviceArr: []
    }

    componentDidMount() {
        const detailId = this.props.detailId;
        const dataObj = Request.synPost('/workOrder/getDetailByWorkOrderId',{id:detailId});
        const channelProduct = dataObj.channelProduct;
        let serviceArr = [];
        if(channelProduct){
            const productObj = Request.synPost('/product/detailByChannelProduct',{channelProduct});
            const array = productObj.servicePartDtos;
            for(let item of array){
                let str = '';
                str += item.serviceName + '(';
                for(let part of item.partDtos){
                    str += part.partCateName + part.partBrandName + part.partName + part.num+part.unit+' ';
                }
                str += ')';
                serviceArr.push(str);
            }
        }
        this.setState({
            dataObj,
            serviceArr
        });
    }

    componentWillReceiveProps() {
        const detailId = this.props.detailId;
        const dataObj = Request.synPost('/workOrder/getDetailByWorkOrderId',{id:detailId});
        this.setState({dataObj});
    }

    //技师销售pop确定按钮的逻辑
    handlePopOK(e) {
        e.preventDefault();
        const { popType, popBrand, popName, popStandard, popAmount, popPrice, tags } = this.state;
        if(popType.length===0){
           message.warning('请选择类型');
            return;
        }
        if(popBrand.length===0){
            message.warning('请选择品牌');
            return;
        }
        if(popName.length===0){
            message.warning('请选择名称');
            return;
        }
        if(popStandard.length===0){
            message.warning('请选择规格');
            return;
        }
        if(!popAmount){
            message.warning('请输入数量');
            return;
        }
        if(!popPrice){
            message.warning('请输入价格');
            return;
        }

        const tag = `${popType[0]} ${popBrand[0]} ${popName[0]} ${popStandard[0]} ${popAmount}*${popPrice}元`;
        tags.push(tag);
        this.setState({
            tags,
            popVisible: false,
            popType: [],
            popBrand: [],
            popName: [],
            popStandard: [],
            popAmount: '',
            popPrice: '',
        });
    }

    //技师销售pop取消按钮的逻辑
    handlePopCancel(e) {
        e.preventDefault();
        this.setState({
            popVisible: false,
            popType: [],
            popBrand: [],
            popName: [],
            popStandard: [],
            popAmount: '',
            popPrice: '',
        });
    }

    dateFormate(dateStr){
        let dateFormate = '';
        dateFormate += dateStr.substr(0,4)+'-'+dateStr.substr(4,2)+'-'+dateStr.substr(6,2);
        dateFormate += ' '+dateStr.substr(8,2)+':'+dateStr.substr(10,2)+':'+dateStr.substr(12,2);
        return dateFormate;
    }

    render() {
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        }
        const confirmDOM = (
            <Form>
                <FormItem
                    label="类型"
                    {...formItemLayout}
                >
                    <Cascader
                        options={popTypes}
                        placeholder=''
                        value={this.state.popType}
                        onChange={(value)=>{this.setState({popType:value})}}
                    />
                </FormItem>
                <FormItem
                    label="品牌"
                    {...formItemLayout}
                >
                    <Cascader
                        options={popBrands}
                        placeholder=''
                        value={this.state.popBrand}
                        onChange={(value)=>{this.setState({popBrand:value})}}
                    />
                </FormItem>
                <FormItem
                    label="名称"
                    {...formItemLayout}
                >
                    <Cascader
                        options={popNames}
                        placeholder=''
                        value={this.state.popName}
                        onChange={(value)=>{this.setState({popName:value})}}
                    />
                </FormItem>
                <FormItem
                    label="规格"
                    {...formItemLayout}
                >
                    <Cascader
                        options={popStandards}
                        placeholder=''
                        value={this.state.popStandard}
                        onChange={(value)=>{this.setState({popStandard:value})}}
                    />
                </FormItem>
                <FormItem
                    label="数量"
                    {...formItemLayout}
                >
                    <InputNumber
                        min={0}
                        value={this.state.popAmount}
                        onChange={(value)=>{this.setState({popAmount:value})}}
                    />个
                </FormItem>
                <FormItem
                    label="价格"
                    {...formItemLayout}
                >
                    <InputNumber
                        min={0}
                        value={this.state.popPrice}
                        onChange={(value)=>{this.setState({popPrice:value})}}
                    />元
                </FormItem>
            </Form>
        );
        const createDate = this.state.dataObj.createDate;
        let createDateFormate = '';
        if(createDate){
            createDateFormate = this.dateFormate(createDate);
        }
        const serviceDate = this.state.dataObj.serviceDate;
        let serviceDateFormate = '';
        if(serviceDate){
            serviceDateFormate = this.dateFormate(serviceDate);
        }

        return (
            <Form className="BillInfo">
                <FormItem
                    label="服务技师"
                    {...formItemLayout}
                >
                    <span>{this.state.dataObj.serviceUserName}</span>
                </FormItem>
                <FormItem
                    label="工单创建日期"
                    {...formItemLayout}
                >
                    <span>{createDateFormate}</span>
                </FormItem>
                <FormItem
                    label="服务时间"
                    {...formItemLayout}
                >
                    <span>{serviceDateFormate}</span>
                </FormItem>
                <FormItem
                    label="服务地址"
                    {...formItemLayout}
                >
                    <span>{this.state.dataObj.address}</span>
                </FormItem>
                <FormItem
                    label="车牌"
                    {...formItemLayout}
                >
                    <span>{this.state.dataObj.plate}</span>
                </FormItem>
                <FormItem
                    label="车型"
                    {...formItemLayout}
                >
                    <span>{this.state.dataObj.modalDes}</span>
                </FormItem>
                <FormItem
                    label="发卡渠道"
                    {...formItemLayout}
                >
                    <span>{this.state.dataObj.channelName}</span>
                </FormItem>
                <FormItem
                    label="服务产品"
                    {...formItemLayout}
                >
                    <span>{this.state.dataObj.productName}</span>
                </FormItem>
                <FormItem
                    label="服务内容"
                    {...formItemLayout}
                >
                    {this.state.serviceArr.map((item)=>{
                        return (
                            <div>
                                <span>{item}</span><br/>
                            </div>
                        );
                    })}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='技师销售'
                >
                    <div>
                        {this.state.tags.map((tag) => {
                            const tagElem = (
                                <Tag key={tag} closable={true} afterClose={() => this.handleTagClose(tag)}>
                                    {tag}
                                </Tag>
                            );
                            return tagElem;
                        })}
                        <Popconfirm
                            placement="rightTop"
                            onConfirm={this.handlePopOK.bind(this)}
                            onCancel={this.handlePopCancel.bind(this)}
                            title={confirmDOM}
                            okText="确定"
                            cancelText="取消"
                            visible={this.state.popVisible}
                        >
                            <Button type="primary" size="small"
                                    onClick={()=>this.setState({popVisible: true})}>+</Button>
                        </Popconfirm>
                    </div>
                </FormItem>
                <FormItem
                    label="技师销售合计"
                    {...formItemLayout}
                >
                    <span>300</span>元
                </FormItem>
                <FormItem>
                    <Modal
                        title="确定返回"
                        width={300}
                        visible={this.state.backVisible}
                        okText='确定'
                        cancelText='取消'
                        onOk={()=>{this.props.changeShowDetailToFalse()}}
                        onCancel={()=>{this.setState({backVisible:false})}}
                    >
                    </Modal>
                    <Modal
                        title="确定收单"
                        width={300}
                        visible={this.state.recoverVisible}
                        okText="确定"
                        cancelText="取消"
                        onOk={()=>{this.setState({recoverVisible:false})}}
                        onCancel={()=>{this.setState({recoverVisible:false})}}
                    >
                    </Modal>
                    <Button type="primary" onClick={()=>{this.setState({recoverVisible:true})}}>收单</Button>
                    <Button type="primary" onClick={()=>{this.setState({backVisible:true})}}>返回</Button>
                </FormItem>
            </Form>
        );
    }
}

export default BillInfo;