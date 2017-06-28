import React from 'react';
import {Input, Table, Button, Form, Row, Col, Cascader, DatePicker, Popconfirm} from 'antd';
import moment from 'moment';
import Request from './util/Request';
import BillInfo from './BillInfo';
import $ from 'jquery';
const FormItem = Form.Item;
const {RangePicker} = DatePicker;

/*const dataSource = [{
    key: '1',
    server: '尤玉溪',
    plateNum: '苏NYR808',
    phoneNum: '15236547854',
    date: '2017-06-07',
    address: '苏州市姑苏区人民路152号',
    channel: '上门',
    status: '待服务',
},{
    key: '2',
    server: '尤玉溪',
    plateNum: '苏NYR808',
    phoneNum: '15236547854',
    date: '2017-06-07',
    address: '苏州市姑苏区人民路152号',
    channel: '上门',
    status: '待服务',
},{
    key: '3',
    server: '尤玉溪',
    plateNum: '苏NYR808',
    phoneNum: '15236547854',
    date: '2017-06-07',
    address: '苏州市姑苏区人民路152号',
    channel: '上门',
    status: '待服务',
},{
    key: '4',
    server: '尤玉溪',
    plateNum: '苏NYR808',
    phoneNum: '15236547854',
    date: '2017-06-07',
    address: '苏州市姑苏区人民路152号',
    channel: '上门',
    status: '待服务',
}];*/
/*const servers = [{
    value: '尤玉溪',
    label: '尤玉溪',
},{
    value: '贺师俊',
    label: '贺师俊',
}];*/
const statuses = [{
    value: 0,
    label: '新建',
},{
    value: 1,
    label: '待服务',
},{
    value: 2,
    label: '已服务',
},{
    value: 3,
    label: '已收单',
},{
    value: 9,
    label: '删除',
}];
/*const channels = [{
    value: '上门',
    label: '上门',
},{
    value: '自取',
    label: '自取',
}];*/

class BillList extends React.Component {

