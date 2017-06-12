import React from 'react';
import {
    Button,
    Table,
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Tag,
    Popconfirm,
    Row,
    Col,
    Cascader,
    message
} from 'antd';
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
                        <a href="javascript:;">删除</a>
                        <span className="ant-divider"/>
                        <a href="javascript:;">修改</a>
                    </span>
                );
            }
        }],
        popVisible: false,
        modalVisible: false,
        tags: [],
        popTypes: [],
        popType: [],
        popBrands: [],
        popBrand: [],
        popFittings: [],
        popFitting: [],
        popAmount: '',
        unitObj: {},
        popUnit: '',
        modalName: '',
        modalType: '',
        modalPrice: '',
        dataSource: [],
        disabled: true
    }

    backToFront(backArray) {
        let frontArray = [];
        for (let item of backArray) {
            const date = item.createDate;
            let createDate = '';
            if(date){
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

    searchList(){
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
        tags.push(tag);
        this.setState({
            tags,
            popVisible: false,
            popType: [],
            popBrand: [],
            popFitting: [],
            popAmount: '',
        });
    }

    handlePopCancel(e) {
        e.preventDefault();
        this.setState({
            popVisible: false,
            popType: [],
            popBrand: [],
            popFitting: [],
            popAmount: '',
        });
    }

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
        let result;
        $.ajax({
            type: 'POST',
            async: false,
            url: 'service/create',
            data: JSON.stringify(params),
            success: function (json) {
                if (json.code === "200") {
                    result = json.data;
                } else {
                    alert(json.message || "系统出错,请重新操作!");
                }
            },
            dataType: 'json',
            contentType: "application/json"
        });
        const frontArray = this.searchList();
        this.setState({
            modalVisible: false,
            popVisible: false,
            popType: [],
            popBrand: [],
            popFitting: [],
            popAmount: '',
            modalName: '',
            modalType: '',
            modalPrice: '',
            tags: [],
            dataSource: frontArray
        });
    }

    handleModalCancel() {
        this.setState({
            modalVisible: false,
            popVisible: false,
            popType: [],
            popBrand: [],
            popFitting: [],
            popAmount: '',
            modalName: '',
            modalType: '',
            modalPrice: '',
            tags: []
        });
    }

    handleNewClick(e) {
        e.preventDefault();
        this.setState({
            modalVisible: true
        });
    }

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
            disabled: popFittings.length?false:true,
        });
        console.log(popFittings);
    }

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
            disabled: popFittings.length?false:true,
        });
        console.log(popFittings);
    }

    handlePopFittingChange(value) {
        const fittingId = value[0];
        const unitObj = this.state.unitObj;
        const unit = unitObj[fittingId];
        this.setState({
            popFitting: value,
            popUnit: unit
        });
    }

    handleTagClose(removedTag) {
        return ()=> {
            console.log(removedTag);
            const tags = this.state.tags.filter(tag => tag.tagStr !== removedTag.tagStr);
            console.log(tags);
            this.setState({tags});
        }
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
            <div>
                <div className="clearfix">
                    <Button type="primary" onClick={this.handleNewClick.bind(this)}>新增</Button>
                    <Modal
                        title="新增"
                        okText="提交"
                        cancelText="取消"
                        onOk={this.handleModalOk.bind(this)}
                        onCancel={this.handleModalCancel.bind(this)}
                        closable={true}
                        maskClosable={false}
                        visible={this.state.modalVisible}
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
                                            <Tag
                                                key={tag.tagStr}
                                                closable={true}
                                                afterClose={this.handleTagClose.bind(this)(tag)}
                                            >
                                                {tag.tagStr}
                                            </Tag>
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
                                    value={this.state.modalPrice}
                                    onChange={(value)=> {
                                        this.setState({modalPrice: value});
                                    }}
                                />元
                            </FormItem>
                        </Form>
                    </Modal>
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