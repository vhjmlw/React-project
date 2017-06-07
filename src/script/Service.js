import React from 'react';
import { Button, Table, Modal, Form, Input, InputNumber, Select, Tag, Popconfirm, Row, Col } from 'antd';
const FormItem = Form.Item;

const dataSource = [{
    key: '1',
    name: '名称一',
    type: '类型一',
    fitting: '配件一',
    createDate: '时间一',
    price: '报价一',
},{
    key: '2',
    name: '名称二',
    type: '类型二',
    fitting: '配件二',
    createDate: '时间二',
    price: '报价二',
},{
    key: '3',
    name: '名称三',
    type: '类型三',
    fitting: '配件三',
    createDate: '时间三',
    price: '报价三',
}];

class Service extends React.Component {

    state = {
        columns: [{
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },{
            title: '类型',
            dataIndex: 'type',
            key: 'type',
        },{
            title: '使用配件',
            dataIndex: 'fitting',
            key: 'fitting',
        },{
            title: '创建时间',
            dataIndex: 'createDate',
            key: 'createDate',
        },{
            title: '服务报价',
            dataIndex: 'price',
            key: 'price',
        },{
            title: '操作',
            key: 'action',
            render: (text,record)=>{
                return (
                    <span>
                        <a href="javascript:;">删除</a>
                        <span className="ant-divider" />
                        <a href="javascript:;">修改</a>
                    </span>
                );
            }
        }],
        popVisible: false,
        modalVisible: false,
        tags: ['hello', 'world', 'helloworld', 'that', 'is', 'awesome'],

    }

    handlePopOK(){

    }

    handlePopCancel(){

    }

    handleModalOk(){
        this.setState({
            modalVisible: false
        });
    }

    handleModalCancel(){
        this.setState({
            modalVisible: false
        });
    }

    handleNewClick(e){
        e.preventDefault();
        this.setState({
            modalVisible: true
        });
    }

    render(){
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 10}
        };
        const formPopLayout = {
            labelCol: {span:6},
            wrapperCol: {span:16}
        }
        const fittingPop = (
            <Form>
                <FormItem
                    label="类型"
                    {...formPopLayout}
                >
                    <Select>
                        <Option value='类型一'>类型一</Option>
                        <Option value='类型二'>类型二</Option>
                    </Select>
                </FormItem>
                <FormItem
                    label="品牌"
                    {...formPopLayout}
                >
                    <Select>
                        <Option value='品牌一'>品牌一</Option>
                        <Option value='品牌二'>品牌二</Option>
                    </Select>
                </FormItem>
                <FormItem
                    label="配件"
                    {...formPopLayout}
                >
                    <Select>
                        <Option value='配件一'>配件一</Option>
                        <Option value='配件二'>配件二</Option>
                    </Select>
                </FormItem>
                <FormItem
                    label="数量"
                    {...formPopLayout}
                >
                    <InputNumber />个
                </FormItem>
            </Form>
            /*<Row>
                <Col
                    span={5}
                >
                    <Select style={{ width: 80 }}>
                        <Option value='类型一'>类型一</Option>
                        <Option value='类型二'>类型二</Option>
                    </Select>
                </Col>
                <Col
                    span={5}
                >
                    <Select style={{ width: 80 }}>
                        <Option value='品牌一'>品牌一</Option>
                        <Option value='品牌二'>品牌二</Option>
                    </Select>
                </Col>
                <Col
                    span={5}
                >
                    <Select style={{ width: 80 }}>
                        <Option value='配件一'>配件一</Option>
                        <Option value='配件二'>配件二</Option>
                    </Select>
                </Col>
                <Col
                    span={5}
                >
                    <InputNumber />个
                </Col>
            </Row>*/
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
                                <Input/>
                            </FormItem>
                            <FormItem
                                label="类型"
                                {...formItemLayout}
                            >
                                <Input/>
                            </FormItem>
                            <FormItem
                                label="使用配件"
                                labelCol= {{span: 8}}
                                wrapperCol= {{span: 16}}
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
                                    title={fittingPop}
                                    okText="提交"
                                    cancelText="取消"
                                    /*visible={this.state.popVisible}*/
                                    overlayStyle={{width:'260px'}}
                                >
                                    <Button type="primary" size="small" onClick={()=>this.setState({popVisible:true})}>+</Button>
                                </Popconfirm>
                            </div>
                            </FormItem>
                            <FormItem
                                label="价格"
                                {...formItemLayout}
                            >
                                <InputNumber/>元
                            </FormItem>
                        </Form>
                    </Modal>
                </div>
                <Table
                    columns={this.state.columns}
                    dataSource={dataSource}
                />
            </div>
        );
    }
}

export default Service;