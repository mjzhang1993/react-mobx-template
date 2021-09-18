/**
 * store 汇总, 并建立 store 间通信的桥梁
 * */
import { Observer } from 'mobx-react';
import enhanceStore from './enhanceStore';
import createContext from './createStoreContext';
import { disposeOnUnmount } from './disposeOnUnmount';
import RemoteStore from '../modules/remote/RemoteStore';
import MobxApiStore from '../modules/mobxApi/MobxApiStore';
import ClassicComStore from '../modules/classicCom/ClassicComStore';
import FuncComStore from '../modules/functionalCom/FuncComStore';
import FuncRefComStore from '../modules/funcWithRefCom/FuncRefComStore';

class GlobalStore {
  public remoteStore = enhanceStore(new RemoteStore(), this);
  public mobxApiStore = enhanceStore(new MobxApiStore(), this);
  public classicComStore = enhanceStore(new ClassicComStore(), this);
  public funcComStore = enhanceStore(new FuncComStore(), this);
  public funcRefComStore = enhanceStore(new FuncRefComStore(), this);

  // 可以挂载一些全局方法，这些方法不能以 Store 结尾，否则会被限制在 store 外的访问
  public handleError = () => {};
  public handleSuccess = () => {};
}

export type TGlobalStore = GlobalStore;

const { Provider, StoreContext, useStore, inject, convert } = createContext<TGlobalStore>();

// 以后组件中关于 Store 的引用，尽量只出自这个文件
export * from './baseActions';
export { Provider, StoreContext, useStore, inject, convert, Observer, disposeOnUnmount };

export default new GlobalStore();
