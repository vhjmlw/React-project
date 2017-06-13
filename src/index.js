import React from 'react';
import ReactDOM from 'react-dom';
import App from './script/App';
import OrderList from './script/OrderList';
import OrderInfo from './script/OrderInfo';
import ModifyInfo from './script/ModifyInfo';
import PackageList from './script/PackageList';
import PackageInfo from './script/PackageInfo';
import ModifyPackage from './script/ModifyPackage';
import PackageSale from './script/PackageSale';
import Fitting from './script/Fitting';
import Service from './script/Service';
import BillList from './script/BillList';
import BillInfo from './script/BillInfo';
import './style/common.css';
import './index.css';
import "./style/App.css";
import { Router, Route, hashHistory, IndexRoute, IndexRedirect} from 'react-router';

ReactDOM.render(
    (<Router history={hashHistory}>
      <Route path="/">
          <IndexRedirect to="/App" />
          <Route path="App" component={App}>
              <IndexRoute component={OrderList} />
              <Route path="OrderInfo" component={OrderInfo}/>
              <Route path="ModifyInfo" component={ModifyInfo}/>
              <Route path="PackageList" component={PackageList}/>
              <Route path="PackageInfo" component={PackageInfo}/>
              <Route path="ModifyPackage" component={ModifyPackage}/>
              <Route path="PackageSale" component={PackageSale}/>
              <Route path="Fitting" component={Fitting}/>
              <Route path="Service" component={Service}/>
              <Route path="BillList" component={BillList}/>
          </Route>
      </Route>
  </Router>),
  document.getElementById('root')
);