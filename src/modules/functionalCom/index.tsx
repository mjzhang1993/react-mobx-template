/**
 * 类组件 mobx 使用场景示例
 * */
import { Observer } from 'mobx-react';
import { Button } from 'antd';
import { TGlobalStore, inject } from 'store';
import { Link } from 'react-router-dom';
import UserCreateForm from './view/UserCreateForm';
import UserList from './view/UserList';
import UserLess from './style/user.less';

interface Props {
  funcComStore: TGlobalStore['funcComStore'];
  type: string; // EDIT | LIST
}

const FuncCom: React.FC<Props> = (props: Props) => {
  const { funcComStore, type } = props;

  // 简单类型的 state 没必要使用 useLocalObservable
  const [step, setStep] = React.useState(0);

  // 可以使用 useLocalObservable 代替 useState 存储 state
  // const stepObs = useLocalObservable(() => {
  //   step: 0,
  //   increaseStep() {
  //     this.step = 1
  //   }
  // })

  // 1. 如果只有 首次渲染需要请求数据那么直接在 useEffect 中触发 action 即可
  // React.useEffect(() => funcComStore.fetchUsers(), []);

  /**
   * 2. 如果需要在数据变化时重新请求数据，则要结合 autorun reaction when 等使用
   * 1). autorun reaction when 等的运行返回值，是追踪器的 dispose() 销毁函数
   * 2). useEffect 第一个参数的返回值函数会在组件卸载时调用
   * 3). 把 autorun reaction when 的运行返回值作为 useEffect 第一个参数的返回值，刚好可以实现在组件卸载时 dispose 关掉追踪器
   * */
  React.useEffect(
    () =>
      /**
       * 3. 推荐使用 mobx.reaction, 因为：
       * 1). 触发重新请求数据的 "可观察数据"，不一定是需要传递给请求函数的（也就是说可能不被使用到）
       * 2). autorun 只能在当前函数体使用到 "可观察数据" 改变时触发，因此不适合使用
       * 3). 设置 reaction 第三个参数 fireImmediately=true 可以达到立即执行一遍的效果
       * */
      mobx.reaction(
        () => {
          /**
           * 4. 不建议在第一个函数体内解构 props, state, 因为：
           * 1). 与类组件不同，函数式组件的 props, state 不会被自动转化为 observable 因此在这个函数体内解构，不会出发更新
           * 2). 如果有非 "可观察数据" 作为判断条件，建议直接传给 React.useEffect 第二个参数 deps,
           * 3). 这样函数执行的条件就变成了： "可观察数据" 改变 + useEffect deps依赖的 "不可观察数据" 改变
           * 4). "不可观察数据" 的改变，会触发 useEffect 执行，同时会传入新的 props state, 因此不用在这里解构
           * */
          // const { step } = this.state;
          console.log('in expression');
          /**
           * 5. 同样建议返回简单类型数据，方便计算，如果返回引用类型 则需要在下一个函数中 做判断
           * 或者 设置第三个参数的 equals: mobx.comparer.structural
           * */
          return { storeType: funcComStore.type, type, step };
        },
        (val) => {
          console.log('did mount reaction', val);
          funcComStore.fetchUsers();
        },
        /**
         * 6. 如果需要同时模拟 didMount didUpdate 则 追加 fireImmediately: true
         * 如果第一个参数会返回一个引用类型值，那么可以考虑配置 equals，或者在第二个函数中自定义判断
         * */
        { fireImmediately: true, equals: mobx.comparer.structural },
      ),
    /**
     * 7. userEffect 的第二个参数表示执行 effect 的依赖条件
     * 1). 如果依赖条件只有 "可观察数据" ，那么这里不需要填保持 [] 即可
     * 2). 如果依赖条件包含 "非可观察数据"，那么这里需要加入 "非可观察数据"
     * */
    [type, step],
  );
  console.log('render Container');

  /**
   * React.useCallback 用来确保 方法的指针是不变的，减少无意义的 render
   * */
  const renderUserName = React.useCallback(() => {
    return (
      /**
       * 如果我们组件中有在组件的回调函数中用到 ”可观察数据“ 那么需要 <Observer> 组件来协助
       * 否则不会达到预期效果
       * */
      <Observer>{() => <div>{funcComStore.users.map((u) => u.name).join(', ')}</div>}</Observer>
    );
  }, []);

  return (
    <div className={UserLess.container}>
      <div className={UserLess.content}>
        <Button onClick={() => funcComStore.resetType()}>change store type</Button>
        <Button onClick={() => setStep(1)}>change state step</Button>
        <Link to="/func/test?type=EDIT">/func/test?type=EDIT</Link>
        <p>userNum: {funcComStore.userNum}</p>
        <UserCreateForm funcComStore={funcComStore} renderUserName={renderUserName} />
        <UserList funcComStore={funcComStore} />
      </div>
    </div>
  );
};

export default inject((store) => ({
  funcComStore: store.funcComStore,
}))(FuncCom);
