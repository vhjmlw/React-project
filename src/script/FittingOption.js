import React from 'react';
import { Button, Popconfirm, Input, Form, message, Tag } from 'antd';
import CookieUtil from './util/CookieUtil';
import Request from './util/Request';
const FormItem = Form.Item;

class FittingOption extends React.Component {
    state = {
        newFittingCate: '',
        cateTags: [],
        brandTags: [],
        cateKey: '',
        brandKey: '',
        newFittingBrand: '',
    }

    componentDidMount() {
        let typeArray = Request.synPost('/part/listPartCate');
        let cateTags = [];
        if(typeArray && typeArray.length > 0){
            for (let item of typeArray) {
                const obj = {
                    value: item.id,
                    label: item.name,
                };
                cateTags.push(obj);
            }
        }

        let brandArray = Request.synPost('part/listPartBrand');
        let brandTags = [];
        if(brandArray && brandArray.length > 0){
            for (let item of brandArray) {
                const obj = {
                    value: item.id,
                    label: item.name,
                }
                brandTags.push(obj);
            }
        }

        this.setState({
            cateTags,
            brandTags
        });

    }

    handleCatePopOk(cateTag){
        Request.synPost('part/deleteCate',{cateId:cateTag.value});
        let typeArray = Request.synPost('/part/listPartCate');
        let cateTags = [];
        if(typeArray && typeArray.length > 0){
            for (let item of typeArray) {
                const obj = {
                    value: item.id,
                    label: item.name,
                };
                cateTags.push(obj);
            }
        }
        this.setState({cateKey: '',cateTags});
    }

    handleBrandPopOk(brandTag){
        Request.synPost('part/deleteBrand',{brandId:brandTag.value});
        let brandArray = Request.synPost('/part/listPartBrand');
        let brandTags = [];
        if(brandArray && brandArray.length > 0){
            for (let item of brandArray) {
                const obj = {
                    value: item.id,
                    label: item.name,
                }
                brandTags.push(obj);
            }
        }
        this.setState({brandKey: '',brandTags});
    }

    newPopCateOK(){
        if(!this.state.newFittingCate){
            message.warning('请输入配件类型');
            return;
        }
        Request.synPost('/part/addCate',{
            createUser: CookieUtil.getCookie('id'),//获取账号人员的ID;
            CateName: this.state.newFittingCate
        });
        let typeArray = Request.synPost('/part/listPartCate');
        let cateTags = [];
        if(typeArray && typeArray.length > 0){
            for (let item of typeArray) {
                const obj = {
                    value: item.id,
                    label: item.name,
                };
                cateTags.push(obj);
            }
        }
        this.setState({
            cateTags,
            newFittingCate:''
        });
    }

    newPopBrandOK(){
        if(!this.state.newFittingBrand){
            message.warning('请输入配件品牌');
            return;
        }
        Request.synPost('/part/addBrand',{
            createUser: CookieUtil.getCookie('id'),//获取账号人员的ID;
            brandName: this.state.newFittingBrand
        });
        let brandArray = Request.synPost('/part/listPartBrand');
        let brandTags = [];
        if(brandArray && brandArray.length > 0){
            for (let item of brandArray) {
                const obj = {
                    value: item.id,
                    label: item.name,
                }
                brandTags.push(obj);
            }
        }
        this.setState({
            brandTags,
            newFittingBrand: '',
        });
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
                        {this.state.cateTags.map((cateTag)=>{
                            return (
                                <Popconfirm
                                    title={<h3>确定删除 ?</h3>}
                                    okText="确定"
                                    cancelText="取消"
                                    placement="right"
                                    visible={this.state.cateKey === cateTag.value}
                                    onConfirm={()=>{this.handleCatePopOk(cateTag)}}
                                    onCancel={()=> {
                                        this.setState({cateKey: ''})
                                    }}
                                >
                                    <Tag
                                        key={cateTag.value}
                                        closable={true}
                                        onClose={(e)=> {
                                            e.preventDefault();
                                            this.setState({cateKey: cateTag.value});
                                        }}
                                    >
                                        {cateTag.name}
                                    </Tag>
                                </Popconfirm>
                            );
                        })}
                        <Popconfirm
                            placement="bottom"
                            onConfirm={this.newPopCateOK.bind(this)}
                            onCancel={()=>{this.setState({newFittingCate:''})}}
                            title={fittingPop}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button type="primary" size="small">+</Button>
                        </Popconfirm>
                    </div>
                </FormItem>
                <FormItem
                    label="品牌管理"
                    {...formItemLayout}
                >
                    <div>
                        {this.state.brandTags.map((brandTag)=>{
                            return (
                                <Popconfirm
                                    title={<h3>确定删除 ?</h3>}
                                    okText="确定"
                                    cancelText="取消"
                                    placement="right"
                                    visible={this.state.brandKey === brandTag.value}
                                    onConfirm={()=>{this.handleBrandPopOk(brandTag)}}
                                    onCancel={()=> {
                                        this.setState({brandKey: ''})
                                    }}
                                >
                                    <Tag
                                        key={brandTag.value}
                                        closable={true}
                                        onClose={(e)=> {
                                            e.preventDefault();
                                            this.setState({brandKey: brandTag.value});
                                        }}
                                    >
                                        {brandTag.name}
                                    </Tag>
                                </Popconfirm>
                            );
                        })}
                        <Popconfirm
                            placement="bottom"
                            onConfirm={this.newPopBrandOK.bind(this)}
                            onCancel={()=>{this.setState({newFittingBrand:''})}}
                            title={fittingBrand}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button type="primary" size="small">+</Button>
                        </Popconfirm>
                    </div>
                </FormItem>
            </Form>
        );
    }
}

export default FittingOption;