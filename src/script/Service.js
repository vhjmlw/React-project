import React from 'react';
import { Button, Table, Modal, Form, Input, InputNumber, Select, Tag, Popconfirm, Row, Col, Cascader, message } from 'antd';
import Request from './util/Request';
import $ from 'jquery';
import CookieUtil from './util/CookieUtil';
const FormItem = Form.Item;
const Option = Select.Option;

class ModalCustom extends React.Component {

    state = {
        popVisible: false,
        modalVisible: false,
        tags: [],
        popTypes: [],
        popType: [],
        popBrands: [],
        popBrand: [],
        popStandards: [],
        popStandard: [],
        popFittings: [],
        popFitting: [],
        popAmount: '',
        unitObj: {},
        popUnit: '',
        modalName: '',
        modalType: '',
        modalPrice: '',
        key: '',
        serviceId: 0,
        serviceData: {},
        fittingDisabled:true,
        otherDisabled:true,
        standardAndUnit:{}
    }

    componentWillReceiveProps(nextProps) {
        const serviceId = nextProps.serviceId;
        let serviceData = {};
        let tags = [];
        let modalName = '';
        let modalType = '';
        let modalPrice = '';
        if (serviceId) {
            serviceData = Request.synPost('/service/detailByServiceId', {
                id: serviceId
            });
            const partDtos = serviceData.partDtos;
            if (partDtos && partDtos.length > 0) {
                for (let item of partDtos) {
                    let tag = {
                        tagStr: '',
                        tagObj: {
                            partId: item.partId,
                            num: item.num
                        }
                    };
                    tag.tagStr += item.partCateName + ' ' + item.partBrandName + ' ' + item.standard + ' ';
                    tag.tagStr += item.partName + ' ' + item.num + ' ' + item.unit;
                    tags.push(tag);
                }
            }
            modalName = serviceData.serviceName;
            modalType = serviceData.serviceCate;
            modalPrice = serviceData.servicePrice;
        }
        this.setState({
            serviceId,
            serviceData,
            tags,
            modalName,
            modalType,
            modalPrice
        });
    }

    //pop页面类型改变的逻辑
    handlePopTypeChange(value) {
        const typeObj = Request.synPost('/part/listParts', {
            brandId: this.state.popBrand[0],
            cateId: value[0],
        });
        const typeData = typeObj.data;
        const fittingArray = [];
        for (let item of typeData) {
            let obj = {
                value: item.partName,
                label: item.partName
            }
            //添加到fittingArray数组的时候，去重，已经存在的值就不再添加了
            let flag = true;
            for (let part of fittingArray) {
                if (part.value === item.partName) {
                    flag = false;
                }
            }
            if (flag) {
                fittingArray.push(obj);
            }
        }
        if (fittingArray.length > 0) {
            this.setState({
                popType: value,
                popFittings: fittingArray,
                fittingDisabled: false
            });
        } else {
            this.setState({
                popType: value,
                popFitting: [],
                fittingDisabled: true,
                popStandard: [],
                popUnit: '',
                otherDisabled: true,
                popAmount: '',
            });
        }
    }

    //pop页面品牌改变的逻辑
    handlePopBrandChange(value) {
        const brandObj = Request.synPost('/part/listParts',{
            brandId: value[0],
            cateId: this.state.popType[0],
        });
        const brandData = brandObj.data;
        let fittingArray = [];
        for(let item of brandData){
            let obj = {
                value: item.partName,
                label: item.partName,
            }
            //添加到fittingArray数组的时候，去重，已经存在的值就不再添加了
            let flag = true;
            for(let part of fittingArray){
                if(part.value === item.partName){
                    flag = false;
                }
            }
            if(flag){
                fittingArray.push(obj);
            }
        }
        if(fittingArray.length>0){
            this.setState({
                popBrand:value,
                popFittings:fittingArray,
                fittingDisabled:false,
            });
        } else {
            this.setState({
                popBrand:value,
                popFitting: [],
                fittingDisabled:true,
                popStandard:[],
                popUnit: '',
                otherDisabled:true,
                popAmount: '',
            });
        }
    }

