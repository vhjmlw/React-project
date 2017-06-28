import React from 'react';
import { Row, Col, Form, Input, Button, Cascader, Table, Select, Popconfirm, InputNumber, message } from 'antd';
import Request from './util/Request';
const FormItem = Form.Item;
const Option = Select.Option;

class RunningStock extends React.Component {
    state = {
        columns: [{
            title: '技师',
            dataIndex: 'server',
            key: 'server',
        }, {
            title: '类别',
            dataIndex: 'cate',
            key: 'cate',
        }, {
            title: '品牌',
            dataIndex: 'brand',
            key: 'brand',
        }, {
            title: '名称',
            dataIndex: 'part',
            key: 'part',
        }, {
            title: '规格',
            dataIndex: 'standard',
            key: 'standard',
        }, {
            title: '编号',
            dataIndex: 'serialNumber',
            key: 'serialNumber',
        }, {
            title: '单位',
            dataIndex: 'unit',
            key: 'unit',
        }, {
            title: '满仓数',
            dataIndex: 'fullNum',
            key: 'fullNum',
        }, {
            title: '现存数',
            dataIndex: 'handinventory',
            key: 'handinventory',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record)=>{
                const addPopConfirm = (
                    <Form>
                        <h3>请输出入库数量</h3>
                        <FormItem
                            label="数量"
                            labelCol={{span:8}}
                            wrapperCol={{span:16}}
                        >
                            <InputNumber
                                min={0}
                                value={this.state.addStockNum}
                                onChange={(value)=>{this.setState({addStockNum:value})}}
                            />
                        </FormItem>
                    </Form>
                );
                const delPopConfirm = (
                    <Form>
                        <h3>请输入出库数量</h3>
                        <FormItem
                            label="数量"
                            labelCol={{span:8}}
                            wrapperCol={{span:16}}
                        >
                            <InputNumber
                                min={0}
                                value={this.state.delStockNum}
                                onChange={(value)=>{this.setState({delStockNum:value})}}
                            />
                        </FormItem>
                    </Form>
                );
                return (
                    <span>
                        <Popconfirm
                            title={addPopConfirm}
                            okText="确定"
                            cancelText="取消"
                            onConfirm={(e)=>{this.addStock(record)}}
                            onCancel={()=>{this.setState({addStockNum:0})}}
                        >
                            <a href="javascript:;">入库</a>
                        </Popconfirm>
                        <span className="ant-divider"/>
                        <Popconfirm
                            title={delPopConfirm}
                            okText="确定"
                            cancelText="取消"
                            onConfirm={()=>{console.log('确定')}}
                            onCancel={()=>{this.setState({delStockNum:0})}}
                        >
                            <a href="javascript:;">出库</a>
                        </Popconfirm>
                    </span>
                );
            }
        }],
        condition: {
            server: [],
            cate: [],
            brand: [],
            part: [],
            serialNumber: '',
            supplyOrNot: '',
        },
        serverArr: [],
        cateArr: [],
        brandArr: [],
        partArr: [],
        currentPageNum: 1,
        pageSize: 10,
        totalNum: 1,
        partDisabled: true,
        dataSource: [],
        addStockNum: 0,
        delStockNum: 0,
    }

    componentDidMount() {
        const serverData = Request.synPost('technician/findByRegionIdAndLeaderId',{
            regionId: 2,
            leaderId: 1,
        });
        let serverArr = [];
        if(serverData && serverData.length > 0){
            for(let item of serverData){
                let obj = {
                    value: item.userId,
                    label: item.name,
                }
                serverArr.push(obj);
            }
        }

        const cateData = Request.synPost('part/listPartCate');
        let cateArr = [];
        if(cateData && cateData.length > 0){
            for(let item of cateData){
                let obj = {
                    value: item.id,
                    label: item.name,
                }
                cateArr.push(obj);
            }
        }

        const brandData = Request.synPost('part/listPartBrand');
        let brandArr = [];
        if(brandData && brandData.length > 0){
            for(let item of brandData){
                let obj = {
                    value: item.id,
                    label: item.name,
                }
                brandArr.push(obj);
            }
        }
        this.setState({brandArr,serverArr,cateArr});
        this.handleSearch(this.state.condition, 1, this.state.pageSize);
    }

    //入库的逻辑
    addStock(record){
        const addStockNum = this.state.addStockNum;
        if(!addStockNum){
            message.warning('请输入入库数量');
            return;
        }
        const partId = record.partId;
        const technicianId = record.technicianId;
        const response = Request.synPost('technicianInventory/addCommonStorage',{
            partId,
            technicianId,
            num: addStockNum,
            userId: 1,
        });
        this.handleSearch(this.state.condition, this.state.currentPageNum, this.state.pageSize);
    }

    //更改查询条件this.state.condition的逻辑
    changeCondition(obj){
        let condition = this.state.condition;
        condition = Object.assign(condition, obj);
        this.setState({condition});
    }

    //点击分页的逻辑
    handlePageChange(page, pageSize){
        this.handleSearch(this.state.condition,page, pageSize);
    }

    //查询列表的逻辑
    handleSearch(condition, currentPageNum, pageSize){
        const technicianId = condition.server[0];
        const partCateId = condition.cate[0];
        const partBrandId = condition.brand[0];
        const partId = condition.part[0];
        const serialNumber = condition.serialNumber;
        const isNotFull = condition.supplyOrNot;
        const regionId = 1;
        const backData = Request.synPost('technicianInventory/listCommonStorage',{
            technicianId,
            partCateId,
            partBrandId,
            partId,
            serialNumber,
            isNotFull,
            regionId,
            pageSize,
            currentPage: currentPageNum,
        });
        const backArr = backData.commonStorages;
        let frontArr = [];
        if(backArr && backArr.length > 0){
            frontArr = this.backToFront(backArr);
        }
        this.setState({
            dataSource: frontArr,
            currentPageNum: currentPageNum,
            pageSize: backData.pageSize,
            totalNum: backData.totalRows,
        });
    }

    //将从后台请求的字段转换为前端字段的逻辑
    backToFront(backArr){
        let frontArr = [];
        for(let item of backArr){
            let obj = {
                server: item.technicianName,
                cate: item.partCateName,
                brand: item.partBrandName,
                part: item.partName,
                standard: item.standard,
                serialNumber: item.serialNumber,
                unit: item.unit,
                fullNum: item.fullNum,
                handinventory: item.handinventory,
                partId: item.partId,
                technicianId: item.technicianId
            }
            frontArr.push(obj);
        }
        return frontArr;
    }

    //重置按钮的逻辑
    resetSearch(e){
        e.preventDefault();
        this.setState({
            condition: {
                server: [],
                cate: [],
                brand: [],
                part: [],
                serialNumber: '',
                supplyOrNot: '',
            },
            partDisabled:true
        });
    }

    //查询字段 配件类别 更改的逻辑，配件类别改变时，根据配件类别和品牌查询配件名称
    handleCateChange(value){
        this.changeCondition({cate:value});
        const partData = Request.synPost('part/listParts',{
            brandId: this.state.condition.brand[0],
            cateId: value[0],
        });
        const partDataArr = partData.data;
        let partArr = [];
        if(partDataArr && partDataArr.length > 0){
            for(let item of partDataArr){
                let obj = {
                    value: item.id,
                    label: item.partName + item.standard,
                }
                partArr.push(obj);
            }
        }
        if(partArr.length > 0){
            this.setState({partArr, partDisabled:false});
        } else {
            this.setState({partArr, partDisabled:true});
        }

    }

    //查询字段 配件品牌 更改的逻辑，配件品牌改变时，根据配件类别和品牌查询配件名称
    handleBrandChange(value){
        this.changeCondition({brand:value});
        const partData = Request.synPost('part/listParts',{
            brandId: value[0],
            cateId: this.state.condition.cate[0],
        });
        const partDataArr = partData.data;
        let partArr = [];
        if(partDataArr && partDataArr.length > 0){
            for(let item of partDataArr){
                let obj = {
                    value: item.id,
                    label: item.partName + item.standard,
                }
                partArr.push(obj);
            }
        }
        if(partArr.length > 0){
            this.setState({partArr, partDisabled:false});
        } else {
            this.setState({partArr, partDisabled:true});
        }

    }

    render(){
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
        };

        return(
            <div>
                <Row gutter={16}>
                    <Col
                        span={6}
                    >
                        <FormItem
                            label="技师"
                            {...formItemLayout}
                        >
                            <Cascader
                                placeholder='请选择技师'
                                options={this.state.serverArr}
                                value={this.state.condition.server}
                                onChange={(value)=>{this.changeCondition({server:value})}}
                            />
                        </FormItem>
                    </Col>
                    <Col
                        span={6}
                    >
                        <FormItem
                            label="配件类别"
                            {...formItemLayout}
                        >
                            <Cascader
                                placeholder='请选择配件类别'
                                options={this.state.cateArr}
                                value={this.state.condition.cate}
                                onChange={(value)=>{this.handleCateChange(value)}}
                            />
                        </FormItem>
                    </Col>
                    <Col
                        span={6}
                    >
                        <FormItem
                            label="配件品牌"
                            {...formItemLayout}
                        >
                            <Cascader
                                placeholder='请选择配件品牌'
                                options={this.state.brandArr}
                                value={this.state.condition.brand}
                                onChange={(value)=>{this.handleBrandChange(value)}}
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
                            <Cascader
                                placeholder='请选择配件名称'
                                style={{width:'200px'}}
                                disabled={this.state.partDisabled}
                                options={this.state.partArr}
                                value={this.state.condition.part}
                                onChange={(value)=>{this.changeCondition({part:value})}}
                            />
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col
                        span={6}
                    >
                        <FormItem
                            label="配件编号"
                            {...formItemLayout}
                        >
                            <Input
                                placeholder='请输入配件编号'
                                value={this.state.condition.serialNumber}
                                onChange={(e)=>{this.changeCondition({serialNumber:e.target.value})}}
                            />
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            label="需要补仓"
                            {...formItemLayout}
                        >
                            <Select
                                style={{ width: 120 }}
                                value={this.state.condition.supplyOrNot}
                                onChange={(value)=>{this.changeCondition({supplyOrNot:value})}}
                                placeholder="是否需要补仓"
                            >
                                <Option value={1}>是</Option>
                                <Option value={0}>否</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={6} offset={6}>
                        <Button type="primary" onClick={(e)=> {this.resetSearch(e)}}>重置</Button>
                        <Button type="primary" onClick={(e)=>{this.handleSearch(this.state.condition,1,10)}}>查询</Button>
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
                            this.handlePageChange(page, pageSize)
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

export default RunningStock;