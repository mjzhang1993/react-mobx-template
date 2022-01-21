import * as lodash from 'lodash';
import * as MobX from 'mobx';
import {IObservableArray, IObservable, ObservableMap, ObservableSet} from 'mobx';

// declare const React: typeof R;
// declare const ReactDOM: typeof RD;

declare global {
  type _ = typeof lodash;
  const mobx: typeof MobX;

  interface Window {
  }

  namespace Mobx {
    export type TObservableArray<T> = IObservableArray<T>;
    export type TObservable = IObservable;
    export type TObservableMap<K, V> = ObservableMap<K, V>;
    export type TObservableSet<T> = ObservableSet<T>;
  }
}
