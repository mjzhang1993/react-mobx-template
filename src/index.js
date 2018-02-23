/*
   项目入口
*/
import './scss/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import Root from './router/routes';
import stores from './store/index';

const mountNode = document.getElementById('app');

useStrict(true);

const render = (Component, stores) => {
   ReactDOM.unmountComponentAtNode(mountNode);
   ReactDOM.render(
      <Provider {...stores}>
         <BrowserRouter>
            <Component />
         </BrowserRouter>
      </Provider>,
      mountNode
   );
};

render(Root, stores);

if (module.hot) {
   module.hot.accept('./store/index.js', () => {
      console.log('mobx changed');
      render(require('./router/routes.js').default, require('./store/index.js').default);
   });
}
