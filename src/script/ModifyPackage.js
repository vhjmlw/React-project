import { Tabs, Form, Input, Button, Select, Tag, Popconfirm, message } from 'antd';
import React from 'react';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

function handleChange(value) {
    console.log(`selected ${value}`);
}

const categoryDate = ['机油', '机滤'];
const brandData = {
    '机油': ['潍柴动力', '金龙鱼', '双龙鱼'],
    '机滤': ['机滤品牌1', '机滤品牌2', '机滤品牌3'],
};

class PackageInfoForm extends React.Component {
    state = {
        confirmDirty: false,
        tags: [],
        brands: brandData[categoryDate[0]],
        brandValue: brandData[categoryDate[0]][0],
        visible: false,
        categoryValue: categoryDate[0],
        numberValue: '0',
        unitValue: '个',
    };

    componentWillMount(){
        let modifyPackage = window.localStorage.getItem("modifyPackage");
        modifyPackage = JSON.parse(modifyPackage);
        this.setState({
            packageName: modifyPackage.packageName,
            packagePrice: modifyPackage.packagePrice,
            packageItem: modifyPackage.packageItem,
            tags: modifyPackage.packageAccessory,
            key: modifyPackage.key,
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                if(this.state.tags.length === 0){
                    message.error("请选择配件");
                    return;
                } else {
                    let packageList = window.localStorage.getItem("packageList");
                    packageList = JSON.parse(packageList);
                    for(let item of packageList){
                        if(item.key === this.state.key){
                            Object.assign(item,{packageAccessory:this.state.tags, ...values});
                            break;
                        }
                    }
                    window.localStorage.setItem('packageList',JSON.stringify(packageList));
                    message.success('保存成功', 1.5, ()=>{this.props.changeRoute(null,'/App/PackageList')});
                }
            }
        });
    }

    handleTagClose = (removedTag) => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        console.log(tags);
        this.setState({ tags });
    }

    handleCategoryChange = (value) => {
        this.setState({
            brands: brandData[value],
            brandValue: brandData[value][0],
            categoryValue: value,
        });
    }

    handleBrandChange = (value) => {
        this.setState({
            brandValue: value,
        });
    }

    handleNumberChange(e){
        this.setState({
            numberValue: e.target.value,
        });
    }

    handleUnitChange(value){
        this.setState({
            unitValue: value,
        });
    }

    handleOK(){
        const numberValue = Number(this.state.numberValue);
        if(isNaN(numberValue)){
            message.error('数量输入的格式有误');
            return;
        } else if (numberValue === 0){
            message.error('请输入数量');
            return;
        }
        const {categoryValue, brandValue, unitValue} = this.state;
        const newTag = brandValue + categoryValue + numberValue + unitValue;
        console.log(newTag);
        let tags = this.state.tags;
        if(tags.indexOf(newTag) === -1){
            tags = [...tags,newTag];
        }
        this.setState({
            tags,
            visible: false,
            categoryValue: categoryDate[0],
            brandValue: brandData[categoryDate[0]][0],
            numberValue: '0',
            unitValue: '个',
            brands: brandData[categoryDate[0]],
        });
    }

    handleCancel(){
        this.setState({
            visible: false,
            categoryValue: categoryDate[0],
            brandValue: brandData[categoryDate[0]][0],
            numberValue: '0',
            unitValue: '个',
            brands: brandData[categoryDate[0]],
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                span: 14,
                offset: 6,
            },
        };

        const categoryOptions = categoryDate.map(category => <Option key={category}>{category}</Option>);
        const brandOptions = this.state.brands.map(brand => <Option key={brand}>{brand}</Option>);
        const confirmDOM = (
            <Form>
                <FormItem
                    label="类别"
                    {...formItemLayout}
                >
                    <Select
                        value={this.state.categoryValue}
                        style={{ width: 90 }}
                        onChange={this.handleCategoryChange}
                    >
                        {categoryOptions}
                    </Select>
                </FormItem>
                <FormItem
                    label="品牌"
                    {...formItemLayout}
                >
                    <Select
                        value={this.state.brandValue}
                        style={{ width: 90 }}
                        onChange={this.handleBrandChange}
                    >
                        {brandOptions}
                    </Select>
                </FormItem>
                <FormItem
                    label="数量"
                    {...formItemLayout}
                >
                    <span>
                        <Input
                            type="text"
                            size='large'
                            value={this.state.numberValue}
                            onChange={this.handleNumberChange.bind(this)}
                            style={{ width: '65%', marginRight: '3%' }}
                        />
                        <Select
                            value = {this.state.unitValue}
                            style={{ width: '32%' }}
                            onChange={this.handleUnitChange.bind(this)}
                        >
                          <Option value="个">个</Option>
                          <Option value="L">L</Option>
                          <Option value="次">次</Option>
                        </Select>
                    </span>
                </FormItem>
            </Form>
        );

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="名称"
                    hasFeedback
                >
                    {getFieldDecorator('packageName', {
                        rules: [{
                            required: true, message: '请输入名称',
                        }],
                        initialValue: this.state.packageName,
                    })(
                        <Input placeholder="请输入名称"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="价格"
                    hasFeedback
                >
                    {getFieldDecorator('packagePrice', {
                        rules: [{
                            required: true, message: '请输入价格',
                        }],
                        initialValue: this.state.packagePrice,
                    })(
                        <Input placeholder="请输入价格"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="服务项目"
                >
                    {getFieldDecorator('packageItem', {
                        rules: [{
                            required: true, message: '请选择服务项目'
                        }],
                        initialValue: this.state.packageItem,
                    })(
                        <Select
                            multiple
                            style={{ width: '100%' }}
                            placeholder="请选择服务项目"
                            onChange={handleChange}
                        >
                            <Option value='更换机油'>更换机油</Option>
                            <Option value='更换机滤'>更换机滤</Option>
                            <Option value='发动机舱清洗'>发动机舱清洗</Option>
                            <Option value='更换轮胎'>更换轮胎</Option>
                            <Option value='清洗车身'>清洗车身</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label='配件'
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
                            onConfirm={this.handleOK.bind(this)}
                            onCancel={this.handleCancel.bind(this)}
                            title={confirmDOM}
                            okText="确定"
                            cancelText="取消"
                            visible={this.state.visible}
                        >
                            <Button type="primary" size="small" onClick={()=>this.setState({visible:true})}>+</Button>
                        </Popconfirm>
                    </div>
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" size="large">保存</Button>
                </FormItem>
            </Form>
        );
    }
}

const PackageInfo = Form.create()(PackageInfoForm);

class ModifyPackage extends React.Component {
    render(){
        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab="修改" key="1">
                    <PackageInfo changeRoute={this.props.history.pushState} />
                </TabPane>
            </Tabs>
        );
    }
}

export default ModifyPackage;