    state = {
        columns: [{
            title: '客户车牌',
            dataIndex: 'plateNum',
            key: 'plateNum',
        }, {
            title: '客户姓名',
            dataIndex: 'customer',
            key: 'customer',
        }, {
            title: '客户手机号',
            dataIndex: 'phoneNum',
            key: 'phoneNum',
        }, {
            title: '服务日期',
            dataIndex: 'date',
            key: 'date',
        }, {
            title: '做单地址',
            dataIndex: 'address',
            key: 'address',
        }, {
            title: '发卡渠道',
            dataIndex: 'channel',
            key: 'channel',
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
        }, {
            title: '技师',
            dataIndex: 'server',
            key: 'server',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record, index)=> {
                //点击分配弹出气泡的HTML内容
                const allotPop = (
                    <div>
                        <h3 style={{marginBottom:'25px'}}>分配技师</h3>
                        <FormItem
                            label="技师"
                            labelCol={{span:8}}
                            wrapperCol={{span:16}}
                        >
                            <Cascader
                                options={this.state.servers}
                                placeholder=''
                                value={this.state.popChannel}
                                onChange={(value)=>{this.setState({popChannel:value})}}
                            />
                        </FormItem>
                    </div>
                );
                //重新分配的HTML内容
                const afresh = (
                    <Popconfirm
                        title={allotPop}
                        visible={this.state.key===record.key}
                        onConfirm={()=>{this.allotOk(record)}}
                        onCancel={()=>{this.setState({key:0,popChannel:[]})}}
                    >
                        <a onClick={()=>{this.setState({key:record.key})}}>重新分配</a>
                    </Popconfirm>
                );
                //分配的HTML内容
                const allot = (
                    <Popconfirm
                        title={allotPop}
                        visible={this.state.key===record.key}
                        onConfirm={()=>{this.allotOk(record)}}
                        onCancel={()=>{this.setState({key:0,popChannel:[]})}}
                    >
                        <a onClick={()=>{this.setState({key:record.key})}}>分配</a>
                    </Popconfirm>
                );
                //收单的HTML内容
                const over = (
                    <a onClick={()=>{this.changeShowDetail.bind(this)(record.key)}}>收单</a>
                );
                if (record.status === '新建') {
                    return (
                        <span>
                            {allot}
                            <span className="ant-divider"/>
                            <a onClick={()=>{this.downloadOrder([record.key])}}>下载</a>
                        </span>
                    );
                } else if (record.status === '待服务') {
                    return (
                        <span>
                            {over}
                            <span className="ant-divider"/>
                            {afresh}
                            <span className="ant-divider"/>
                            <a onClick={()=>{this.downloadOrder([record.key])}}>下载</a>
                        </span>
                    );
                } else if (record.status === '已收单') {
                    return (
                        <span>
                            {over}
                            <span className="ant-divider"/>
                            <a onClick={()=>{this.downloadOrder([record.key])}}>下载</a>
                        </span>
                    );
                }
                /*return (
                    <span>
                        {over}
                        <span className="ant-divider"/>
                        {/!*如果有技师，则显示重新分配；如果没有技师，则显示分配*!/}
                        {/!*{record.server?afresh:allot}*!/}
                    </span>
                );*/
            }
        }],
        condition: {
            server: [],
            status: [],
            plateNum: '',
            phoneNum: '',
            channel: [],
            startDate: '',
            endDate: '',
        },
        currentPageNum: 1,
        pageSize: 10,
        totalNum: 1,
        dataSource: [],
        showDetail: false,
        detailId: '',
        channels: [],
        services: [],
        popChannel: [],
        key: 0,
        statusObj: {},
        selectedRowKeys: [],
        loading: false,
    }

    //立此flag先占个位置
    allotOk(record){
        const serviceUser = this.state.popChannel[0];
        const workOrderId = record.key;
        const statusStr = record.status;
        const statusObj = this.state.statusObj;
        console.log(statusObj,serviceUser,workOrderId,status);
        /*let status;
        for(let key in statusObj){
            if(statusObj[key]===statusStr){
                status = key;
                break;
            }
        }*/
        Request.synPost('/workOrder/modify',{
            serviceUser,
            workOrderId,
            status: 1,
        });
        this.setState({
            key: 0,
            popChannel:[]
        });
        this.handleSearch(this.state.condition,this.state.currentPageNum,this.state.pageSize);
    }

    componentDidMount() {
        const dataArray = Request.synPost('/channel/listByNameAndCode');
        let channels = [];
        if (dataArray && dataArray.length > 0) {
            for (let item of dataArray) {
                let obj = {
                    value: item.id,
                    label: item.name,
                }
                channels.push(obj);
            }
        }

        const serverArray = Request.synPost('/technician/findByRegionIdAndLeaderId', {
            regionId: 2,
            leaderId: 1,
        });
        let servers = [];
        if (serverArray && serverArray.length > 0) {
            for (let item of serverArray) {
                let obj = {
                    value: item.userId,
                    label: item.name,
                }
                servers.push(obj);
            }
        }

        this.setState({
            servers,
            channels
        });
        this.handleSearch(this.state.condition, 1, this.state.pageSize);
    }

    //更改服务日期的逻辑
    handleDateChange(datas, dataStrings){
        const startDate = dataStrings[0];
        const endDate = dataStrings[1];
        const condition = this.state.condition;
        condition.startDate = startDate;
        condition.endDate = endDate;
        this.setState({condition});
    }

    //点击查询按钮的逻辑
    clickSearch(){
        this.handleSearch(this.state.condition, 1, this.state.pageSize);
    }

    //重置按钮的逻辑
    handleReset(e){
        e.preventDefault();
        this.setState({
            condition: {
                server: [],
                status: [],
                startDate: '',
                endDate: '',
                plateNum: '',
                phoneNum: '',
                channel: [],
            },
        });
    }

    //后台请求回来的字段转换为相对应的前端的字段
    backToFront(backArray,statusDescribtion){
        const desArr = statusDescribtion.split('，');
        const desObj = {};
        for(let item of desArr){
            const arr = item.split(":");
            desObj[arr[0]] = arr[1];
        }
        let frontArray = [];
        for(let item of backArray){
            let date = '';
            const serviceDate = item.serviceDate;
            if(serviceDate){
                date += serviceDate.substr(0,4)+'-'+serviceDate.substr(4,2)+'-'+serviceDate.substr(6,2);
            }
            let obj = {
                key: item.workOrderId,
                server: item.serviceUserName,
                customer: item.customerName,
                plateNum: item.plate,
                phoneNum: item.phone,
                date: date,
                address: item.address,
                channel: item.channelName,
                status: desObj[item.status]
            }
            frontArray.push(obj);
        }
        this.setState({statusObj:desObj});
        return frontArray;
    }

    //封装的查询的逻辑
    handleSearch(condition, currentPageNum, pageSize){
        const serviceUserId = condition.server[0];
        const status = condition.status[0];
        const plate = condition.plateNum;
        const phone = condition.phoneNum;
        const channelId = condition.channel[0];
        const currentPage = currentPageNum;
        let serviceDateBegin = condition.startDate;
        serviceDateBegin = serviceDateBegin.replace(/[^0-9]/g,'');
        let serviceDateEnd = condition.endDate;
        serviceDateEnd = serviceDateEnd.replace(/[^0-9]/g,'');

        const dataObj = Request.synPost('workOrder/list',{
            serviceUserId,
            status,
            serviceDateBegin,
            serviceDateEnd,
            plate,
            phone,
            channelId,
            currentPage,
            pageSize
        });
        const statusDescribtion = dataObj.statusDescribtion;
        const dataArray = dataObj.data;
        const dataSource = this.backToFront(dataArray,statusDescribtion);
        this.setState({
            dataSource,
            totalNum: dataObj.totalNum,
            pageSize: dataObj.pageSize,
            currentPageNum
        });
    }

    //切换分页的逻辑
    handlePageChange(page, pageSize){
        this.handleSearch(this.state.condition, page, pageSize);
    }

    changeShowDetail(detailId){
        this.setState({
            showDetail: true,
            detailId: detailId,
        });
    }

    changeShowDetailToFalse(){
        this.setState({
            showDetail: false,
            detailId: '',
        });
        this.handleSearch(this.state.condition,this.state.currentPageNum,this.state.pageSize);
    }

    onSelectChange(selectedRowKeys){
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    downloadOrder(orderArr){
        $.ajax({
            url: 'downLoad/saveToLocalServer',
            type: 'POST',
            data: JSON.stringify(orderArr),
            dataType: 'json',
            contentType: "application/json",
            success: (response)=>{
                if(response.code === '200'){
                    window.open('http://192.168.1.187:8080/downLoad/serviceExcel?timeTemp='+response.data,"_blank");
                }
            },
            error: (err)=>{
                throw err;
            }
        });
    }

    render() {
        if(this.state.showDetail){
            return <BillInfo
                detailId={this.state.detailId}
                changeShowDetailToFalse={this.changeShowDetailToFalse.bind(this)}
            />
        }

        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        }
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange.bind(this),
        }
        const hasSelected = selectedRowKeys.length > 0;

        return (
            <div>
                <Row type="flex" align="middle">
                    <Col span={18}>
                        <Row>
                            <Col span={8}>
                                <FormItem
                                    label="技师"
                                    {...formItemLayout}
                                >
                                    <Cascader
                                        options={this.state.servers}
                                        placeholder="请选择技师"
                                        value={this.state.condition.server}
                                        onChange={(value)=>{
                                            let condition = this.state.condition;
                                            condition.server = value;
                                            this.setState({condition})
                                        }}
                                    />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label="状态"
                                    {...formItemLayout}
                                >
                                    <Cascader
                                        options={statuses}
                                        placeholder='请选择状态'
                                        value={this.state.condition.status}
                                        onChange={(value)=>{
                                            let condition = this.state.condition;
                                            condition.status = value;
                                            this.setState({condition})
                                        }}
                                    />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label="服务日期"
                                    {...formItemLayout}
                                >
                                    <RangePicker
                                        onChange={this.handleDateChange.bind(this)}
                                        value={[this.state.condition.startDate?moment(this.state.condition.startDate,'YYYY-MM-DD'):null,
                                                this.state.condition.endDate?moment(this.state.condition.endDate,'YYYY-MM-DD'):null]}
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem
                                    label="客户车牌"
                                    {...formItemLayout}
                                >
                                    <Input
                                        placeholder='请输入车牌'
                                        value={this.state.condition.plateNum}
                                        onChange={(e)=>{
                                            let condition = this.state.condition;
                                            condition.plateNum = e.target.value;
                                            this.setState({condition})
                                        }}
                                    />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label="客户手机号"
                                    {...formItemLayout}
                                >
                                    <Input
                                        placeholder="请输入手机号"
                                        value={this.state.condition.phoneNum}
                                        onChange={(e)=>{
                                            let condition = this.state.condition;
                                            condition.phoneNum = e.target.value;
                                            this.setState({condition})
                                        }}
                                    />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem
                                    label="发卡渠道"
                                    {...formItemLayout}
                                >
                                    <Cascader
                                        options={this.state.channels}
                                        placeholder="请选择发卡渠道"
                                        value={this.state.condition.channel}
                                        onChange={(value)=>{
                                            let condition = this.state.condition;
                                            condition.channel = value;
                                            this.setState({condition})
                                        }}
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={6}>
                        <Row type="flex" justify="center" gutter={16}>
                            <Col><Button type="primary" onClick={this.clickSearch.bind(this)}>查询</Button></Col>
                            <Col><Button onClick={this.handleReset.bind(this)}>重置</Button></Col>
                            <Col>
                                <Button
                                    type="primary"
                                    onClick={()=>{this.downloadOrder(this.state.selectedRowKeys)}}
                                    disabled={!hasSelected}
                                >下载工单</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Table
                    columns={this.state.columns}
                    dataSource={this.state.dataSource}
                    rowSelection={rowSelection}
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

export default BillList;