import {Form, Input, Cascader, Select, Row, Col, Button, Steps, DatePicker, message, Modal, Radio} from 'antd';
import React from 'react';
import Request from "./util/Request";

const Step = Steps.Step;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class CarModalSelect extends React.Component {

    state = {
        showFlag: "",
        selectedLetter: 'A',
        selectedBrandId: "",
        selectedBrandName: "",
        selectedSerieId: "",
        selectedSerieName: "",
        selectedModalId: "",
        selectedModalName: "",
        selectedFactoryId: "",
        selectedFactoryName: "",
        selectedYear: "",
        selectedDisplacement: "",
        brandLetters: [],
        brands: [],
        series: [],
        modals: [],
        factories: [],
        years: [],
        displacements: []
    };

    componentDidMount() {
        let brandLetters = Request.synPost("carInfo/listFirstLetters")
        this.setState({
            brandLetters: brandLetters
        });
    }

    // 初始化
    init() {
        if (this.props.modalId) {
            let modal = Request.synPost("carInfo/listCarModals", {modalId: this.props.modalId})[0];
            let brands = Request.synPost("carInfo/listBrands", {
                letter: modal.firstBrandLetter
            });
            let series = Request.synPost("carInfo/listCarSeries", {brandId: modal.brandId});
            let modals = Request.synPost("carInfo/listCarModals", {
                serieId: modal.serieId,
                factoryId: modal.factoryId,
                productYear: modal.productYear,
                displacement: modal.displacement
            });
            let factoriesYearsDisplacements = this.getFactoriesYearsDisplacements(modals);
            this.setState({
                showFlag: "modal",
                selectedLetter: modal.firstBrandLetter,
                selectedBrandId: modal.brandId,
                selectedBrandName: modal.brandName,
                selectedSerieId: modal.serieId,
                selectedSerieName: modal.serieName,
                selectedModalId: modal.id,
                selectedModalName: modal.modalName,
                selectedFactoryId: modal.factoryId,
                selectedFactoryName: modal.factoryName,
                selectedYear: modal.productYear,
                selectedDisplacement: modal.displacement,
                brands: brands,
                series: series,
                modals: modals,
                factories: factoriesYearsDisplacements.factories,
                years: factoriesYearsDisplacements.years,
                displacements: factoriesYearsDisplacements.displacements
            });
        } else {
            let brands = Request.synPost("carInfo/listBrands", {
                letter: "A"
            });
            this.setState({
                showFlag: "brand",
                selectedLetter: 'A',
                brands: brands,
                selectedBrandId: "",
                selectedBrandName: ""
            });
        }
    }

    // 选择品牌首字母
    selectBrandLetter(selectedLetter) {
        let brands = Request.synPost("carInfo/listBrands", {
            letter: selectedLetter
        });

        this.setState({
            selectedLetter: selectedLetter,
            brands: brands
        });
    }

    // 选择品牌
    selectBrand(brandId, brandName) {
        let series = Request.synPost("carInfo/listCarSeries", {brandId: brandId});
        this.setState({
            selectedBrandId: brandId,
            selectedBrandName: brandName,
            series: series
        });
    }

    getFactoriesYearsDisplacements(modals) {
        let factoryMap = {}, yearMap = {}, displacementMap = {};
        for (let modal of modals) {
            factoryMap[modal.factoryId] = modal.factoryName;
        }
        for (let modal of modals) {
            yearMap[modal.productYear] = modal.productYear;
        }
        for (let modal of modals) {
            displacementMap[modal.displacement] = modal.displacement;
        }
        let factories = [], years = [], displacements = [];
        for (let key in factoryMap) {
            factories.push({
                id: key,
                name: factoryMap[key]
            });
        }
        for (let key in yearMap) {
            years.push(key);
        }
        for (let key in displacementMap) {
            displacements.push(key);
        }
        return {
            factories: factories,
            years: years,
            displacements: displacements
        };
    }

    // 选择车系
    selectSerie(serieId, serieName) {
        let modals = Request.synPost("carInfo/listCarModals", {serieId: serieId});
        let factoriesYearsDisplacements = this.getFactoriesYearsDisplacements(modals);
        this.setState({
            selectedSerieId: serieId,
            selectedSerieName: serieName,
            modals: modals,
            factories: factoriesYearsDisplacements.factories,
            years: factoriesYearsDisplacements.years,
            displacements: factoriesYearsDisplacements.displacements
        });
    }

    // 选择主机厂
    selectFactory(id, name) {
        if (id === this.state.selectedFactoryId) {
            id = "";
            name = "";
        }
        let modals = Request.synPost("carInfo/listCarModals", {
            serieId: this.state.selectedSerieId,
            factoryId: id,
            productYear: this.state.selectedYear,
            displacement: this.state.selectedDisplacement
        });
        let factoriesYearsDisplacements = this.getFactoriesYearsDisplacements(modals);
        this.setState({
            selectedFactoryId: id,
            selectedFactoryName: name,
            modals: modals,
            factories: factoriesYearsDisplacements.factories,
            years: factoriesYearsDisplacements.years,
            displacements: factoriesYearsDisplacements.displacements
        });
    }

    // 选择年款
    selectYear(year) {
        if (year === this.state.selectedYear) {
            year = "";
        }
        let modals = Request.synPost("carInfo/listCarModals", {
            serieId: this.state.selectedSerieId,
            factoryId: this.state.selectedFactoryId,
            productYear: year,
            displacement: this.state.selectedDisplacement
        });
        let factoriesYearsDisplacements = this.getFactoriesYearsDisplacements(modals);
        this.setState({
            selectedYear: year,
            modals: modals,
            factories: factoriesYearsDisplacements.factories,
            years: factoriesYearsDisplacements.years,
            displacements: factoriesYearsDisplacements.displacements
        });
    }

    // 选择排量
    selectDisplacement(displacement) {
        if (displacement === this.state.selectedDisplacement) {
            displacement = "";
        }
        let modals = Request.synPost("carInfo/listCarModals", {
            serieId: this.state.selectedSerieId,
            factoryId: this.state.selectedFactoryId,
            productYear: this.state.selectedYear,
            displacement: displacement,
        });
        let factoriesYearsDisplacements = this.getFactoriesYearsDisplacements(modals);
        this.setState({
            selectedDisplacement: displacement,
            modals: modals,
            factories: factoriesYearsDisplacements.factories,
            years: factoriesYearsDisplacements.years,
            displacements: factoriesYearsDisplacements.displacements
        });
    }

    // 选择车型
    selectModal(id, name) {
        if (id === this.state.selectedModalId) {
            id = "";
            name = "";
        }
        this.setState({
            selectedModalId: id,
            selectedModalName: name
        });
    }

    changeShowFlag(showFlag) {
        if (showFlag === "serie" && !this.state.selectedBrandId) {
            message.warning("请选择品牌!");
        } else if (showFlag === "modal" && !this.state.selectedSerieId) {
            message.warning("请选择车系!");
        } else {
            this.setState({
                showFlag: showFlag
            });
        }
    }

    render() {
        if (this.state.showFlag === "brand") {
            return (
                <Modal
                    title={`品牌：${this.state.selectedBrandName}`}
                    width='650px'
                    maskClosable={false}
                    visible={this.state.showFlag === "brand"}
                    wrapClassName="selectBrand"
                    footer={[
                        <Button key="next" type="primary" size="large" onClick={()=>{
                            this.changeShowFlag("serie");
                        }}>
                            下一步
                        </Button>,
                    ]}
                    onCancel={()=> {
                        this.changeShowFlag("");
                    }}
                >
                    {
                        <div>
                            <div className="ant-confirm-divNav">
                                <ul className="clearfix">
                                    {
                                        this.state.brandLetters.map((item, index)=> {
                                            return (
                                                <li key={index} className="ant-confirm-navList">
                                                    <a
                                                        onClick={()=>{
                                                            this.selectBrandLetter(item);
                                                        }}
                                                        className={item === this.state.selectedLetter ? 'navList' : ''}
                                                    >
                                                        {item}
                                                    </a>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                            </div>
                            <div className="ant-confirm-divContent">
                                <ul className="clearfix">
                                    {
                                        this.state.brands.map((brand, index)=> {
                                            return (
                                                <li key={index} className='ant-confirm-contentList'>
                                                    <button
                                                        onClick={()=>{
                                                            this.selectBrand(brand.id, brand.brandName);
                                                        }}
                                                        className={
                                                            brand.id == this.state.selectedBrandId ? "ant-btn ant-btn-primary" : "ant-btn"
                                                        }
                                                    >
                                                        {brand.brandName}
                                                    </button>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    }
                </Modal>
            );
        } else if (this.state.showFlag === "serie") {
            return (
                <Modal
                    title={`${this.state.selectedBrandName}  ${this.state.selectedSerieName}`}
                    width='650px'
                    maskClosable={false}
                    visible={this.state.showFlag === "serie"}
                    wrapClassName="selectSeries"
                    footer={[
                        <Button key="seriesPrevious" size='large' onClick={()=>{
                            this.changeShowFlag("brand");
                        }}>
                            上一步
                        </Button>,
                        <Button key="seriesNext" size='large' type="primary" onClick={()=>{
                            this.changeShowFlag("modal");
                        }}>
                            下一步
                        </Button>
                    ]}
                    onCancel={()=> {
                        this.changeShowFlag("");
                    }}
                >
                    {
                        <div className="ant-confirm-divContent">
                            <ul className="clearfix">
                                {
                                    this.state.series.map((item, index)=> {
                                        return (
                                            <li key={index} className='ant-confirm-contentList'>
                                                <button
                                                    onClick={()=>{
                                                        this.selectSerie(item.id, item.serieName + "(" + item.className + ")");
                                                    }}
                                                    className={
                                                        item.id == this.state.selectedSerieId ? "ant-btn ant-btn-primary" : "ant-btn"
                                                    }
                                                >
                                                    {item.serieName + "(" + item.className + ")"}
                                                </button>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                    }
                </Modal>
            );
        } else if (this.state.showFlag === "modal") {
            return (
                <Modal
                    title={`${this.state.selectedBrandName} ${this.state.selectedSerieName} ${this.state.selectedModalName}`}
                    width='650px'
                    maskClosable={false}
                    visible={this.state.showFlag === "modal"}
                    wrapClassName="selectType"
                    footer={[
                        <Button key="typePrevious" size="large" onClick={()=>{
                            this.changeShowFlag("serie");
                        }}>
                            上一步
                        </Button>,
                        <Button key='typeNext' size="large" type="primary" onClick={()=>{
                            this.changeShowFlag("");
                            this.props.selectModal(this.state.selectedModalId, `${this.state.selectedBrandName} ${this.state.selectedSerieName} ${this.state.selectedModalName}`);
                        }}>
                            确定
                        </Button>
                    ]}
                    onCancel={()=> {
                        this.changeShowFlag("");
                    }}
                >
                    {
                        <div>
                            <div className="ant-confirm-divNav">
                                组机厂：
                                <ul className="clearfix">
                                    {
                                        this.state.factories.map((item, index)=> {
                                            return (
                                                <li key={index} className="ant-confirm-factoryList">
                                                    <a onClick={()=>{
                                                            this.selectFactory(item.id, item.name);
                                                        }}
                                                       className={item.id === this.state.selectedFactoryId ? 'navList' : ''}
                                                    >{item.name}</a>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                                年份：
                                <ul className="clearfix">
                                    {
                                        this.state.years.map((item, index)=> {
                                            return (
                                                <li key={index} className="ant-confirm-yearList">
                                                    <a onClick={()=>{
                                                            this.selectYear(item);
                                                        }}
                                                       className={item === this.state.selectedYear ? 'navList' : ''}
                                                    >{item}</a>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                                排量：
                                <ul className="clearfix">
                                    {
                                        this.state.displacements.map((item, index)=> {
                                            return (
                                                <li key={index} className="ant-confirm-navList">
                                                    <a onClick={()=>{
                                                            this.selectDisplacement(item);
                                                        }}
                                                        className={item === this.state.selectedDisplacement ? 'navList' : ''}
                                                    >{item}</a>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                            </div>
                            <div className="ant-confirm-divContent">
                                <ul className="clearfix">
                                    {
                                        this.state.modals.map((item, index)=> {
                                            return (
                                                <li key={index} className='ant-confirm-contentList'>
                                                    <button
                                                        onClick={()=>{
                                                            this.selectModal(item.id, item.modalName);
                                                        }}
                                                        className={
                                                            item.id == this.state.selectedModalId ? "ant-btn ant-btn-primary" : "ant-btn"
                                                        }
                                                    >
                                                        {item.modalName}
                                                    </button>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    }
                </Modal>
            );
        } else {
            return (<div></div>);
        }
    }
}

export default CarModalSelect;