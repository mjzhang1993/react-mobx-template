/**
 * Store "可观察"化，及 baseAction 融合
 * */
import { makeAutoObservable } from 'mobx';
import { STORE_CONST } from './constants';
import baseActions, { TBaseActions, Reset } from './baseActions';

const baseActionsKeys = Object.getOwnPropertyNames(baseActions);
const baseActionsDescriptors = {};
baseActionsKeys.forEach((key: string) => {
  baseActionsDescriptors[key] = Object.getOwnPropertyDescriptor(baseActions, key);
});

/**
 * - 一个 GlobalStore 结构如下，业务代码中可以通过诸如 xxxStore.global 来访问
 *  class GlobalStore {
 *    public xxxStore = enhanceStore(new XXXStore(), this); // 挂载的 store
 *    public handleError = handleError; // 一些全局方法
 *    public handleSuccess = handleSuccess;
 *  }
 * - 代码设计上来讲要想使用 global 下的其他 store, 应该通过 inject 注入，
 *   而不是通过 xxxStore.global.otherStore 来实现
 * - 这就需要限制在 store 外对 xxxStore.global 的访问权限
 * - Tips: 目前通过判断 GlobalStore 的 key 是否为 `${infer M}Store` 结构的，来决定是否可访问
 * */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type PickNoStoreKeys<GS, P = keyof GS> = P extends `${infer M}Store` ? never : P;
type TGlobalStoreName = `${STORE_CONST.GLOBAL_STORE_NAME}`;
type TAnnotationKey = `${STORE_CONST.ANNOTATION_OVERRIDE}`;
type TGlobalStore<GS> = {
  [P in TGlobalStoreName]: Pick<GS, PickNoStoreKeys<GS>>;
};
type TOffsetInstance<SI, GS> = Omit<
  Reset<SI & TBaseActions<SI> & TGlobalStore<GS>, TGlobalStoreName, Pick<GS, PickNoStoreKeys<GS>>>,
  TAnnotationKey
>;

function enhanceStore<StoreInstance, GlobalStore>(
  storeInstance: StoreInstance,
  globalStore: GlobalStore,
): TOffsetInstance<StoreInstance, GlobalStore> {
  Object.defineProperty(storeInstance, STORE_CONST.GLOBAL_STORE_NAME, {
    value: globalStore,
    configurable: true,
  });
  const annotationOverrides = storeInstance[STORE_CONST.ANNOTATION_OVERRIDE];
  const overrides =
    annotationOverrides && typeof annotationOverrides === 'object'
      ? { global: false, ...annotationOverrides }
      : { global: false };
  baseActionsKeys.forEach((key: string) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    Object.defineProperty(storeInstance, key, baseActionsDescriptors[key]!);
    overrides[key] = mobx.action.bound;
  });
  // eslint-disable-next-line no-param-reassign
  delete storeInstance[STORE_CONST.ANNOTATION_OVERRIDE];

  return makeAutoObservable(
    storeInstance as TOffsetInstance<StoreInstance, GlobalStore>,
    overrides,
    { autoBind: true },
  );
}

export default enhanceStore;
