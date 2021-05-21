/**
 * 测试 mobx api
 * */
import { Button } from 'antd';
import { Observer } from 'mobx-react';
import { TGlobalStore, inject } from 'store';
import UserCreateForm from './view/UserCreateForm';
import UserList from './view/UserList';
import UserLess from './style/user.less';

interface Props {
  mobxApiStore: TGlobalStore['mobxApiStore'];
}

mobx.runInAction(() => {
  const arr = mobx.observable(['aaa', 'bbb']);
  const obj = mobx.observable({ a: 'aaa' });
  const box = mobx.observable.box('string');
  const map = mobx.observable.map({ a: 'aaa' });
  const set = mobx.observable.set(['aaa', 'bbb']);
  const computed = mobx.computed(() => arr.join(', '));

  console.log('isObservable', mobx.isObservable(arr), mobx.isObservable([]));
  console.log('Array', mobx.isObservableArray(arr), mobx.isObservableArray(['aaa']));
  console.log('Object', mobx.isObservableObject(obj), mobx.isObservableObject({ a: 'aaa' }));
  console.log('Map', mobx.isObservableMap(map), mobx.isObservableMap(new Map()));
  console.log('Set', mobx.isObservableSet(set), mobx.isObservableSet(new Set()));
  console.log('box', mobx.isBoxedObservable(box));
  console.log('computed', mobx.isComputed(computed), mobx.isComputed(obj));

  // Array 追加方法
  arr.clear(); // 删除数组中所有当前条目
  console.log(mobx.toJS(arr));
  arr.replace(['kkk']); // 替换所有现有条目为 ...
  console.log(mobx.toJS(arr));
  const arr2 = mobx.observable([
    { a: 'aaa', del: false },
    { b: 'bbb', del: true },
  ]);
  arr2.forEach((item) => {
    if (item.del) {
      console.log(arr2.remove(item)); // 删除指定项目, 返回 boolean 表示是否有指定值被删除
    }
  });
  console.log(mobx.toJS(arr2));

  // Map 追加方法
  const map2 = mobx.observable.map({ a: { aa: 'aaa' } });
  console.log(map2);
  console.log(map2.toJSON()); // 返回此Map的浅表普通对象表示形式,(没啥用)
  console.log(mobx.toJS(map2)); // 返回 ES6 Map
  map2.merge({ a: { bb: 'bbb' } }); // 合并 Map 可以传普通对象或者 Map
  console.log(mobx.toJS(map2)); // 例中： a 的值会被覆盖
  map2.replace({ n: 'nnn' }); // 替换 Map 全部内容
  console.log(mobx.toJS(map2));

  const obj3 = mobx.observable({ a: { aa: 'aaa' } });
  const obj4 = mobx.observable({ a: { aa: 'aaa' } });
  console.log('comparer', mobx.comparer.structural(obj3, obj4)); // ture, 深层比较两个 observable 数据的值是否相等
});

const MobxApi: React.FC<Props> = (props: Props) => {
  const { mobxApiStore } = props;
  React.useEffect(() => {
    mobxApiStore.fetchUsers();
  }, []);

  React.useEffect(
    () =>
      mobx.autorun(() => {
        console.log('mobx api users change', mobxApiStore.users.length);
      }),
    [],
  );

  const renderUserName = React.useCallback(
    () => (
      <Observer>{() => <div>{mobxApiStore.users.map((u) => u.name).join(', ')}</div>}</Observer>
    ),
    [],
  );
  function act() {
    mobxApiStore.resetRemote();
  }
  console.log(mobx.comparer.structural({ name: {} }, { name: 'a' }));
  return (
    <div className={UserLess.container}>
      <div className={UserLess.content}>
        <Button onClick={act}>click with action</Button>
        <p>userNum: {mobxApiStore.userNum}</p>
        <UserCreateForm mobxApiStore={mobxApiStore} renderUserName={renderUserName} />
        <UserList mobxApiStore={mobxApiStore} />
      </div>
    </div>
  );
};
console.log(MobxApi);

export default inject((store) => ({
  mobxApiStore: store.mobxApiStore,
}))(MobxApi);
