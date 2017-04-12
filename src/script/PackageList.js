import {Table,Button} from "antd";
import React from "react";

const packageList = [
    {
        packageName: '保养套餐1',
        packagePrice: '666',
        packageItem: '发动机清洗',
        packageAccessory: '东风机滤一个',
        key: new Date().getTime(),
    },
];

class PackageList extends React.Component{
    state = {
        columns: [{
            title: '名称',
            dataIndex: 'packageName',
            key: 'packageName',
        }, {
            title: '价格',
            dataIndex: 'packagePrice',
            key: 'packagePrice',
        }, {
            title: '服务项目',
            dataIndex: 'packageItem',
            key: 'packageItem',
        }, {
            title: '配件',
            dataIndex: 'packageAccessory',
            key: 'packageAccessory',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => {
                return (<span>
                    <a onClick={this.handleModify(record).bind(this)}>修改</a>
                </span>)
            },
        }]
    };

    handleModify(record) {
        return function () {
            this.props.history.pushState(null,"/App/ModifyInfo");
            window.localStorage.setItem('totalInfo',JSON.stringify(record));
            console.log(window.localStorage);
        }
    }

    //点击新增按钮的执行逻辑，<Button><Link to='App/PackageInfo'>新增</Link></Button>会有浏览器兼容性问题
    //火狐 IE浏览器下点击新增无效，页面无法跳转，所以使用onClick点击事件的方式
    handleClick (event) {
        event.preventDefault();
        // browserHistory.push("/App/MyForm");
        this.props.history.pushState(null, "/App/PackageInfo");//API已经过时了，但是暂时想不出其他的解决办法
    }

    render(){
        console.log(JSON.parse(window.localStorage.getItem("packageList")));
        let packageList = JSON.parse(window.localStorage.getItem('packageList'));
        if(packageList){
            packageList = packageList.map((item)=>{
                item.packageItem = item.packageItem.join(" - ");
                item.packageAccessory = item.packageAccessory.join(" - ");
                return item;
            });
        }
        return (
            <div className="antd-layout-OrderList">
                <div className="clearfix">
                    <Button type="primary" onClick={this.handleClick.bind(this)}>添加</Button>
                </div>
                <Table columns={this.state.columns} dataSource={packageList} />
            </div>
        );
    }
}

export default PackageList;
