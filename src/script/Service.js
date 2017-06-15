import React from 'react';
import { Button, Table, Modal, Form, Input, InputNumber, Select, Tag, Popconfirm, Row, Col, Cascader, message } from 'antd';
import Request from './util/Request';
import $ from 'jquery';
const FormItem = Form.Item;
const Option = Select.Option;

/*const dataSource = [{
 key: '1',
 name: '名称一',
 type: '类型一',
 fitting: '配件一',
 createDate: '时间一',
 price: '报价一',
 }, {
 key: '2',
 name: '名称二',
 type: '类型二',
 fitting: '配件二',
 createDate: '时间二',
 price: '报价二',
 }, {
 key: '3',
 name: '名称三',
 type: '类型三',
 fitting: '配件三',
 createDate: '时间三',
 price: '报价三',
 }];*/
const popStandards = [{
    value: '规格一',
    label: '规格一',
}, {
    value: '规格二',
    label: '规格二'
}];

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
        disabled: true,
        key: '',
        serviceId: 0,
        serviceData: {}
    }

    componentWillReceiveProps(nextProps) {
        const serviceId = nextProps.serviceId;
        let serviceData = {};
        let tags = [];
        if(serviceId){
            serviceData = Request.synPost('/service/detailByServiceId',{
                id:serviceId
            });
            for(let item of serviceData.partDtos){
                let tag = {
                    tagStr: '',
                    tagObj: {
                        partId:item.partId,
                        num:item.num
                    }
                };
                tag.tagStr += item.partCateName + ' ' + item.partBrandName + ' ' + item.standard + ' ';
                tag.tagStr += item.partName + ' ' + item.num + ' ' + item.unit;
                tags.push(tag);
            }
        }
        this.setState({
            serviceId,
            serviceData,
            tags,
        });
    }

    //pop页面类型改变的逻辑
    handlePopTypeChange(value) {
        const fittingObj = Request.synPost('part/listParts', {
            cateId: value[0],
            brandId: this.state.popBrand[0]
        });
        const fittingArray = fittingObj.data;
        const popFittings = [];
        let unitObj = {};
        for (let item of fittingArray) {
            const obj = {
                value: item.id,
                label: item.partName
            }
            popFittings.push(obj);
            unitObj[item.id] = item.unit;
        }
        this.setState({
            popType: value,
            popFittings,
            unitObj,
            disabled: popFittings.length ? false : true,
        });
        console.log(popFittings);
    }

    //pop页面品牌改变的逻辑
    handlePopBrandChange(value) {
        const fittingObj = Request.synPost('part/listParts', {
            cateId: this.state.popType[0],
            brandId: value[0]
        });
        const fittingArray = fittingObj.data;
        const popFittings = [];
        let unitObj = {};
        for (let item of fittingArray) {
            const obj = {
                value: item.id,
                label: item.partName
            }
            popFittings.push(obj);
            unitObj[item.id] = item.unit;
        }
        this.setState({
            popBrand: value,
            popFittings,
            unitObj,
            disabled: popFittings.length ? false : true,
        });
        console.log(popFittings);
    }

    //pop页面规格改变的逻辑
    handlePopStandardChange(value) {
        this.setState({popStandard: value});
    }

    //pop页面配件改变的逻辑
    handlePopFittingChange(value) {
        const fittingId = value[0];
        const unitObj = this.state.unitObj;
        const unit = unitObj[fittingId];
        this.setState({
            popFitting: value,
            popUnit: unit
        });
    }

    //新增modal确定按钮的逻辑
    handleModalOk() {
        const tags = this.state.tags;
        let dataArray = [];
        for (let tag of tags) {
            dataArray.push(tag.tagObj);
        }
        const params = {
            name: this.state.modalName,
            price: this.state.modalPrice,
            createUser: 1,
            partRelModels: dataArray
        };
        let frontArray;
        let url;
        if(this.state.serviceId){
            params.id = 1;
            url = '/service/modify';
        } else {
            url = '/service/create';
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
    handleTagPopOk() {
        const tags = this.state.tags.filter(tag => tag.tagStr !== this.state.key);
        this.setState({
            tags,
            key: ''
        });
    }

    //使用配件pop确定按钮的逻辑
    handlePopOK(e) {
        e.preventDefault();
        const {popType, popBrand, popFitting, popAmount, tags, popUnit} = this.state;
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
        let fitting;
        for (let item of this.state.popFittings) {
            if (item.value === popFitting[0]) {
                fitting = item.label;
                break;
            }
        }

        const tag = {
            tagStr: `${type} ${brand} ${fitting} ${popAmount}${popUnit}`,
            tagObj: {
                partId: popFitting[0],
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
            popAmount: '',
            key: '',
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
            popAmount: '',
            key: '',
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
                    label="规格"
                    {...formPopLayout}
                >
                    <Cascader
                        options={popStandards}
                        value={this.state.popStandard}
                        onChange={this.handlePopStandardChange.bind(this)}
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
                        disabled={this.state.disabled}
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
                        disabled={this.state.disabled}
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
                            value={this.state.serviceId?this.state.serviceData.serviceName:this.state.modalName}
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
                            value={this.state.serviceId?this.state.serviceData.serviceCate:this.state.modalType}
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
                                        onConfirm={this.handleTagPopOk.bind(this)}
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
                            value={this.state.serviceId?this.state.serviceData.servicePrice:this.state.modalPrice}
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

    /*//删除使用配件选项的逻辑
     handleTagClose(removedTag) {
     return ()=> {
     console.log(removedTag);
     const tags = this.state.tags.filter(tag => tag.tagStr !== removedTag.tagStr);
     console.log(tags);
     this.setState({tags});
     }
     }*/

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