import React from 'react';
import {Table, Input, Button, Form, Popconfirm, Row, Col, Cascader, Select, message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

const types = [{
    value: '类型一',
    label: '类型一',
}, {
    value: '类型二',
    label: '类型二',
}, {
    value: '类型三',
    label: '类型三',
}];

const brands = [{
    value: '品牌一',
    label: '品牌一',
}, {
    value: '品牌二',
    label: '品牌二',
}, {
    value: '品牌三',
    label: '品牌三',
}];

const dataSource = [{
    key: '1',
    type: '类型一',
    brand: '品牌一',
    name: '名称一',
    company: '单位一',
    standard: '规格一',
}, {
    key: '2',
    type: '类型二',
    brand: '品牌二',
    name: '名称二',
    company: '单位二',
    standard: '规格二',
}, {
    key: '3',
    type: '类型三',
    brand: '品牌三',
    name: '名称三',
    company: '单位三',
    standard: '规格三',
}]

class Fitting extends React.Component {

    state = {
        columns: [{
            title: '类型',
            dataIndex: 'type',
            key: 'type',
        }, {
            title: '品牌',
            dataIndex: 'brand',
            key: 'brand',
        }, {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '单位',
            dataIndex: 'company',
            key: 'company',
        }, {
            title: '规格',
            dataIndex: 'standard',
            key: 'standard',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record)=> {
                return (
                    <span>
                        <Popconfirm title={<h3>确定取消</h3>} placement="bottomRight">
                            <a href="javascript:;">删除</a>
                        </Popconfirm>
                        <span className="ant-divider"/>
                        <a href="javascript:;">修改</a>
                    </span>
                );
            }
        }],
        type: [],
        brand: [],
        fitting: '',
        newtype: [],
        newbrand: [],
        types: [],
        brands: [],
        newtypeVisible: false,
        newbrandVisible: false,
        newVisible: false,
        companyInput: '',
        standardInput: '',
    }

    componentDidMount() {
        //发送请求，获取品牌选项
        fetch('/part/listPartBrand').then((response)=> {
            return response.json();
        }).then((json)=> {
            if(json.code==='200'){
                const types = [];
                const typeArray = json.data;
                for(let item of typeArray){
                    const obj = {
                        value: item.id,
                        label: item.name,
                    };
                    types.push(obj);
                }
                this.setState({types});
            } else {
                message.error(`请求异常：${json.message}`);
            }
        }).catch((err)=>{
            throw err;
        });
        //发送请求，获取类型选项
        fetch('part/listPartCate').then((response)=>{
            return response.json();
        }).then((json)=>{
            if(json.code==='200'){
                const brands = [];
                const brandArray = json.data;
                for(let item of brandArray){
                    const obj = {
                        value: item.id,
                        label: item.name,
                    }
                    brands.push(obj);
                }
                this.setState({brands});
            } else {
                message.error(`请求异常：${json.message}`);
            }
        });
    }

    //查询字段 类型 更改时的逻辑
    handleTypeChange(value) {
        this.setState({
            type: value,
        });
        console.log(value);
    }

    //查询字段 品牌 更改时的逻辑
    handleBrandChange(value) {
        this.setState({
            brand: value,
        });
        console.log(value);
    }

    //查询字段 配件名称 更改时的逻辑
    handleFittingChange(e) {
        e.preventDefault();
        this.setState({
            fitting: e.target.value
        });
    }

    //点击查询的逻辑
    handleSearch(e) {
        e.preventDefault();
    }

    //点击重置的逻辑
    handleReset(e) {
        e.preventDefault();
        this.setState({
            type: [],
            brand: [],
            fitting: '',
        });
    }

    handleNewtypeChange(value) {
        this.setState({
            newtype: value,
        });
    }

    handleNewbrandChange(value) {
        this.setState({
            newbrand: value,
        });
    }

    //点击新增类型的逻辑
    newTypeClick(e){
        e.preventDefault();
        this.setState({
            newtypeVisible: true,
        });
    }


    //点击新增品牌的逻辑
    newBrandClick(e){
        e.preventDefault();
        this.setState({
            newbrandVisible: true,
        });
    }

    //点击新增的逻辑
    newClick(e){
        e.preventDefault();
        this.setState({
            newVisible: true,
        });
    }

    //新增选项Popconfirm确定按钮的逻辑
    newOk(e){
        e.preventDefault();
        this.setState({
            newVisible: false,
        });
    }

    //新增选项Popconfirm取消按钮的逻辑
    newCancel(e){
        e.preventDefault();
        this.setState({
            newVisible: false,
        });
    }

    render() {
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const popFormLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 18}
        };
        const newFittingPop = (
            <Form>
                <div style={{fontSize: '14px', marginBottom: '10px'}}>
                    <span>新增</span>
                </div>
                <FormItem
                    label="类型"
                    {...popFormLayout}
                >
                    <Cascader
                        placeholder=''
                        options={this.state.types}
                        value={this.state.newtype}
                        onChange={this.handleNewtypeChange.bind(this)}
                    />
                </FormItem>
                <FormItem
                    label="品牌"
                    {...popFormLayout}
                >
                    <Cascader
                        placeholder=''
                        options={this.state.brands}
                        value={this.state.newbrand}
                        onChange={this.handleNewbrandChange.bind(this)}
                    />
                </FormItem>
                <FormItem
                    label="单位"
                    {...popFormLayout}
                >
                    <Input
                        onChange={(e)=>{this.setState({companyInput:e.target.value})}}
                        value={this.state.companyInput}
                    />
                </FormItem>
                <FormItem
                    label="规格"
                    {...popFormLayout}
                >
                    <Input
                        onChange={(e)=>{this.setState({standardInput:e.target.value})}}
                        value={this.state.standardInput}
                    />
                </FormItem>
            </Form>
        );
        const newBrandPop = (
            <Form>
                <div style={{fontSize: '14px', marginBottom: '10px'}}>
                    <span>新增品牌</span>
                </div>
                <FormItem
                    label="名称"
                    {...popFormLayout}
                >
                    <Input/>
                </FormItem>
            </Form>
        );
        const newTypePop = (
            <Form>
                <div style={{fontSize: '14px', marginBottom: '10px'}}>
                    <span>新增类型</span>
                </div>
                <FormItem
                    label="名称"
                    {...popFormLayout}
                >
                    <Input/>
                </FormItem>
            </Form>
        );

        return (
            <div>
                <Row gutter={16}>
                    <Col
                        span={6}
                    >
                        <FormItem
                            label="类型"
                            {...formItemLayout}
                        >
                            <Cascader
                                placeholder='请选择类型'
                                options={this.state.types}
                                value={this.state.type}
                                onChange={this.handleTypeChange.bind(this)}
                            />
                        </FormItem>
                    </Col>
                    <Col
                        span={6}
                    >
                        <FormItem
                            label="品牌"
                            {...formItemLayout}
                        >
                            <Cascader
                                placeholder='请选择品牌'
                                options={this.state.brands}
                                value={this.state.brand}
                                onChange={this.handleBrandChange.bind(this)}
                            />
                        </FormItem>
                    </Col>
                    <Col
                        span={6}
                    >
                        <FormItem
                            label="配件名称"
                            {...formItemLayout}
                        >
                            <Input
                                placeholder='请输入配件名称'
                                value={this.state.fitting}
                                onChange={this.handleFittingChange.bind(this)}
                            />
                        </FormItem>
                    </Col>
                </Row>
                <Row type='flex' justify='end' gutter={10}>
                    <Col>
                        <Button type="primary" onClick={this.handleSearch.bind(this)}>查询</Button>
                    </Col>
                    <Col>
                        <Popconfirm
                            placement="bottomRight"
                            title={newTypePop}
                            okText="提交"
                            cancelText="取消"
                            onConfirm={()=> {
                                console.log('提交')
                            }}
                            onCancel={()=> {
                                console.log('取消')
                            }}
                            visible={this.state.newtypeVisible}
                            overlayStyle={{width: '260px'}}
                        >
                            <Button onClick={this.newTypeClick.bind(this)}>新增类型</Button>
                        </Popconfirm>
                    </Col>
                    <Col>
                        <Popconfirm
                            placement="bottomRight"
                            title={newBrandPop}
                            okText="提交"
                            cancelText="取消"
                            onConfirm={()=> {
                                console.log('提交')
                            }}
                            onCancel={()=> {
                                console.log('取消')
                            }}
                            visible={this.state.newbrandVisible}
                            overlayStyle={{width: '260px'}}
                        >
                            <Button onClick={this.newBrandClick.bind(this)}>新增品牌</Button>
                        </Popconfirm>
                    </Col>
                    <Col>
                        <Popconfirm
                            placement="bottomRight"
                            title={newFittingPop}
                            okText="提交"
                            cancelText="取消"
                            onConfirm={this.newOk.bind(this)}
                            onCancel={this.newCancel.bind(this)}
                            visible={this.state.newVisible}
                            overlayStyle={{width: '260px'}}
                        >
                            <Button onClick={this.newClick.bind(this)}>新增</Button>
                        </Popconfirm>
                    </Col>
                    <Col>
                        <Button type="dashed" onClick={this.handleReset.bind(this)}>重置</Button>
                    </Col>
                </Row>
                <Table
                    dataSource={dataSource}
                    columns={this.state.columns}
                />
            </div>
        );
    }
}

export default Fitting;