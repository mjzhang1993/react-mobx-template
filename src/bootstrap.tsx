import 'store/initMobxConfig';
import { HashRouter } from 'react-router-dom';
import globalStore, { Provider } from 'store';
import RootContainer from './modules/root/routes';

ReactDOM.render(
  <Provider store={globalStore}>
    <React.Suspense fallback={<div>loading...</div>}>
      <HashRouter>
        <RootContainer />
      </HashRouter>
    </React.Suspense>
  </Provider>,
  document.getElementById('root'),
);
