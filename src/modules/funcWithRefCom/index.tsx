/**
 * 类组件 mobx 使用场景示例
 * */
import { Button } from 'antd';
import { TGlobalStore, inject, Observer } from 'store';
import { useImperativeHandle } from 'react';
import { Link } from 'react-router-dom';
import UserCreateForm from './view/UserCreateForm';
import UserList from './view/UserList';
import UserLess from './style/user.module.less';

interface Props {
  funcRefComStore: TGlobalStore['funcRefComStore'];
  type: string; // EDIT | LIST
}

interface RefParams {
  changeSomething: () => void;
}

const FuncWithRefCom: React.ForwardRefRenderFunction<RefParams, Props> = (
  props: Props,
  ref: React.ForwardedRef<RefParams>,
) => {
  const { funcRefComStore, type } = props;

  // 简单类型的 state 没必要使用 useLocalObservable
  const [step, setStep] = React.useState(0);

  React.useEffect(
    () =>
      mobx.reaction(
        () => {
          console.log('in expression');
          return { storeType: funcRefComStore.type, type, step };
        },
        (val) => {
          console.log('did mount reaction', val);
          funcRefComStore.fetchUsers();
        },
        { fireImmediately: true, equals: mobx.comparer.structural },
      ),
    [type, step],
  );
  useImperativeHandle(ref, () => ({
    changeSomething: () => {
      console.log('change something in functional');
    },
  }));

  const renderUserName = React.useCallback(() => {
    return (
      <Observer>{() => <div>{funcRefComStore.users.map((u) => u.name).join(', ')}</div>}</Observer>
    );
  }, []);
  console.log('render Container');
  return (
    <div className={UserLess.container}>
      <div className={UserLess.content}>
        <Button onClick={() => funcRefComStore.resetType()}>change store type</Button>
        <Button onClick={() => setStep(1)}>change state step</Button>
        <Link to="/func/test?type=EDIT">/func/test?type=EDIT</Link>
        <p>userNum: {funcRefComStore.userNum}</p>
        <UserCreateForm funcRefComStore={funcRefComStore} renderUserName={renderUserName} />
        <UserList funcRefComStore={funcRefComStore} />
      </div>
    </div>
  );
};

export default inject((store) => ({
  funcRefComStore: store.funcRefComStore,
}))(React.forwardRef(FuncWithRefCom));
