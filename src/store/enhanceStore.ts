/**
 * Store "可观察"化，及 baseAction 融合
 * */
import { makeAutoObservable } from 'mobx';
import { STORE_CONST } from './constants';
import baseActions, { TBaseActions } from './baseActions';

const baseActionsKeys = Object.getOwnPropertyNames(baseActions);

function enhanceStore<T, N>(storeInstance: T, globalStore?: N): T & TBaseActions<T> {
  baseActionsKeys.forEach((key: string) => {
    if (key === 'constructor') return;
    const descriptor = Object.getOwnPropertyDescriptor(baseActions, key);
    Object.defineProperty(storeInstance, key, descriptor!);
  });

  if (globalStore) {
    Object.defineProperty(storeInstance, STORE_CONST.GLOBAL_STORE_NAME, {
      value: globalStore,
      configurable: true,
    });
  }

  // 没有使用 extendObservable 因为会与类中的类型声明发生冲突
  return makeAutoObservable(storeInstance as T & TBaseActions<T>);
}

export default enhanceStore;
