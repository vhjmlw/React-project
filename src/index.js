import React from 'react';
import ReactDOM from 'react-dom';
import App from './script/App';
import TableList from './script/TableList';
import OrderInfo from './script/OrderInfo';
import ModifyInfo from './script/ModifyInfo';
import './style/common.css';
import './index.css';
import "./style/App.css";
import { Router, Route, hashHistory, IndexRoute, IndexRedirect} from 'react-router';

ReactDOM.render(
    (<Router history={hashHistory}>
      <Route path="/">
          <IndexRedirect to="/App" />
          <Route path="App" component={App}>
              <IndexRoute component={TableList} />
              <Route path="OrderInfo" component={OrderInfo}/>
              <Route path="ModifyInfo" component={ModifyInfo}/>
          </Route>
      </Route>
  </Router>),
  document.getElementById('root')
);

