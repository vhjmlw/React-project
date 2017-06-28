import React from "react";
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import Particle from 'zhihu-particle';
import Request from './util/Request';
import $ from 'jquery';
const FormItem = Form.Item;

class LoginForm extends React.Component {

    setCookie(json) {
        const {name, role, id, username, password} = json;
        document.cookie = `name=${encodeURIComponent(name)};max-age=${7*24*60*60}`;
        document.cookie = `role=${encodeURIComponent(role)};max-age=${7*24*60*60}`;
        document.cookie = `id=${encodeURIComponent(id)};max-age=${7*24*60*60}`;
        document.cookie = `username=${encodeURIComponent(username)};max-age=${7*24*60*60}`;
        document.cookie = `password=${encodeURIComponent(password)};max-age=${7*24*60*60}`;
    }

    getCookie(name) {
        let arr;
        const reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg)){
            return decodeURIComponent(arr[2]);
        } else {
            return null;
        }
    }

    delCookie(name) {
        var value = this.getCookie(name);
        if(value){
            document.cookie= name + "="+value+";max-age=0";
        }
    }

    componentDidMount(){
        const username = this.getCookie('username');
        const password = this.getCookie('password');
        if(username && password){
            this.props.form.setFieldsValue({
                username,
                password,
            });
        }
    }

    handleSubmit(e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                $.ajax({
                    type: 'POST',
                    data: {username: values.username,password: values.password},
                    dataType: 'json',
                    url: 'user/find',
                    success: (response)=>{
                        if(response.code === '200' && response.data){
                            const userData = response.data;
                            this.setCookie({
                                name: userData.name,
                                role: userData.role,
                                id: userData.id,
                                username: userData.username,
                                password: userData.password,
                            });
                            this.props.history.pushState(null,'App');
                            //先占个位置
                        } else {
                            message.error('用户名或密码错误');
                        }
                    },
                    error: (err)=>{
                        throw err;
                    }
                });


                /*fetch(`/user/login?username=${values.username}&password=${values.password}`).then((response)=>{
                    return response.json();
                }).then((json)=>{
                    if(json.code === '200' && json.data){
                        Object.assign(json.data, values);
                        this.setCookie(json.data);
                        let role = json.data.role;
                        if (role == "总监") {
                            this.props.changeRoute(null, `App/TeamDistribution`);
                        } else if (role == "团队长") {
                            this.props.changeRoute(null, `App/SalesmanDistribution`);
                        } else if (role == "业务员") {
                            this.props.changeRoute(null, `App/SearchList`);
                        }
                    } else {
                        message.warning('用户名或密码错误');
                    }
                }).catch((error)=>{
                    throw error;
                });*/
            }
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
                <FormItem>
                    {
                        getFieldDecorator('username',{
                            rules: [
                                {required: true, message: '请输入用户名'}
                            ]
                        })(
                            <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="用户名"/>
                        )
                    }
                </FormItem>
                <FormItem>
                    {
                        getFieldDecorator('password',{
                            rules: [
                                {required: true, message: '请输入密码'}
                            ]
                        })(
                            <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>}
                                   type="password"
                                   placeholder="密码"
                            />
                        )
                    }
                </FormItem>
                <FormItem>
                    {/*<Checkbox>记住登录</Checkbox>*/}
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登录
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

const LoginClass = Form.create()(LoginForm);

class Login extends React.Component {

    state = {};

    componentDidMount(){
        new Particle(document.getElementById('canvasDiv'), {
            atomColor: '#E4E5E6',
            interactive: false,
            density: 'medium',
        });
    }

    render() {
        return (
            <div style={{width:'100%', height:'100%'}}>
                <div className="LoginCenter">
                    <div className="LoginTitle">
                        <h1>优典养车</h1>
                    </div>
                    <div>
                        <LoginClass changeRoute={this.props.history.pushState}/>
                    </div>
                </div>
                <div id="canvasDiv" style={{width:'100%', height:'100%'}}></div>
            </div>
        );
    }
}

export default Login;
