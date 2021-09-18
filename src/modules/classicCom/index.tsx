/**
 * 类组件 mobx 使用场景示例
 * */
import { Button } from 'antd';
import { TGlobalStore, inject, Observer, disposeOnUnmount } from 'store';
import { Link } from 'react-router-dom';
import UserCreateForm from './view/UserCreateForm';
import UserList from './view/UserList';
import UserLess from './style/user.less';

interface Props {
  classicComStore: TGlobalStore['classicComStore'];
  id: string;
  type: string; // EDIT | LIST
}

interface State {
  step: number;
}

// 类组件统一使用 PureComponent 提高性能
class ClassicCom extends React.PureComponent<Props, State> {
  /**
   * 1. 不建议再使用 getDerivedStateFromProps，有其是使用他处理 可观察数据
   * 1). getDerivedStateFromProps 只有在组件决定调用 render 之前，才会调用
   * 2). 而可观察数据的改变不一定触发当前组件 render, 所以在这里获得计算值是不可控的
   * 3). 在 getDerivedStateFromProps 中使用 autorun reaction 是无效的
   * 4). 如果一定要使用计算值，可以通过 computed 在 render 实现
   * */
  static getDerivedStateFromProps(props: Props, state: State) {
    const { classicComStore } = props;
    console.log('getDerivedStateFromProps');
    return { step: classicComStore.type === 'LIST' ? 9 : 10 };
  }

  public constructor(props: Props) {
    super(props);
    this.state = { step: 0 };
  }

  public componentDidMount() {
    // 1. 如果只有did Mount 需要数据请求那么直接触发 action 即可
    // classicComStore.fetchUsers();

    // 2. 如果需要在数据变化时请求，请使用 autorun reaction when 等
    console.log('wrapper did mount');
    /**
     * 3. 建议使用 disposeOnUnmount 包装因为：
     * autorun reaction 两者一旦创建会始终追踪可观察数据变化，即使当前组件已经销毁，
     * 有可能造成内存泄漏。disposeOnUnmount 可以帮助在类组件销毁时关闭掉对可观察数据的追踪
     * NOTICE：使用我们自己改造的 disposeOnUnmount 而不是从 mobx-react 中取，这样可以兼容 IE10
     * */
    disposeOnUnmount(
      this,
      /**
       * 4. 建议使用 mobx.reaction，因为：
       * 1). reaction 第一个参数的返回值是否变化决定了第二个函数是否执行
       * 2). reaction 可以拿到当前数据与上一次数据，方便进行比较
       * 3). 通过设置 reaction 第三个参数 fireImmediately=true 可以立即执行一遍
       * 4). 可以模拟 didMount 与 didUpdate 场景
       * */
      mobx.reaction(
        () => {
          /**
           * 5. 建议在函数体内解构 props 与 state, 因为：
           * 1). 在函数体外层结构不能保证结构出的值是最新的，且在外层解构后不具备对 props state 简单类型值的追踪能力
           * 2). 针对类组件 props 与 state 会被转化为 observable
           * 3). 在这里解构，props 与 state 的改动就会被追踪（包括在props 定义中非 observable 的值），
           * 4). 然后通过控制返回值来决定是否执行下一个函数
           * */
          const { classicComStore } = this.props;
          const { step } = this.state;
          /**
           * 6. 建议返回简单类型数据
           * 如果返回了引用类型数据，那么需要在下一个函数中 mobx.comparer.structural 做一下比较
           * 或者 设置第三个参数的 equals: mobx.comparer.structural
           * */
          return { type: classicComStore.type, step };
        },
        (val, prevVal) => {
          const { classicComStore } = this.props;
          console.log('did mount reaction', val);
          classicComStore.fetchUsers();
        },
        /**
         * 7. 如果需要同时模拟 didMount didUpdate 则 追加 fireImmediately: true
         * 如果第一个参数会返回一个引用类型值，那么可以考虑配置 equals，或者在第二个函数中自定义判断
         * */
        { fireImmediately: true, equals: mobx.comparer.structural },
      ),
    );
  }

  /**
   * 不再建议借助 componentDidUpdate 判断前后数据改变来做其他处理
   * 1). 可观察数据改变不一定触发 render 及 update
   * 2). 如果借助 autorun reaction 则每次处罚 componentDidUpdate 都会重新创建一个追踪
   */
  public componentDidUpdate() {}

  public changeSomething = () => {
    console.log('change something in classic');
  };

  private renderUserName = () => {
    const { classicComStore } = this.props;
    return (
      <Observer>{() => <div>{classicComStore.users.map((u) => u.name).join(', ')}</div>}</Observer>
    );
  };

  public render(): React.ReactNode {
    const { classicComStore } = this.props;
    console.log('render Container');
    return (
      <div className={UserLess.container}>
        <div className={UserLess.content}>
          <Button onClick={() => classicComStore.resetType()}>change store type</Button>
          <Button
            onClick={() => {
              this.setState({ step: 1 });
            }}
          >
            change state step
          </Button>
          <Link to="/classic/test?type=EDIT">/classic/test?type=EDIT</Link>
          <p>userNum: {classicComStore.userNum}</p>
          <UserCreateForm classicComStore={classicComStore} renderUserName={this.renderUserName} />
          <UserList classicComStore={classicComStore} />
        </div>
      </div>
    );
  }
}

export default inject((store) => ({
  classicComStore: store.classicComStore,
}))(ClassicCom);
