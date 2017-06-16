import React from 'react';
import {Button, Form, Popconfirm, Tag, Cascader, InputNumber, message, Modal} from 'antd';
import Request from './util/Request';
const FormItem = Form.Item;

/*const popTypes = [{
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
}];*/

class BillInfo extends React.Component {
    state = {
        tags: [],
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
        serviceArr: [],
        unit: '',
        key: '',
        popBrands: [],
        popTypes: [],
        popStandards: [],
        popNames: [],
        nameDisabled: true,
        otherDisabled: true,
        standardAndUnit: {},
        totalPrice: 0,
    }

    componentDidMount() {
        const detailId = this.props.detailId;
        const dataObj = Request.synPost('/workOrder/getDetailByWorkOrderId',{id:detailId});
        const channelProduct = dataObj.channelProduct;
        let serviceArr = [];
        if(channelProduct){
            const productObj = Request.synPost('/product/detailByChannelProduct',{channelProduct});
            if(productObj){
                const array = productObj.servicePartDtos;
                if(array && array.length>0){
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
        let { popTypes, popBrands, popType, popBrand, popName, popStandard, popAmount, popPrice, tags, unit, totalPrice } = this.state;
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
        let type;
        for(let item of popTypes){
            if(item.value===popType[0]){
                type = item.label;
                break;
            }
        }
        let brand;
        for(let item of popBrands){
            if(item.value===popBrand[0]){
                brand = item.label;
                break;
            }
        }
        let standard;
        for(let item of this.state.popStandards){
            if(item.value === popStandard[0]){
                standard = item.label;
                break;
            }
        }
        
        const partId = this.state.popStandard[0];
        const serverId = this.state.dataObj.serviceUser;
        const amount = this.state.popAmount;
        const detailId = this.props.detailId;
        const price = this.state.popPrice;
        Request.synPost('/technician/saleLog',{
            partId,
            technicianId: serverId,
            num: amount,
            orderId: detailId,
            salePrice: price,
            createUser: 1,
        });
        
        const tag = `${type} ${brand} ${popName[0]} ${standard} ${popAmount}${unit} 共${popPrice}元`;
        //以下代码控制不能添加相同的两项
        if(this.state.tags.indexOf(tag)>-1){
            message.warning('不能添加相同的两项');
            return;
        }
        tags.push(tag);
        totalPrice += popPrice;//计算出技师销售总价，在总价的基础之上再加上当前输入的价格popPrice
        this.setState({
            tags,
            popVisible: false,
            popType: [],
            popBrand: [],
            popName: [],
            popStandard: [],
            popAmount: '',
            popPrice: '',
            unit: '',
            nameDisabled: true,
            otherDisabled: true,
            totalPrice,
            standardAndUnit:{}
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
            unit: '',
            nameDisabled: true,
            otherDisabled: true,
            standardAndUnit:{}
        });
    }

    dateFormate(dateStr){
        let dateFormate = '';
        dateFormate += dateStr.substr(0,4)+'-'+dateStr.substr(4,2)+'-'+dateStr.substr(6,2);
        dateFormate += ' '+dateStr.substr(8,2)+':'+dateStr.substr(10,2)+':'+dateStr.substr(12,2);
        return dateFormate;
    }

/*    handleTagClose(removedTag){
        console.log(removedTag);
        const tags = this.state.tags.filter((tag)=>{
            return tag != removedTag;
        });
        this.setState({tags});
    }*/

    //点击tag气泡确定按钮，删除当前tag的逻辑
    handleTagPopOk(){
        const tags = this.state.tags.filter((tag)=>{
            return tag != this.state.key;
        });
        let totalPrice = this.state.totalPrice;
        const tag = this.state.key;
        const regexp = /.+共(\d+)元/;
        const priceArray = tag.match(regexp);
        const price = Number(priceArray[1]);
        totalPrice -= price;
        this.setState({
            tags,
            key: '',
            totalPrice
        });
    }

    //+号点击的逻辑
    handlePlusClick(){
        const brandArray = Request.synPost('/part/listPartBrand');
        let popBrands = [];
        for(let item of brandArray){
            let obj = {
                value: item.id,
                label: item.name
            }
            popBrands.push(obj);
        }
        const typeArray = Request.synPost('/part/listPartCate');
        let popTypes = [];
        for(let item of typeArray){
            let obj = {
                value: item.id,
                label: item.name
            }
            popTypes.push(obj);
        }
        this.setState({
            popVisible: true,
            popBrands,
            popTypes
        });
    }

    //pop页面类型改变的逻辑
    handleTypeChange(value){
        const typeObj = Request.synPost('/part/listParts',{
            brandId: this.state.popBrand[0],
            cateId: value[0],
        });
        const typeData = typeObj.data;
        const nameArray = [];
        for(let item of typeData){
            let obj = {
                value: item.partName,
                label: item.partName
            }
            nameArray.push(obj);
        }
        if(nameArray.length>0){
            this.setState({
                popType:value,
                popNames:nameArray,
                nameDisabled:false
            });
        } else {
            this.setState({
                popType:value,
                popName:[],
                nameDisabled:true,
                popStandard:[],
                unit: '',
                otherDisabled:true,
                popAmount: '',
                popPrice: '',
            });
        }

    }

    //pop页面品牌改变的逻辑
    handleBrandChange(value){
        const brandObj = Request.synPost('/part/listParts',{
            brandId: value[0],
            cateId: this.state.popType[0],
        });
        const brandData = brandObj.data;
        const nameArray = [];
        for(let item of brandData){
            let obj = {
                value: item.partName,
                label: item.partName,
            }
            nameArray.push(obj);
        }
        if(nameArray.length>0){
            this.setState({
                popBrand:value,
                popNames:nameArray,
                nameDisabled:false,
            });
        } else {
            this.setState({
                popBrand:value,
                popName: [],
                nameDisabled:true,
                popStandard:[],
                unit: '',
                otherDisabled:true,
                popAmount: '',
                popPrice: '',
            });
        }

    }

    //pop页面名称改变的逻辑
    handleNameChange(value){
        const fittingObj = Request.synPost('/part/listParts',{
            brandId: this.state.popBrand[0],
            cateId: this.state.popType[0],
            name: value[0],
        });
        const fittingData = fittingObj.data;
        const standardArray = [];
        const standardAndUnit = {};//key为配件规格，value为配件单位，选择规格之后匹配到配件的单位
        for(let item of fittingData){
            if(item.standard){//如果该条数据standard字段不为空
                let obj = {
                    value: item.id,//value暂时先不用规格名字，可能需要使用 配件Id
                    label: item.standard,
                }
                standardArray.push(obj);
            }
            standardAndUnit[item.id] = item.unit;
        }
        if(standardArray.length>0){
            this.setState({
                popName:value,
                popStandards:standardArray,
                otherDisabled:false,
                standardAndUnit,
            });
        } else {
            this.setState({
                popName:value,
                otherDisabled:true,
                popStandard: [],
                popAmount: '',
                popPrice: '',
                unit: '',
            });
        }
        
    }
    
    //pop页面规格改变的逻辑
    handleStandardChange(value){
        const standardAndUnit = this.state.standardAndUnit;
        const unit = standardAndUnit[value[0]];
        this.setState({
            popStandard:value,
            unit
        });
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
                        options={this.state.popTypes}
                        placeholder=''
                        value={this.state.popType}
                        onChange={this.handleTypeChange.bind(this)}
                    />
                </FormItem>
                <FormItem
                    label="品牌"
                    {...formItemLayout}
                >
                    <Cascader
                        options={this.state.popBrands}
                        placeholder=''
                        value={this.state.popBrand}
                        onChange={this.handleBrandChange.bind(this)}
                    />
                </FormItem>
                <FormItem
                    label="名称"
                    {...formItemLayout}
                >
                    <Cascader
                        disabled={this.state.nameDisabled}
                        options={this.state.popNames}
                        placeholder=''
                        value={this.state.popName}
                        onChange={this.handleNameChange.bind(this)}
                    />
                </FormItem>
                <FormItem
                    label="规格"
                    {...formItemLayout}
                >
                    <Cascader
                        disabled={this.state.otherDisabled}
                        options={this.state.popStandards}
                        placeholder=''
                        value={this.state.popStandard}
                        onChange={this.handleStandardChange.bind(this)}
                    />
                </FormItem>
                <FormItem
                    label="数量"
                    {...formItemLayout}
                >
                    <InputNumber
                        min={0}
                        disabled={this.state.otherDisabled}
                        value={this.state.popAmount}
                        onChange={(value)=>{this.setState({popAmount:value})}}
                    /><span>{this.state.unit}</span>
                </FormItem>
                <FormItem
                    label="价格"
                    {...formItemLayout}
                >
                    <InputNumber
                        min={0}
                        disabled={this.state.otherDisabled}
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
                                <Popconfirm
                                    title={<h3>确定删除 ?</h3>}
                                    okText="确定"
                                    cancelText="取消"
                                    placement="right"
                                    visible={this.state.key===tag}
                                    onConfirm={this.handleTagPopOk.bind(this)}
                                    onCancel={()=>{this.setState({key:''})}}
                                >
                                    <Tag
                                        key={tag}
                                        closable={true}
                                        onClose={(e)=>{
                                            e.preventDefault();
                                            this.setState({key:tag});
                                        }}
                                        /*afterClose={() => this.handleTagClose(tag)}*/
                                    >
                                        {tag}
                                    </Tag>
                                </Popconfirm>

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
                                    onClick={this.handlePlusClick.bind(this)}>+</Button>
                        </Popconfirm>
                    </div>
                </FormItem>
                <FormItem
                    label="技师销售合计"
                    {...formItemLayout}
                >
                    <span>{this.state.totalPrice}</span>元
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