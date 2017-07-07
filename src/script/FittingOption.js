import React from 'react';
import { Button, Popconfirm, Input, Form, message, Tag } from 'antd';
import CookieUtil from './util/CookieUtil';
import Request from './util/Request';
const FormItem = Form.Item;

class FittingOption extends React.Component {
    state = {
        popCateVisible: false,
        newFittingCate: '',
        cateTypes: [],
        brandTypes: [],
        cateKey: '',
        brandKey: '',
        popBrandVisible: false,
        newFittingBrand: '',
    }

    componentDidMount() {
        let typeArray = Request.synPost('/part/listPartCate');
        let cateTypes = [];
        for (let item of typeArray) {
            const obj = {
                value: item.id,
                label: item.name,
            };
            cateTypes.push(obj);
        }
        this.setState({
            cateTypes,
        });

    }

    popCateOK(){
        if(!this.state.newFittingCate){
            message.warning('请输入配件类型');
            return;
        }
        Request.synPost('/part/addCate',{
            createUser: CookieUtil.getCookie('id'),//获取账号人员的ID;
            CateName: this.state.newFittingCate
        });
        //先占个位置
        let typeArray = Request.synPost('/part/listPartCate');
        let cateTypes = [];
        for (let item of typeArray) {
            const obj = {
                value: item.id,
                label: item.name,
            };
            cateTypes.push(obj);
        }
        this.setState({
            cateTypes,
        });
    }

    handleCatePopOk(cateType){
        this.setState({cateKey: ''})
    }

    handleBrandPopOk(brandType){
        this.setState({brandKey: ''});
    }

    popBrandOK(){

    }

    render(){
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const fittingPop = (
            <Form>
                <h3 style={{marginBottom:'20px'}}>新增配件类型</h3>
                <FormItem
                    label="名称"
                    {...formItemLayout}
                >
                    <Input
                        value={this.state.newFittingCate}
                        onChange={(e)=>{this.setState({newFittingCate:e.target.value})}}
                    />
                </FormItem>
            </Form>
        );
        const fittingBrand = (
            <Form>
                <h3 style={{marginBottom:'20px'}}>新增配件品牌</h3>
                <FormItem
                    label="名称"
                    {...formItemLayout}
                >
                    <Input
                        value={this.state.newFittingBrand}
                        onChange={(e)=>{this.setState({newFittingBrand:e.target.value})}}
                    />
                </FormItem>
            </Form>
        );

        return (
            <Form>
                <FormItem
                    label="类型管理"
                    {...formItemLayout}
                >
                    <div>
                        {this.state.cateTypes.map((cateType)=>{
                            return (
                                <Popconfirm
                                    title={<h3>确定删除 ?</h3>}
                                    okText="确定"
                                    cancelText="取消"
                                    placement="right"
                                    visible={this.state.cateKey === cateType.value}
                                    onConfirm={()=>{this.handleCatePopOk(cateType)}}
                                    onCancel={()=> {
                                        this.setState({cateKey: ''})
                                    }}
                                >
                                    <Tag
                                        key={cateType.value}
                                        closable={true}
                                        onClose={(e)=> {
                                            e.preventDefault();
                                            this.setState({cateKey: cateType.value});
                                        }}
                                    >
                                        {cateType.name}
                                    </Tag>
                                </Popconfirm>
                            );
                        })}
                        <Popconfirm
                            placement="bottom"
                            onConfirm={this.popCateOK.bind(this)}
                            onCancel={()=>{this.setState({newFittingCate:''})}}
                            title={fittingPop}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button type="primary" size="small"
                                    onClick={()=>{this.setState({popCateVisible:true})}}>+</Button>
                        </Popconfirm>
                    </div>
                </FormItem>
                <FormItem
                    label="品牌管理"
                    {...formItemLayout}
                >
                    <div>
                        {this.state.brandTypes.map((brandType)=>{
                            return (
                                <Popconfirm
                                    title={<h3>确定删除 ?</h3>}
                                    okText="确定"
                                    cancelText="取消"
                                    placement="right"
                                    visible={this.state.brandKey === brandType.value}
                                    onConfirm={()=>{this.handleBrandPopOk(brandType)}}
                                    onCancel={()=> {
                                        this.setState({brandKey: ''})
                                    }}
                                >
                                    <Tag
                                        key={brandType.value}
                                        closable={true}
                                        onClose={(e)=> {
                                            e.preventDefault();
                                            this.setState({brandKey: brandType.value});
                                        }}
                                    >
                                        {brandType.name}
                                    </Tag>
                                </Popconfirm>
                            );
                        })}
                        <Popconfirm
                            placement="bottom"
                            onConfirm={this.popBrandOK.bind(this)}
                            onCancel={()=>{this.setState({newFittingBrand:''})}}
                            title={fittingBrand}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button type="primary" size="small"
                                    onClick={()=>{this.setState({popBrandVisible:true})}}>+</Button>
                        </Popconfirm>
                    </div>
                </FormItem>
            </Form>
        );
    }
}

export default FittingOption;