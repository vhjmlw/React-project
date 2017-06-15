import React from 'react';
import {Table, Input, Button, Form, Popconfirm, Row, Col, Cascader, Select, message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import Request from './util/Request';

/*const types = [{
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
    unit: '单位一',
    standard: '规格一',
}, {
    key: '2',
    type: '类型二',
    brand: '品牌二',
    name: '名称二',
    unit: '单位二',
    standard: '规格二',
}, {
    key: '3',
    type: '类型三',
    brand: '品牌三',
    name: '名称三',
    unit: '单位三',
    standard: '规格三',
}]*/

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
            dataIndex: 'unit',
            key: 'unit',
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
                        <Popconfirm
                            title={<h3>确定删除 ?</h3>}
                            placement="bottomRight"
                            onConfirm={()=>{this.handleFittingDel(record.key)}}
                        >
                            <a href="javascript:;">删除</a>
                        </Popconfirm>
                    </span>
                );
            }
        }],
        types: [],
        brands: [],
        newtypeVisible: false,
        newbrandVisible: false,
        newVisible: false,
        newtype: [],
        newbrand: [],
        unitInput: '',
        standardInput: '',
        nameInput: '',
        newbrandName: '',
        newtypeName: '',
        currentPageNum: 1,
        pageSize: 10,
        totalNum: 1,
        condition: {
            type: [],
            brand: [],
            fitting: '',
        },
        dataSource: [],
    }

    componentDidMount() {
        //发送请求，获取类型选项
        let typeArray = Request.synPost('/part/listPartCate');
        let types = [];
        for (let item of typeArray) {
            const obj = {
                value: item.id,
                label: item.name,
            };
            types.push(obj);
        }
        this.setState({types});
        /*fetch('/part/listPartBrand').then((response)=> {
            return response.json();
        }).then((json)=> {
            if (json.code === '200') {
                let types = [];
                const typeArray = json.data;
                for (let item of typeArray) {
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
        }).catch((err)=> {
            throw err;
        });*/
        //发送请求，获取品牌选项
        let brandArray = Request.synPost('part/listPartBrand');
        let brands = [];
        for (let item of brandArray) {
            const obj = {
                value: item.id,
                label: item.name,
            }
            brands.push(obj);
        }
        this.setState({brands});
        /*fetch('part/listPartCate').then((response)=> {
            return response.json();
        }).then((json)=> {
            if (json.code === '200') {
                let brands = [];
                const brandArray = json.data;
                for (let item of brandArray) {
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
        });*/
        const condition = this.state.condition;
        const currentPageNum = this.state.currentPageNum;
        const pageSize = this.state.pageSize;
        this.handleSearch(condition, 1, pageSize);
    }

    //查询字段 类型 更改时的逻辑
    handleTypeChange(value) {
        let condition = this.state.condition;
        condition.type = value;
        this.setState({condition});
        console.log(value);
    }

    //查询字段 品牌 更改时的逻辑
    handleBrandChange(value) {
        let condition = this.state.condition;
        condition.brand = value;
        this.setState({condition});
        console.log(value);
    }

    //查询字段 配件名称 更改时的逻辑
    handleFittingChange(e) {
        e.preventDefault();
        let condition = this.state.condition;
        condition.fitting = e.target.value;
        this.setState({condition});
    }

    //将从后台获取的字段转换为对应的前端的字段，传入一个数组返回一个数组
    backToFront(backArray){
        let frontArray = [];
        for(let item of backArray){
            const front = {
                key: item.id,
                type: item.cateName || '',
                brand: item.brandName || '',
                name: item.partName || '',
                unit: item.unit || '',
                standard: item.standard || '',
            };
            frontArray.push(front);
        }
        return frontArray;
    }

    //封装的查询的逻辑
    handleSearch(condition, currentPageNum, pageSize){
        const name = condition.fitting;
        const brandId = condition.brand[0];
        const cateId = condition.type[0];
        const currentPage = currentPageNum;
        const dataObj = Request.synPost('/part/listParts',{
            name,
            brandId,
            cateId,
            currentPage,
            pageSize
        });
        const dataArray = dataObj.data;
        const dataSource = this.backToFront.bind(this)(dataArray);
        this.setState({
            dataSource: dataSource,
            totalNum:dataObj.tatoalNum,
            currentPageNum: currentPageNum,
            pageSize: dataObj.pageSize,
        });
    }

    //点击查询按钮的逻辑
    clickSearch(){
        this.handleSearch(this.state.condition, 1, this.state.pageSize);
    }

    //点击重置的逻辑
    handleReset(e) {
        e.preventDefault();
        let condition = this.state.condition;
        condition.type = [];
        condition.brand = [];
        condition.fitting = '';
        this.setState({condition});
    }

    //新增选项Popconfirm确定按钮的逻辑
    newOk(e) {
        e.preventDefault();
        const data = Request.synPost('/part/create',{
            name: this.state.nameInput,
            cateId: this.state.newtype[0],
            brandId: this.state.newbrand[0],
            unit: this.state.unitInput,
            standard: this.state.standardInput,
            createUser: 1,
        });
        console.log(`配件ID${data}`);
        message.success('新增成功',1.5);
        this.setState({
            newVisible: false,
            newtype: [],
            newbrand: [],
            unitInput: '',
            standardInput: '',
            nameInput: '',
        });
        this.handleSearch(this.state.condition, this.state.currentPageNum,this.state.pageSize);
    }

    //新增选项Popconfirm取消按钮的逻辑
    newCancel(e) {
        e.preventDefault();
        this.setState({
            newVisible: false,
            newtype: [],
            newbrand: [],
            unitInput: '',
            standardInput: '',
        });
    }

    //点击分页的逻辑
    handlePageChange(page, pageSize){
        this.handleSearch(this.state.condition, page, pageSize);
    }

    //新增类型pop确定按钮的逻辑
    typePopOk(){
        if(!this.state.newtypeName){
            message.warning('请输入类型名称');
            return;
        }
        Request.synPost('/part/addCate',{
            createUser: 1,
            CateName: this.state.newtypeName
        });
        message.success('新增成功',1.5);
        let typeArray = Request.synPost('/part/listPartCate');
        let types = [];
        for (let item of typeArray) {
            const obj = {
                value: item.id,
                label: item.name,
            };
            types.push(obj);
        }
        this.setState({
            types,
            newtypeVisible: false,
            newtypeName: '',
        });
    }

    //新增品牌pop确定按钮的逻辑
    brandPopOk(){
        if(!this.state.newbrandName){
            message.warning('请输入品牌名称');
            return;
        }
        Request.synPost('/part/addBrand',{
            createUser: 1,
            brandName: this.state.newbrandName
        });
        message.success('新增成功',1.5);
        let brandArray = Request.synPost('/part/listPartBrand');
        let brands = [];
        for (let item of brandArray) {
            const obj = {
                value: item.id,
                label: item.name,
            }
            brands.push(obj);
        }
        this.setState({
            brands,
            newbrandVisible: false,
            newbrandName: '',
        });
    }

    //点击删除按钮的逻辑
    handleFittingDel(id){
        Request.synPost('/part/delete',{id});
        message.success('删除成功',1.5);
        this.handleSearch(this.state.condition, this.state.currentPageNum,this.state.pageSize);
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
                        onChange={(value)=>{this.setState({newtype: value})}}
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
                        onChange={(value)=>{this.setState({newbrand: value})}}
                    />
                </FormItem>
                <FormItem
                    label="名称"
                    {...popFormLayout}
                >
                    <Input
                        onChange={(e)=> {
                            this.setState({nameInput: e.target.value})
                        }}
                        value={this.state.nameInput}
                    />
                </FormItem>
                <FormItem
                    label="单位"
                    {...popFormLayout}
                >
                    <Input
                        onChange={(e)=> {
                            this.setState({unitInput: e.target.value})
                        }}
                        value={this.state.unitInput}
                    />
                </FormItem>
                <FormItem
                    label="规格"
                    {...popFormLayout}
                >
                    <Input
                        onChange={(e)=> {
                            this.setState({standardInput: e.target.value})
                        }}
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
                    <Input
                        value={this.state.newbrandName}
                        onChange={(e)=> {
                            this.setState({newbrandName: e.target.value})
                        }}
                    />
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
                    <Input
                        value={this.state.newtypeName}
                        onChange={(e)=> {
                            this.setState({newtypeName: e.target.value})
                        }}
                    />
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
                                value={this.state.condition.type}
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
                                value={this.state.condition.brand}
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
                                value={this.state.condition.fitting}
                                onChange={this.handleFittingChange.bind(this)}
                            />
                        </FormItem>
                    </Col>
                </Row>
                <Row type='flex' justify='end' gutter={10}>
                    <Col>
                        <Button type="primary" onClick={this.clickSearch.bind(this)}>查询</Button>
                    </Col>
                    <Col>
                        <Popconfirm
                            placement="bottomRight"
                            title={newTypePop}
                            okText="提交"
                            cancelText="取消"
                            onConfirm={this.typePopOk.bind(this)}
                            onCancel={()=> {
                                this.setState({
                                    newtypeVisible: false,
                                    newtypeName: '',
                                });
                            }}
                            visible={this.state.newtypeVisible}
                            overlayStyle={{width: '260px'}}
                        >
                            <Button
                                onClick={(e)=> {
                                    e.preventDefault();
                                    this.setState({
                                        newtypeVisible: true,
                                        newbrandVisible: false,
                                        newVisible: false,
                                        newbrandName: '',
                                        newtype: [],
                                        newbrand: [],
                                        unitInput: '',
                                        standardInput: '',
                                        nameInput: '',
                                    });
                                }}
                            >
                                新增类型
                            </Button>
                        </Popconfirm>
                    </Col>
                    <Col>
                        <Popconfirm
                            placement="bottomRight"
                            title={newBrandPop}
                            okText="提交"
                            cancelText="取消"
                            onConfirm={this.brandPopOk.bind(this)}
                            onCancel={()=> {
                                this.setState({
                                    newbrandVisible: false,
                                    newbrandName: '',
                                });
                            }}
                            visible={this.state.newbrandVisible}
                            overlayStyle={{width: '260px'}}
                        >
                            <Button
                                onClick={(e)=> {
                                    e.preventDefault();
                                    this.setState({
                                        newbrandVisible: true,
                                        newtypeVisible: false,
                                        newVisible: false,
                                        newtypeName: '',
                                        newtype: [],
                                        newbrand: [],
                                        unitInput: '',
                                        standardInput: '',
                                        nameInput: '',
                                    });
                                }}
                            >
                                新增品牌
                            </Button>
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
                            <Button
                                onClick={(e)=> {
                                    e.preventDefault();
                                    this.setState({
                                        newVisible: true,
                                        newtypeVisible: false,
                                        newbrandVisible: false,
                                        newbrandName: '',
                                        newtypeName: '',
                                    });
                                }}
                            >
                                新增
                            </Button>
                        </Popconfirm>
                    </Col>
                    <Col>
                        <Button type="dashed" onClick={this.handleReset.bind(this)}>重置</Button>
                    </Col>
                </Row>
                <Table
                    dataSource={this.state.dataSource}
                    columns={this.state.columns}
                    pagination={{
                        current: this.state.currentPageNum,
                        pageSize: this.state.pageSize,
                        total: this.state.totalNum,
                        onChange: (page, pageSize)=>{
                            this.handlePageChange.bind(this)(page, pageSize)
                        },
                        showTotal: (total, range)=>{
                            const pageSize = this.state.pageSize;
                            const totalPage = Math.ceil(Number(total)/Number(pageSize));
                            return `共${totalPage}页 / 共${total}条`;
                        }
                    }}
                />
            </div>
        );
    }
}

export default Fitting;