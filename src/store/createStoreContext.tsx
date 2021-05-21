import { observer } from 'mobx-react';
import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

/**
 * 创建通用的 store 数据传递方法
 * */

type GetProps<C> = C extends React.ComponentType<infer P>
  ? C extends React.ComponentClass<P>
    ? React.ClassAttributes<InstanceType<C>> & P
    : P
  : never;

type InjectorRef<C> = C extends React.ComponentType<infer P>
  ? C extends React.ComponentClass<P>
    ? InstanceType<C>
    : C extends React.ForwardRefExoticComponent<
        React.PropsWithoutRef<P> & React.RefAttributes<infer T>
      >
    ? T
    : never
  : never;

type IReactComponent<P = any> =
  | React.ClassicComponentClass<P>
  | React.ComponentClass<P>
  | React.FunctionComponent<P>
  | React.ForwardRefExoticComponent<P>;

// eslint-disable-next-line @typescript-eslint/ban-types
function createContext<T extends {}>() {
  const StoreContext = React.createContext<T>({} as T);

  interface Props {
    store: T;
    children: React.ReactNode;
  }

  // 1. 顶层的 store 包装
  const Provider: React.FC<Props> = (props: Props) => {
    const { store, children } = props;
    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
  };

  // 2. 函数式组件直接获得全量 store
  const useStore = (): T => React.useContext(StoreContext);

  // 3. 函数式 | 类组件，装换为 observer （同时保持 static 方法）
  // eslint-disable-next-line @typescript-eslint/ban-types
  function convert<C extends IReactComponent<{}>>(Component: C) {
    return hoistNonReactStatics(observer(Component), Component);
  }

  // 4. 函数式 | 类组件，注入指定 store 并转换为 observer
  // eslint-disable-next-line @typescript-eslint/ban-types
  function inject<K extends {}>(parseFn: (store: T) => K) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return <C extends IReactComponent<K & {}>>(
      Component: C,
      options: { isObserver: boolean } = { isObserver: true }, // 可用来关闭 observer
    ) => {
      const component = options.isObserver ? observer(Component) : Component;
      const Injector = React.forwardRef(
        (props: Omit<GetProps<C>, keyof K | 'ref'>, ref: React.ForwardedRef<InjectorRef<C>>) => {
          const store = React.useContext(StoreContext);
          const injectedStore = parseFn(store);
          const newProps = { ...props, ...injectedStore, ...(ref ? { ref } : {}) };

          return React.createElement(component, newProps);
        },
      );

      Injector.defaultProps = { ...component.defaultProps };
      Injector.displayName = `inject(${Component.name || Component.displayName})`;
      return hoistNonReactStatics(Injector, Component);
    };
  }

  return { StoreContext, Provider, useStore, inject, convert };
}

export default createContext;
