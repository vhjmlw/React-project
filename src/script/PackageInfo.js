import { Tabs, Form, Icon, Input, Button, Select } from 'antd';
import React from 'react';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

function callback(key) {
    console.log(key);
}

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

function handleChange(value) {
    console.log(`selected ${value}`);
}

class PackageInfoForm extends React.Component {
    state = {
        confirmDirty: false,
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
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
                    {getFieldDecorator('packageAccessory', {
                        rules: [{
                            required: true
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" size="large">保存</Button>
                </FormItem>
            </Form>
        );
    }
}

const PackageInfoComp = Form.create()(PackageInfoForm);

class PackageInfo extends React.Component {
    render(){
        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab="添加" key="1">
                    <PackageInfoComp />
                </TabPane>
            </Tabs>
        );
    }
}

export default PackageInfo;