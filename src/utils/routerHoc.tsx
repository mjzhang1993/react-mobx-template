/**
 * 一些在 react-router v6 下适用于类组件的 HOC
 * */
import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import type { NavigateFunction, Location, Params } from 'react-router-dom';

type GetProps<C> = C extends React.ComponentType<infer P>
  ? C extends React.ComponentClass<P>
    ? React.ClassAttributes<InstanceType<C>> & P
    : P
  : never;

type GreetProps<C> = JSX.LibraryManagedAttributes<C, GetProps<C>>;

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

type SearchParamsReturnType<T extends (...args: any) => readonly [any, any]> = T extends (
  ...args: any
) => readonly [infer F, infer S]
  ? { searchParams: F; setSearchParams: S }
  : never;

type SearchProps = SearchParamsReturnType<typeof useSearchParams>;

export interface RouterProps extends SearchProps {
  navigate: NavigateFunction;
  location: Location;
  params: Params;
}

type TBoolean<K extends string> = {
  [P in K]?: true;
};

interface IOption {
  ref?: boolean;
  inject?: TBoolean<keyof RouterProps>;
}

export function withRouter<
  C extends IReactComponent<Partial<RouterProps> & { [key: string]: any }>,
  OutProps = Omit<GreetProps<C>, keyof RouterProps>,
>(Component: C, options?: IOption) {
  const opts = {
    ref: _.get(options, 'ref') || false,
    inject: _.get(options, 'inject') || {
      navigate: true,
      location: true,
      params: true,
      searchParams: false,
      setSearchParams: false,
    },
  };

  const RouterCom = opts.ref
    ? React.forwardRef(
        (props: React.PropsWithoutRef<OutProps>, ref: React.ForwardedRef<InjectorRef<C>>) => {
          // 函数式组件的 Hooks 要写在最外层，卸载循环、条件、函数体内都是错误的
          const params = useParams();
          const location = useLocation();
          const navigate = useNavigate();
          const [searchParams, setSearchParams] = useSearchParams();
          const newProps: any = { ...props };
          if (ref) newProps.ref = ref;
          if (opts.inject.params) newProps.params = params;
          if (opts.inject.location) newProps.location = location;
          if (opts.inject.navigate) newProps.navigate = navigate;
          if (opts.inject.searchParams) newProps.searchParams = searchParams;
          if (opts.inject.setSearchParams) newProps.setSearchParams = setSearchParams;

          return React.createElement(Component, newProps as GreetProps<C>);
        },
      )
    : (((props: OutProps) => {
        const params = useParams();
        const location = useLocation();
        const navigate = useNavigate();
        const [searchParams, setSearchParams] = useSearchParams();
        const newProps: any = { ...props };
        if (opts.inject.params) newProps.params = params;
        if (opts.inject.location) newProps.location = location;
        if (opts.inject.navigate) newProps.navigate = navigate;
        if (opts.inject.searchParams) newProps.searchParams = searchParams;
        if (opts.inject.setSearchParams) newProps.setSearchParams = setSearchParams;

        return React.createElement(Component, newProps as GreetProps<C>);
      }) as React.FC<OutProps>);

  RouterCom.displayName = `withRouter(${Component.name || Component.displayName})`;
  return hoistNonReactStatics(RouterCom, Component);
}

export function withNavigate<
  C extends IReactComponent<{ navigate: NavigateFunction; [key: string]: any }>,
>(Component: C, options?: Omit<IOption, 'inject'>) {
  return withRouter(Component, { ...(options || {}), inject: { navigate: true } });
}

export function withLocation<C extends IReactComponent<{ location: Location; [key: string]: any }>>(
  Component: C,
  options?: Omit<IOption, 'inject'>,
) {
  return withRouter(Component, { ...(options || {}), inject: { location: true } });
}

export function withParams<C extends IReactComponent<{ params: Params; [key: string]: any }>>(
  Component: C,
  options?: Omit<IOption, 'inject'>,
) {
  return withRouter(Component, { ...(options || {}), inject: { params: true } });
}

export function withSearchParams<
  C extends IReactComponent<{
    searchParams: SearchProps['searchParams'];
    setSearchParams?: SearchProps['setSearchParams'];
    [key: string]: any;
  }>,
>(Component: C, options?: Omit<IOption, 'inject'>) {
  return withRouter(Component, {
    ...(options || {}),
    inject: { searchParams: true, setSearchParams: true },
  });
}

/**
 * WithRouter 一个用来将路由数据解析并传给子级的组件
 * */
interface WithRouterProps {
  children: (params: RouterProps) => React.ReactElement;
}
export const WithRouter = React.memo((props: WithRouterProps) => {
  const { children } = props;
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    children({
      navigate: useNavigate(),
      location: useLocation(),
      params: useParams(),
      searchParams,
      setSearchParams,
    }) || null
  );
});
