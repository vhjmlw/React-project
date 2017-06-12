import React from 'react';
import {Button, Form, Popconfirm, Tag, Cascader, InputNumber, message} from 'antd';
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
    }

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

        const tag = `${popType[0]}/${popBrand[0]}/${popName[0]}/${popStandard[0]}/${popAmount}*${popPrice}元`;
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

        return (
            <Form className="BillInfo">
                <FormItem
                    label="服务技师"
                    {...formItemLayout}
                >
                    <span>尤雨溪</span>
                </FormItem>
                <FormItem
                    label="工单创建日期"
                    {...formItemLayout}
                >
                    <span>2017-06-04</span>
                </FormItem>
                <FormItem
                    label="服务时间"
                    {...formItemLayout}
                >
                    <span>2017-06-07</span>
                </FormItem>
                <FormItem
                    label="服务地址"
                    {...formItemLayout}
                >
                    <span>苏州市高新区何山路268号</span>
                </FormItem>
                <FormItem
                    label="车牌"
                    {...formItemLayout}
                >
                    <span>苏NHF562</span>
                </FormItem>
                <FormItem
                    label="车型"
                    {...formItemLayout}
                >
                    <span>通用 别克 君威1.6T 2016款</span>
                </FormItem>
                <FormItem
                    label="收卡渠道"
                    {...formItemLayout}
                >
                    <span>苏州平安</span>
                </FormItem>
                <FormItem
                    label="服务产品"
                    {...formItemLayout}
                >
                    <span>爱保养A套餐</span>
                </FormItem>
                <FormItem
                    label="服务内容"
                    {...formItemLayout}
                >
                    <span>更换机油</span><br/>
                    <span>更换机滤</span>
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
                    <Popconfirm
                        onConfirm={()=>{console.log('收单')}}
                        title="确定收单"
                    >
                        <Button type="primary">收单</Button>
                    </Popconfirm>
                    <Popconfirm
                        onConfirm={()=>{this.props.history.pushState(null,'/App/BillList')}}
                        title='确定返回'
                    >
                        <Button type="primary">返回</Button>
                    </Popconfirm>
                </FormItem>
            </Form>
        );
    }
}

export default BillInfo;