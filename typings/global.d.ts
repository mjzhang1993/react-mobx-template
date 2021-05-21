import * as lodash from 'lodash';
import * as MobX from 'mobx';
import {IObservableArray, IObservable, ObservableMap, ObservableSet} from 'mobx';

// declare const React: typeof R;
// declare const ReactDOM: typeof RD;

declare global {
  type _ = typeof lodash;
  const mobx: typeof MobX;
  const __webpack_init_sharing__: any;
  const __webpack_share_scopes__: any;

  interface Window {
    __webpack_init_sharing__: any;
    __webpack_share_scopes__: any;
  }

  namespace Mobx {
    export type TObservableArray<T> = IObservableArray<T>;
    export type TObservable = IObservable;
    export type TObservableMap<K, V> = ObservableMap<K, V>;
    export type TObservableSet<T> = ObservableSet<T>;
  }
}