    //pop页面配件改变的逻辑
    handlePopFittingChange(value) {
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
                popFitting:value,
                popStandards:standardArray,
                otherDisabled:false,
                standardAndUnit,
            });
        } else {
            this.setState({
                popFitting:value,
                otherDisabled:true,
                popStandard: [],
                popAmount: '',
                popUnit: '',
            });
        }
    }

    //pop页面规格改变的逻辑
    handlePopStandardChange(value) {
        const standardAndUnit = this.state.standardAndUnit;
        const popUnit = standardAndUnit[value[0]];
        this.setState({
            popStandard:value,
            popUnit
        });
    }

    //新增modal确定按钮的逻辑
    handleModalOk() {
        const modalName = this.state.modalName;
        const modalType = this.state.modalType;
        const modalPrice = this.state.modalPrice;
        const tags = this.state.tags;
        if(!modalName){
            message.warning('请输入服务名称');
            return;
        }
        if(!modalType){
            message.warning('请输入服务类型');
            return;
        }
        if(modalType.length >= 6){
            message.warning('服务类型不能超过5个字符');
            return;
        }
        if(!tags.length){
            message.warning('请选择配件');
            return;
        }
        if(!modalPrice){
            message.warning('请输入价格');
            return;
        }

        let dataArray = [];
        for (let tag of tags) {
            dataArray.push(tag.tagObj);
        }
        const params = {
            name: this.state.modalName,
            price: this.state.modalPrice,
            cate: this.state.modalType,
            createUser: CookieUtil.getCookie('id'),//获取技师主管的ID;
            partRelModels: dataArray
        };
        let frontArray;
        let url;
        let success;
        if(this.state.serviceId){
            params.id = this.state.serviceId;
            url = 'cus/service/modify';
            success = '修改成功';
        } else {
            url = 'cus/service/create';
            success = '新增成功';
        }
        //使用jQuery中的Ajax模块发送数组的处理方法
        let result;
        $.ajax({
            type: 'POST',
            async: false,
            url: url,
            data: JSON.stringify(params),//params中包含数组
            success: function (json) {
                if (json.code === "200") {
                    result = json.data;
                } else {
                    alert(json.message || "系统出错,请重新操作!");
                }
            },
            dataType: 'json',
            contentType: "application/json"//发送参数中包含数组
        });
        message.success(success,1.5);
        frontArray = this.props.searchList();
        this.setState({
            popVisible: false,
            popType: [],
            popBrand: [],
            popFitting: [],
            popAmount: '',
            modalName: '',
            modalType: '',
            modalPrice: '',
            tags: [],
            dataSource: frontArray,
            key: '',
        });
        this.props.handleFatherState({
            dataSource:frontArray,
            modalVisible: false,
            serviceId: 0
        });
    }

    //新增modal取消按钮的逻辑
    handleModalCancel() {
        this.setState({
            popVisible: false,
            popType: [],
            popBrand: [],
            popFitting: [],
            popAmount: '',
            modalName: '',
            modalType: '',
            modalPrice: '',
            tags: [],
            key: '',
        });
        this.props.handleFatherState({modalVisible:false,serviceId: 0});
    }

    //点击tag气泡确定按钮的逻辑
    handleTagPopOk(tag) {
        const partId = tag.tagObj.partId;
        const serviceId = this.state.serviceId;
        $.ajax({
            url: 'cus/service/deletePartRel',
            type: 'POST',
            dataType: 'json',
            data: {partId,serviceId},
            success: (response)=>{
                if(response.code === '200'){
                    let tags = [];
                    const serviceData = Request.synPost('/service/detailByServiceId', {
                        id: serviceId
                    });
                    const partDtos = serviceData.partDtos;
                    if (partDtos && partDtos.length > 0) {
                        for (let item of partDtos) {
                            let tag = {
                                tagStr: '',
                                tagObj: {
                                    partId: item.partId,
                                    num: item.num
                                }
                            };
                            tag.tagStr += item.partCateName + ' ' + item.partBrandName + ' ' + item.standard + ' ';
                            tag.tagStr += item.partName + ' ' + item.num + ' ' + item.unit;
                            tags.push(tag);
                        }
                    }
                    this.setState({tags});
                    //先占个位置，稍后填坑
                }
            },
            error: (err)=>{
                throw err;
            }
        });

        /*const tags = this.state.tags.filter(tag => tag.tagStr !== this.state.key);
        this.setState({
            tags,
            key: ''
        });*/

    }

    //使用配件pop确定按钮的逻辑
    handlePopOK(e) {
        e.preventDefault();
        const {popType, popBrand, popFitting, popAmount, tags, popUnit, popStandard} = this.state;
        if (popType.length === 0) {
            message.warning('请选择类型');
            return;
        }
        if (popBrand.length === 0) {
            message.warning('请选择品牌');
            return;
        }
        if (popFitting.length === 0) {
            message.warning('请选择配件');
            return;
        }
        if (popStandard.length === 0) {
            message.warning('请选择规格');
            return;
        }
        if (!popAmount) {
            message.warning('请输入数量');
            return;
        }
        let type;
        for (let item of this.state.popTypes) {
            if (item.value === popType[0]) {
                type = item.label;
                break;
            }
        }
        let brand;
        for (let item of this.state.popBrands) {
            if (item.value === popBrand[0]) {
                brand = item.label;
                break;
            }
        }
        let standard;
        for (let item of this.state.popStandards) {
            if (item.value === popStandard[0]) {
                standard = item.label;
                break;
            }
        }
        const tag = {
            tagStr: `${type} ${brand} ${popFitting} ${standard}${popAmount}${popUnit}`,
            tagObj: {
                partId: popStandard[0],
                num: popAmount,
            }
        };

        //以下代码控制不能添加相同的两项
        for (let item of this.state.tags) {
            if (item.tagStr === tag.tagStr) {
                message.warn('不能添加相同的两项');
                return;
            }
        }
        tags.push(tag);
        this.setState({
            tags,
            popVisible: false,
            popType: [],
            popBrand: [],
            popFitting: [],
            popStandard: [],
            popAmount: '',
            key: '',
            popUnit: '',
            fittingDisabled: true,
            otherDisabled: true,
            standardAndUnit:{}
        });
    }

    //使用配件pop取消按钮的逻辑
    handlePopCancel(e) {
        e.preventDefault();
        this.setState({
            popVisible: false,
            popType: [],
            popBrand: [],
            popFitting: [],
            popStandard: [],
            popAmount: '',
            key: '',
            popUnit: '',
            fittingDisabled: true,
            otherDisabled: true,
            standardAndUnit:{}
        });
    }

    //+号点击的逻辑
    handlePlus(e) {
        e.preventDefault();
        const brandArray = Request.synPost('part/listPartBrand');
        const popBrands = [];
        for (let item of brandArray) {
            const obj = {
                value: item.id,
                label: item.name,
            }
            popBrands.push(obj);
        }
        const typeArray = Request.synPost('part/listPartCate');
        const popTypes = [];
        for (let item of typeArray) {
            const obj = {
                value: item.id,
                label: item.name,
            }
            popTypes.push(obj);
        }
        this.setState({
            popVisible: true,
            popBrands,
            popTypes
        });

    }

    render() {
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 10}
        };
        const formPopLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 16}
        }
        const fittingPop = (
            <Form>
                <FormItem
                    label="类型"
                    {...formPopLayout}
                >
                    <Cascader
                        options={this.state.popTypes}
                        value={this.state.popType}
                        onChange={this.handlePopTypeChange.bind(this)}
                        placeholder=''
                    />
                </FormItem>
                <FormItem
                    label="品牌"
                    {...formPopLayout}
                >
                    <Cascader
                        options={this.state.popBrands}
                        value={this.state.popBrand}
                        onChange={this.handlePopBrandChange.bind(this)}
                        placeholder=''
                    />
                </FormItem>
                <FormItem
                    label="配件"
                    {...formPopLayout}
                >
                    <Cascader
                        options={this.state.popFittings}
                        value={this.state.popFitting}
                        onChange={this.handlePopFittingChange.bind(this)}
                        placeholder=''
                        disabled={this.state.fittingDisabled}
                    />
                </FormItem>
                <FormItem
                    label="规格"
                    {...formPopLayout}
                >
                    <Cascader
                        options={this.state.popStandards}
                        value={this.state.popStandard}
                        onChange={this.handlePopStandardChange.bind(this)}
                        placeholder=''
                        disabled={this.state.otherDisabled}
                    />
                </FormItem>
                <FormItem
                    label="数量"
                    {...formPopLayout}
                >
                    <InputNumber
                        min={0}
                        value={this.state.popAmount}
                        onChange={(value)=> {
                            this.setState({popAmount: value})
                        }}
                        disabled={this.state.otherDisabled}
                    /><span>{this.state.popUnit}</span>
                </FormItem>
            </Form>
        );

        return (
            <Modal
                title="新增"
                okText="提交"
                cancelText="取消"
                onOk={this.handleModalOk.bind(this)}
                onCancel={this.handleModalCancel.bind(this)}
                closable={true}
                maskClosable={false}
                visible={this.props.modalVisible}
            >
                <Form>
                    <FormItem
                        label="名称"
                        {...formItemLayout}
                    >
                        <Input
                            value={this.state.modalName}
                            onChange={(e)=> {
                                this.setState({modalName: e.target.value});
                            }}
                        />
                    </FormItem>
                    <FormItem
                        label="类型"
                        {...formItemLayout}
                    >
                        <Input
                            value={this.state.modalType}
                            onChange={(e)=> {
                                this.setState({modalType: e.target.value});
                            }}
                        />
                    </FormItem>
                    <FormItem
                        label="使用配件"
                        labelCol={{span: 8}}
                        wrapperCol={{span: 16}}
                    >
                        <div>
                            {this.state.tags.map((tag) => {
                                const tagElem = (
                                    <Popconfirm
                                        title={<h3>确定删除 ?</h3>}
                                        okText="确定"
                                        cancelText="取消"
                                        placement="right"
                                        visible={this.state.key === tag.tagStr}
                                        onConfirm={()=>{this.handleTagPopOk(tag)}}
                                        onCancel={()=> {
                                            this.setState({key: ''})
                                        }}
                                    >
                                        <Tag
                                            key={tag.tagStr}
                                            closable={true}
                                            onClose={(e)=> {
                                                e.preventDefault();
                                                this.setState({key: tag.tagStr});
                                            }}
                                            /*afterClose={this.handleTagClose.bind(this)(tag)}*/
                                        >
                                            {tag.tagStr}
                                        </Tag>
                                    </Popconfirm>
                                );
                                return tagElem;
                            })}
                            <Popconfirm
                                placement="rightTop"
                                onConfirm={this.handlePopOK.bind(this)}
                                onCancel={this.handlePopCancel.bind(this)}
                                title={fittingPop}
                                okText="提交"
                                cancelText="取消"
                                visible={this.state.popVisible}
                                overlayStyle={{width: '260px'}}
                            >
                                <Button type="primary" size="small"
                                        onClick={this.handlePlus.bind(this)}>+</Button>
                            </Popconfirm>
                        </div>
                    </FormItem>
                    <FormItem
                        label="价格"
                        {...formItemLayout}
                    >
                        <InputNumber
                            min={0}
                            value={this.state.modalPrice}
                            onChange={(value)=> {
                                this.setState({modalPrice: value});
                            }}
                        />元
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

class Service extends React.Component {

    state = {
        columns: [{
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: '15%',
        }, {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width: '15%',
        }, {
            title: '使用配件',
            dataIndex: 'fitting',
            key: 'fitting',
            width: '15%',
        }, {
            title: '创建时间',
            dataIndex: 'createDate',
            key: 'createDate',
            width: '15%',
        }, {
            title: '服务报价',
            dataIndex: 'price',
            key: 'price',
            width: '15%',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record)=> {
                return (
                    <span>
                        <Popconfirm
                            title={<h3>确定删除 ?</h3>}
                            placement="bottomRight"
                            onConfirm={()=>{this.handleServiceDel(record.key)}}
                        >
                            <a href="javascript:;">删除</a>
                        </Popconfirm>
                        <span className="ant-divider"/>
                        <a onClick={()=>{
                            this.setState({
                                modalVisible: true,
                                serviceId: record.key,
                            });
                        }}>修改</a>
                    </span>
                );
            }
        }],
        modalVisible: false,
        dataSource: [],
        serviceId: 0,
    }

    //后台请求的字段转换为前端的字段，传入一个数组，返回一个数组
    backToFront(backArray) {
        let frontArray = [];
        for (let item of backArray) {
            const date = item.createDate;
            let createDate = '';
            if (date) {
                createDate += date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2);
                createDate += ' ' + date.substr(8, 2) + ':' + date.substr(10, 2) + ':' + date.substr(12, 2);
            }
            const obj = {
                key: item.id,
                name: item.name,
                type: item.cate,
                fitting: item.partNames,
                createDate: createDate,
                price: item.price
            };
            frontArray.push(obj);
        }
        return frontArray;
    }

    //请求列表数据
    searchList() {
        const backArray = Request.synPost('service/list');
        const frontArray = this.backToFront(backArray);
        return frontArray;
    }

    componentDidMount() {
        const frontArray = this.searchList();
        this.setState({
            dataSource: frontArray
        });
    }

    //新增按钮的逻辑
    handleNewClick(e) {
        e.preventDefault();
        this.setState({
            modalVisible: true
        });
    }

    handleFatherState(obj){
        this.setState(obj);
    }

    handleServiceDel(serviceId){
        Request.synPost('/service/deleteByServiceId',{serviceId});
        message.success('删除成功',1.5);
        const frontArray = this.searchList();
        this.setState({dataSource:frontArray});
    }

    render() {
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 10}
        };
        const formPopLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 16}
        }

        return (
            <div>
                <div className="clearfix">
                    <Button type="primary" onClick={this.handleNewClick.bind(this)}>新增</Button>
                    {/*立此flag以作标记*/}
                    <ModalCustom
                        modalVisible={this.state.modalVisible}
                        serviceId={this.state.serviceId}
                        handleFatherState={this.handleFatherState.bind(this)}
                        searchList={this.searchList.bind(this)}
                    />
                </div>
                <Table
                    columns={this.state.columns}
                    dataSource={this.state.dataSource}
                    pagination={false}
                    scroll={{y: 700}}
                />
            </div>
        );
    }
}

export default Service;