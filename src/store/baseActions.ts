/**
 * 实现 IBaseStore, 用于给 store 提供通用的方法
 * 这些方法在 store 外可以直接调用
 * 如要要在 store 内调用，请增加相关的类型声明
 * class UserStore {
 *    private readonly global: TGlobalStore;
 *    public updateStore: TUpdateStore<UserStore>;
 * }
 * */
import { STORE_CONST } from './constants';

type TUpdateFn<T> = (storeInstance: T) => void;

const baseActions = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  updateStore(param: {} | TUpdateFn<{}>): void {
    if (typeof param === 'function') {
      param(this);
    } else {
      Object.keys(param).forEach((key: string) => {
        this[key] = param[key];
      });
    }
  },
  resetStore(): void {
    const Constructor = _.get(this, 'constructor');
    const initialData = new Constructor();
    const ignore = [STORE_CONST.GLOBAL_STORE_NAME.toString()].concat(Object.keys(baseActions));

    Object.keys(initialData).forEach((key: string) => {
      const value = initialData[key];
      if (_.isFunction(value) || ignore.includes(key)) return;

      this[key] = value;
    });
  },
};

type Reset<T, K extends keyof T, O> = {
  [P in keyof T]: P extends K ? O : T[P];
};

type TempBaseActions = typeof baseActions;
// eslint-disable-next-line @typescript-eslint/ban-types
export type TUpdateStore<T extends {}> = (param: Partial<T> | TUpdateFn<T>) => void;

export type TBaseActions<T> = Reset<TempBaseActions, 'updateStore', TUpdateStore<T>>;

export default baseActions;
