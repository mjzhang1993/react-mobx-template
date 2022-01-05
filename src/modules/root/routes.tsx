import React from 'react';
import { Route, Routes, Navigate, Link } from 'react-router-dom';
import { Button } from 'antd';
import { WithRouter } from '../../utils/routerHoc';
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
    <Routes>
      <Route path="/">
        <Route
          index
          element={
            <div className={RootContainerLess.login}>
              <Button>click me</Button>
              <p>
                <Link to="origin">/origin</Link>
              </p>
              <p>
                <Link to="remote">/remote</Link>
              </p>
              <p>
                <Link to="mobxApi">/mobxApi</Link>
              </p>
              <p>
                <Link to="classic/xxx">/classic</Link>
              </p>
              <p>
                <Link to="func/xxx">/func</Link>
              </p>
              <p>
                <Link to="funcWithRef">/funcWithRef</Link>
              </p>
            </div>
          }
        />
        <Route path="login" element={<Navigate to="/" replace />} />
        <Route path="origin" element={<Origin />} />
        <Route path="mobxApi" element={<MobxApi />} />
        <Route
          path="classic/:id"
          element={
            <WithRouter>
              {({ params, searchParams }) => {
                const type = searchParams.get('type');
                console.log('classic', params, type);
                return (
                  <div>
                    <Button onClick={handleClick}>ref click</Button>
                    <ClassicCom
                      ref={classicRef}
                      id={_.get(params, 'id') || ''}
                      type={(type as string) || ''}
                    />
                  </div>
                );
              }}
            </WithRouter>
          }
        />
        <Route
          path="func/:id"
          element={
            <WithRouter>
              {({ searchParams }) => {
                const type = searchParams.get('type');
                console.log('func', type);
                return <FuncCom type={(type as string) || ''} />;
              }}
            </WithRouter>
          }
        />
        <Route
          path="funcWithRef/:id"
          element={
            <WithRouter>
              {({ searchParams }) => {
                const type = searchParams.get('type');
                console.log('funcWithRef', type);
                return (
                  <div>
                    <Button onClick={handleClick}>ref click</Button>
                    <FuncWithRefCom ref={funcRef} type={(type as string) || ''} />
                  </div>
                );
              }}
            </WithRouter>
          }
        />
        <Route path="remote" element={<Remote />} />
        <Route path="/notFount" element={<div>nnnnn</div>} />
        <Route path="*" element={<div>not found</div>} />
      </Route>
    </Routes>
  );
};

export default RouteEntry;
