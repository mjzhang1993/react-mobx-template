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
   // 卸载掉旧的组件
   ReactDOM.unmountComponentAtNode(mountNode);
   // 重新渲染新的组件
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

/*
   这里的热更新只监视 store 部分代码变化，然后进行重新渲染组件，
   组件的热更新还是交给 react-hot-loader 组件处理（route文件中）
*/

if (module.hot) {
   module.hot.accept('./store/index.js', () => {
      console.log('mobx changed');
      render(require('./router/routes.js').default, require('./store/index.js').default);
   });
}
