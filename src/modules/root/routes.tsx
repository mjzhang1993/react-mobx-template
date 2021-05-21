import React from 'react';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import qs from 'qs';
import { Button } from 'antd';
import Remote from '../remote';
import Origin from '../original';
import ClassicCom from '../classicCom';
import FuncWithRefCom from '../funcWithRefCom';
import RootContainerLess from './styles/RootContainer.less';

const MobxApi = React.lazy(() => import('../mobxApi'));
const FuncCom = React.lazy(() => import('../functionalCom'));

const RouteEntry: React.FC = () => {
  const funcRef = React.useRef<React.ElementRef<typeof FuncWithRefCom>>(null);
  const classicRef = React.useRef<React.ElementRef<typeof ClassicCom>>(null);

  function handleClick() {
    console.log(classicRef.current?.changeSomething());
    console.log(funcRef.current?.changeSomething());
  }

  // console.log(User.getStoreName());

  return (
    <Switch>
      <Route exact path="/login" render={() => <Redirect to="/" />} />
      <Route
        exact
        path="/"
        render={() => (
          <div className={RootContainerLess.login}>
            <Button>click me</Button>
            <p>
              <Link to="/origin">/origin</Link>
            </p>
            <p>
              <Link to="/remote">/remote</Link>
            </p>
            <p>
              <Link to="/mobxApi">/mobxApi</Link>
            </p>
            <p>
              <Link to="/classic">/classic</Link>
            </p>
            <p>
              <Link to="/func">/func</Link>
            </p>
            <p>
              <Link to="/funcWithRef">/funcWithRef</Link>
            </p>
          </div>
        )}
      />
      <Route path="/origin" component={Origin} />
      <Route path="/mobxApi" component={MobxApi} />
      <Route
        path="/classic/:id?"
        render={({ match, location }) => {
          const { type } = qs.parse(location.search.replace(/^\?/, '')) || {};
          console.log(type, _.get(match, 'params.id'));
          return (
            <div>
              <Button onClick={handleClick}>ref click</Button>
              <ClassicCom
                ref={classicRef}
                id={_.get(match, 'params.id')}
                type={(type as string) || ''}
              />
            </div>
          );
        }}
      />
      <Route
        path="/func/:id?"
        render={({ match, location }) => {
          const { type } = qs.parse(location.search.replace(/^\?/, '')) || {};
          console.log(type, _.get(match, 'params.id'));
          return <FuncCom type={(type as string) || ''} />;
        }}
      />
      <Route
        path="/funcWithRef/:id?"
        render={({ match, location }) => {
          const { type } = qs.parse(location.search.replace(/^\?/, '')) || {};
          console.log(type, _.get(match, 'params.id'));
          return (
            <div>
              <Button onClick={handleClick}>ref click</Button>
              <FuncWithRefCom ref={funcRef} type={(type as string) || ''} />
            </div>
          );
        }}
      />
      <Route path="/remote" component={Remote} />
    </Switch>
  );
};

export default RouteEntry;
