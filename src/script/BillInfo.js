import React from 'react';
import {Button, Form, Popconfirm, Tag, Cascader, InputNumber, message, Modal, Row, Col} from 'antd';
import Request from './util/Request';
import $ from 'jquery';
import CookieUtil from './util/CookieUtil';
const FormItem = Form.Item;

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
        saleLog: {},
        upgradeVisible: false,
        partModal: [],
        brandValue: [],
        partOptionsDis: true,
        partOptions: [],
        partValue: [],
        standardOptionsDis: true,
        standardOptions: [],
        standardValue: [],
        upgradeParts: [],
        upgradeTags: [],
        currentTag: '',
        diffPartPrice: 0,
        brandOptionsArr: []
    }

    componentDidMount() {
        const detailId = this.props.detailId;
        const dataObj = Request.synPost('/workOrder/getDetailByWorkOrderId',{id:detailId});
        const channelProduct = dataObj.channelProduct;
        let serviceArr = [];
        let partModal = [];
        if(channelProduct){
            const productObj = Request.synPost('/product/detailByChannelProduct',{channelProduct});
            if(productObj){
                const array = productObj.servicePartDtos;
                if(array && array.length>0){
                    for(let item of array){
                        let str = '';
                        str += item.serviceCate + ' ' + item.serviceName;
                        let flag = true;
                        if(item.partDtos && item.partDtos.length > 0){
                            str += '(';
                            for(let part of item.partDtos){
                                let partStr = '';
                                partStr += part.partCateName + part.partBrandName + part.partName + part.standard + part.num+part.unit;
                                str += partStr + ' ';
                                //partModal数组去重
                                for(let partObj of partModal){
                                    if(partObj.partId === part.partId){
                                        flag = false;
                                    }
                                }
                                if(flag){
                                    partModal.push({partStr:partStr,partCate:part.partCateName,partId:part.partId,partNum:part.num});
                                }
                            }
                            str += ')';
                        }
                        serviceArr.push(str);
                    }
                }

            }
        }
        const parts = Request.synPost('/technician/getSaleDetailByOrderId',{
            id: detailId
        });
        let partArr = [];
        let saleLog = {};
        for(let item of parts){
            let partStr = ``;
            partStr += `${item.partCateName} ${item.partBrandName} ${item.partName} ${item.standard} ${item.num}${item.unit} 共${item.salePrice}元`;
            partArr.push(partStr);
            saleLog[item.saleLogId] = partStr;
        }
        let totalPrice = this.state.totalPrice;
        const regexp = /.+共(\d+)元/;
        for(let item of partArr){
            const priceArray = item.match(regexp);
            const price = Number(priceArray[1]);
            totalPrice += price;
        }
        console.log(partArr);

        const brandArray = Request.synPost('/part/listPartBrand');
        let popBrands = [];
        if(brandArray && brandArray.length > 0){
            for(let item of brandArray){
                let obj = {
                    value: item.id,
                    label: item.name
                }
                popBrands.push(obj);
            }
        }
        const typeArray = Request.synPost('/part/listPartCate');
        let popTypes = [];
        if(typeArray && typeArray.length > 0){
            for(let item of typeArray){
                let obj = {
                    value: item.id,
                    label: item.name
                }
                popTypes.push(obj);
            }
        }

        const upgradePartArr = Request.synPost('upgradPart/listByWorkOrderId',{orderId:this.props.detailId});
        let upgradeTags = [];
        if(upgradePartArr && upgradePartArr.length > 0){
            for(let item of upgradePartArr){
                let num;
                for(let oldPart of partModal){
                    if(oldPart.partId == item.oldPartId){
                        num = oldPart.partNum;
                        break;
                    }
                }
                let desc = ``;
                desc += `${item.nowPartCateName} ${item.nowPartBrandName} ${item.nowPartName}`;
                desc += ` ${item.nowPartStandard} ${num}${item.nowPartUnit}`;
                let obj = {
                    id: item.id,
                    diffPrice: item.diffPrice,
                    desc,
                }
                upgradeTags.push(obj);
            }
        }
        let diffPartPrice = 0;
        if(upgradeTags.length > 0){
            for(let item of upgradeTags){
                diffPartPrice += Number(item.diffPrice);
            }
        }

        //part=={partStr:partStr,partCate:part.partCateName,partId:part.partId,partNum:part.num}
        const brandOptionsArr = partModal.map((part,index)=>{
            let cateId;
            for(let item of popTypes){
                if(item.label === part.partCate){
                    cateId = item.value;
                }
            }
            const brandData = Request.synPost('part/listParts',{cateId:cateId});
            const brands = brandData.data;
            let brandOptions = [];
            if(brands && brands.length > 0){
                for(let item of brands){
                    let flag = true;
                    let obj = {
                        value: '',
                        label: item.brandName,
                    }
                    for(let popBrand of popBrands){
                        if(popBrand.label === item.brandName){
                            obj.value = popBrand.value;
                        }
                    }
                    //brandOptions数组去重
                    for(let option of brandOptions){
                        if(option.value === obj.value){
                            flag = false;
                        }
                    }
                    if(flag){
                        brandOptions.push(obj);
                    }
                }
            }
            console.log(brandOptions);
            let obj = {
                brandOptions,
                part
            }
            return obj;
        })

        this.setState({
            dataObj,
            serviceArr,
            tags: partArr,
            totalPrice,
            saleLog,
            popBrands,
            popTypes,
            partModal,
            upgradeTags,
            diffPartPrice,
            brandOptionsArr
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
        let { popTypes, popBrands, popType, popBrand, popName, popStandard, popAmount, popPrice, tags, unit } = this.state;
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
        
        const tag = `${type} ${brand} ${popName[0]} ${standard} ${popAmount}${unit} 共${popPrice}元`;
        //以下代码控制不能添加相同的两项
        if(this.state.tags.indexOf(tag)>-1){
            message.warning('不能添加相同的两项');
            return;
        }
        //技师销售添加成功之后，重新发送请求，请求所有的技师销售，代码更改立此flag
        Request.synPost('/technician/saleLog',{
            partId,
            technicianId: serverId,
            num: amount,
            orderId: detailId,
            salePrice: price,
            createUser: CookieUtil.getCookie('id'),//获取技师主管的ID
        });
        const parts = Request.synPost('/technician/getSaleDetailByOrderId',{
            id: detailId
        });
        let partArr = [];
        let saleLog = {};
        let totalPrice = 0;
        for(let item of parts){
            let partStr = ``;
            partStr += `${item.partCateName} ${item.partBrandName} ${item.partName} ${item.standard} ${item.num}${item.unit} 共${item.salePrice}元`;
            partArr.push(partStr);
            saleLog[item.saleLogId] = partStr;
            totalPrice += Number(item.salePrice);
        }

        this.setState({
            tags:partArr,
            saleLog,
            totalPrice,
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

    //点击tag气泡确定按钮，删除当前tag的逻辑
    handleTagPopOk(){
        const saleLog = this.state.saleLog;
        let saleId = '';
        for(let key in saleLog){
            if(saleLog[key] === this.state.key){
                saleId = key;
                break;
            }
        }
        Request.synPost('/technician/deleteBySaleId',{
            id: saleId
        });
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
        this.setState({
            popVisible: true,
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
            //添加到nameArray数组的时候，去重，已经存在的值就不再添加了
            let flag = true;
            for(let part of nameArray){
                if(part.value === item.partName){
                    flag = false;
                }
            }
            if(flag){
                nameArray.push(obj);
            }
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
            //添加到nameArray数组的时候，去重，已经存在的值就不再添加了
            let flag = true;
            for(let part of nameArray){
                if(part.value === item.partName){
                    flag = false;
                }
            }
            if(flag){
                nameArray.push(obj);
            }
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
    handleNameChange(value) {
        const fittingObj = Request.synPost('/part/listParts', {
            brandId: this.state.popBrand[0],
            cateId: this.state.popType[0],
            name: value[0],
        });
        const fittingData = fittingObj.data;
        const standardArray = [];
        const standardAndUnit = {};//key为配件规格，value为配件单位，选择规格之后匹配到配件的单位
        for (let item of fittingData) {
            if (item.standard) {//如果该条数据standard字段不为空
                let obj = {
                    value: item.id,//value暂时先不用规格名字，可能需要使用 配件Id
                    label: item.standard,
                }
                standardArray.push(obj);
            }
            standardAndUnit[item.id] = item.unit;
        }
        if (standardArray.length > 0) {
            this.setState({
                popName: value,
                popStandards: standardArray,
                otherDisabled: false,
                standardAndUnit,
            });
        } else {
            this.setState({
                popName: value,
                otherDisabled: true,
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

    //点击模态框确定按钮的逻辑
    handleModalOk(){
        const detailId = this.props.detailId;
        Request.synPost('/workOrder/modify',{
            workOrderId: detailId,
            status: 3,
        });
        this.props.changeShowDetailToFalse();
    }

    upgradeClick(){
        this.setState({upgradeVisible:true});
    }

    modalBrandChange(value,cateId,index){
        const partData = Request.synPost('part/listParts',{cateId:cateId,brandId:value[0]});
        const partArr = partData.data;
        let partOptions = [];
        if(partArr && partArr.length > 0){
            for(let part of partArr){
                let obj = {
                    value: part.partName,
                    label: part.partName,
                }
                partOptions.push(obj);
            }
        }
        this.setState({
            ['partOptions-'+index]:partOptions,
            ['partOptionsDis-'+index]: false,
            ['brandValue-'+index]:value
        });
    }

    modalPartChange(value,cateId,index){
        const partData = Request.synPost('part/listParts',{
            cateId:cateId,
            brandId:this.state.brandValue[0],
            name: value[0]
        });
        const partArr = partData.data;
        let standardOptions = [];
        if(partArr && partArr.length > 0){
            for(let item of partArr){
                let obj = {
                    value: item.id,
                    label: item.standard,
                }
                standardOptions.push(obj);
            }
        }
        this.setState({
            ['standardOptions-'+index]:standardOptions,
            ['standardOptionsDis-'+index]: false,
            ['partValue-'+index]: value,
        });
    }

    modalStandardChange(value,index,partId,partNum){
        const upgradeParts = this.state.upgradeParts;
        let flag = true;
        for(let item of upgradeParts){
            if(partId === item.oldPartId && value[0] === item.nowPartId){
                flag = false;
                break;
            }
        }
        if(flag){
            upgradeParts.push({
                oldPartId:partId,
                nowPartId:value[0],
                num:partNum,
                orderId:this.props.detailId,
                createUser: CookieUtil.getCookie('id'),//获取技师主管的ID
                technicianId: this.state.dataObj.serviceUser,
            });
        }
        this.setState({
            upgradeParts,
            ['standardValue-'+index]: value,
        });
    }

    upgradePart(){
        const upgradeParts = this.state.upgradeParts;
        console.log(upgradeParts);
        $.ajax({
            url: 'cus/upgradPart/addUpgradParts',
            data: JSON.stringify(upgradeParts),
            type: 'POST',
            dataType: 'json',
            contentType: "application/json",
            success: (response)=>{
                console.log(JSON.stringify(response));
                if(response.code === '200'){

                    const upgradePartArr = Request.synPost('upgradPart/listByWorkOrderId',{orderId:this.props.detailId});
                    let upgradeTags = [];
                    if(upgradePartArr && upgradePartArr.length > 0){
                        for(let item of upgradePartArr){
                            let num;
                            for(let oldPart of this.state.partModal){
                                if(oldPart.partId == item.oldPartId){
                                    num = oldPart.partNum;
                                    break;
                                }
                            }
                            let desc = ``;
                            desc += `${item.nowPartCateName} ${item.nowPartBrandName} ${item.nowPartName}`;
                            desc += ` ${item.nowPartStandard} ${num}${item.nowPartUnit}`;
                            let obj = {
                                id: item.id,
                                diffPrice: item.diffPrice,
                                desc,
                            }
                            upgradeTags.push(obj);
                        }
                    }
                    let diffPartPrice = 0;
                    if(upgradeTags.length > 0){
                        for(let item of upgradeTags){
                            diffPartPrice += Number(item.diffPrice);
                        }
                    }

                    for(let index in this.state.partModal){
                        this.setState({
                            ['brandValue-'+index]: [],
                            ['partValue-'+index]: [],
                            ['standardValue-'+index]: [],
                            ['partOptionsDis-'+index]: true,
                            ['standardOptionsDis-'+index]: true,
                        });
                    }
                    this.setState({upgradeTags,upgradeVisible:false,diffPartPrice});
                } else {
                    alert('请求异常，请重试');
                }
            },
            error: (err)=>{
                throw err;
            }
        });
    }

    cancelModal(){
        for(let index in this.state.partModal){
            this.setState({
                ['brandValue-'+index]: [],
                ['partValue-'+index]: [],
                ['standardValue-'+index]: [],
                ['partOptionsDis-'+index]: true,
                ['standardOptionsDis-'+index]: true,
            });
        }
        this.setState({upgradeVisible:false});
    }

    delUpgrade(id){
        $.ajax({
            url: 'cus/upgradPart/deleteByPartdId',
            type: 'POST',
            data: {upgraPartdId:id},
            dataType: 'json',
            success: (response)=>{
                if(response.code === '200'){

                    const upgradePartArr = Request.synPost('upgradPart/listByWorkOrderId',{orderId:this.props.detailId});
                    let upgradeTags = [];
                    if(upgradePartArr && upgradePartArr.length > 0){
                        for(let item of upgradePartArr){
                            let num;
                            for(let oldPart of this.state.partModal){
                                if(oldPart.partId == item.oldPartId){
                                    num = oldPart.partNum;
                                    break;
                                }
                            }
                            let desc = ``;
                            desc += `${item.nowPartCateName} ${item.nowPartBrandName} ${item.nowPartName}`;
                            desc += ` ${item.nowPartStandard} ${num}${item.nowPartUnit}`;
                            let obj = {
                                id: item.id,
                                diffPrice: item.diffPrice,
                                desc,
                            }
                            upgradeTags.push(obj);
                        }
                    }
                    let diffPartPrice = 0;
                    if(upgradeTags.length > 0){
                        for(let item of upgradeTags){
                            diffPartPrice += Number(item.diffPrice);
                        }
                    }

                    this.setState({upgradeTags,upgradeVisible:false,diffPartPrice});

                } else {
                    message.error('请求异常');
                }
            },
            error: (err)=>{
                throw err;
            }
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
                        showSearch={true}
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
            serviceDateFormate = this.dateFormate(serviceDate).substr(0,10);
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
                                <p>{item}</p>
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
                    {...formItemLayout}
                    label='配件升级'
                >
                    <div>
                        {this.state.upgradeTags.map((tag) => {
                            const tagElem = (
                                <Popconfirm
                                    title={<h3>确定删除 ?</h3>}
                                    okText="确定"
                                    cancelText="取消"
                                    placement="right"
                                    visible={this.state.currentTag===tag.id}
                                    onConfirm={()=>{this.delUpgrade(tag.id)}}
                                    onCancel={()=>{this.setState({currentTag:''})}}
                                >
                                    <Tag
                                        key={tag.id}
                                        closable={true}
                                        onClose={(e)=>{
                                            e.preventDefault();
                                            this.setState({currentTag:tag.id});
                                        }}
                                        /*afterClose={() => this.handleTagClose(tag)}*/
                                    >
                                        {tag.desc}
                                    </Tag>
                                </Popconfirm>
                            );
                            return tagElem;
                        })}
                            <Button type="primary" size="small"
                                    onClick={this.upgradeClick.bind(this)}
                            >+</Button>
                    </div>
                </FormItem>
                <FormItem
                    label="技师销售合计"
                    {...formItemLayout}
                >
                    <span>{this.state.totalPrice}</span>元
                </FormItem>
                <FormItem
                    label="配件升级差价合计"
                    {...formItemLayout}
                >
                    <span>{this.state.diffPartPrice}</span>元
                </FormItem>
                <FormItem
                    label="增值合计"
                    {...formItemLayout}
                >
                    <span>{Number(this.state.totalPrice)+Number(this.state.diffPartPrice)}</span>元
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
                        onOk={this.handleModalOk.bind(this)}
                        onCancel={()=>{this.setState({recoverVisible:false})}}
                    >
                    </Modal>
                    <Button type="primary" onClick={()=>{this.setState({recoverVisible:true})}}>收单</Button>
                    <Button type="primary" onClick={()=>{this.setState({backVisible:true})}}>返回</Button>
                    <Modal
                        visible={this.state.upgradeVisible}
                        okText="确定"
                        cancelText="取消"
                        width={650}
                        maskClosable={false}
                        onOk={()=>{this.upgradePart()}}
                        onCancel={()=>{this.cancelModal()}}
                    >
                        {
                        this.state.brandOptionsArr.map((obj,index)=>{
                            let cateId;
                            for(let item of this.state.popTypes){
                                if(item.label === obj.part.partCate){
                                    cateId = item.value;
                                }
                            }
                            return (
                                <Row gutter={10} type="flex" align="middle" style={{marginBottom: '10px'}}>
                                    <Col span={8}>
                                        {obj.part.partStr}
                                    </Col>
                                    <Col span={2}>升级</Col>
                                    <Col span={4}>
                                        <Cascader
                                            options={obj.brandOptions}
                                            placeholder='请选择品牌'
                                            value={this.state['brandValue-' + index]}
                                            onChange={(value)=> {
                                                this.modalBrandChange(value, cateId, index)
                                            }}
                                        />
                                    </Col>
                                    <Col span={4}>
                                        <Cascader
                                            disabled={this.state['partOptionsDis-' + index] === false ? false : true}
                                            options={this.state['partOptions-' + index]}
                                            placeholder='请选择配件'
                                            value={this.state['partValue-' + index]}
                                            onChange={(value)=> {
                                                this.modalPartChange(value, cateId, index)
                                            }}
                                            showSearch={true}
                                        />
                                    </Col>
                                    <Col span={4}>
                                        <Cascader
                                            disabled={this.state['standardOptionsDis-' + index] === false ? false : true}
                                            options={this.state['standardOptions-' + index]}
                                            placeholder='请选择规格'
                                            value={this.state['standardValue-' + index]}
                                            onChange={(value)=> {
                                                this.modalStandardChange(value, index, obj.part.partId, obj.part.partNum)
                                            }}
                                        />
                                    </Col>
                                </Row>
                            );
                        })
                        }
                    </Modal>
                </FormItem>
            </Form>
        );
    }
}

export default BillInfo;