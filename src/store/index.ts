/**
 * store 汇总, 并建立 store 间通信的桥梁
 * */
import enhanceStore from './enhanceStore';
import createContext from './createStoreContext';
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
}

type TGlobalStore = GlobalStore;

const { Provider, StoreContext, useStore, inject, convert } = createContext<TGlobalStore>();

export * from './baseActions';
export { TGlobalStore, Provider, StoreContext, useStore, inject, convert };

export default new GlobalStore();
