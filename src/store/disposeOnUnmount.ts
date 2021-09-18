/**
 * 拷贝自 mobx-react disposeOnUnmount, 由于当前 mobx-react@7.2.0版本中的 disposeOnUnmount 在 IE 10 上导致出错，
 * 因此这里重写了一下 在 mobx-react 升级或者 React 升级后可以尝试取消 hack
 * NOTICE：如果不需要兼容 IE 可以不改写
 * */
/* eslint-disable */
type Disposer = () => void;

// ---------------------------------------

let symbolId = 0;
function createSymbol(name: string): symbol | string {
  if (typeof Symbol === 'function') {
    return Symbol(name);
  }
  const symbol = `__$mobx-react ${name} (${symbolId})`;
  symbolId++;
  return symbol;
}

const createdSymbols = {};
export function newSymbol(name: string): symbol | string {
  if (!createdSymbols[name]) {
    createdSymbols[name] = createSymbol(name);
  }
  return createdSymbols[name];
}

/**
 * Utilities for patching componentWillUnmount, to make sure @disposeOnUnmount works correctly icm with user defined hooks
 * and the handler provided by mobx-react
 */
const mobxMixins = newSymbol('patchMixins');
const mobxPatchedDefinition = newSymbol('patchedDefinition');

export interface Mixins extends Record<string, any> {
  locks: number;
  methods: Array<Function>;
}

function getMixins(target: object, methodName: string): Mixins {
  const mixins = (target[mobxMixins] = target[mobxMixins] || {});
  const methodMixins = (mixins[methodName] = mixins[methodName] || {});
  methodMixins.locks = methodMixins.locks || 0;
  methodMixins.methods = methodMixins.methods || [];
  return methodMixins;
}

function wrapper(realMethod: Function, mixins: Mixins, ...args: Array<any>) {
  // locks are used to ensure that mixins are invoked only once per invocation, even on recursive calls
  mixins.locks++;

  try {
    let retVal;
    if (realMethod !== undefined && realMethod !== null) {
      // @ts-ignore
      retVal = realMethod.apply(this, args);
    }

    return retVal;
  } finally {
    mixins.locks--;
    if (mixins.locks === 0) {
      mixins.methods.forEach((mx) => {
        // @ts-ignore
        mx.apply(this, args);
      });
    }
  }
}

function wrapFunction(realMethod: Function, mixins: Mixins): (...args: Array<any>) => any {
  const fn = function (...args: Array<any>) {
    // @ts-ignore
    wrapper.call(this, realMethod, mixins, ...args);
  };
  return fn;
}

export function patch(target: object, methodName: string, mixinMethod: Function): void {
  const mixins = getMixins(target, methodName);

  if (mixins.methods.indexOf(mixinMethod) < 0) {
    mixins.methods.push(mixinMethod);
  }

  const oldDefinition = Object.getOwnPropertyDescriptor(target, methodName);
  if (oldDefinition && oldDefinition[mobxPatchedDefinition]) {
    // already patched definition, do not repatch
    return;
  }

  const originalMethod = target[methodName];
  const newDefinition = createDefinition(
    target,
    methodName,
    oldDefinition ? oldDefinition.enumerable : undefined,
    mixins,
    originalMethod,
  );

  Object.defineProperty(target, methodName, newDefinition);
}

function createDefinition(
  target: object,
  methodName: string,
  enumerable: any,
  mixins: Mixins,
  originalMethod: Function,
): PropertyDescriptor {
  let wrappedFunc = wrapFunction(originalMethod, mixins);

  return {
    [mobxPatchedDefinition]: true,
    get() {
      return wrappedFunc;
    },
    set(value) {
      if (this === target) {
        wrappedFunc = wrapFunction(value, mixins);
      } else {
        // when it is an instance of the prototype/a child prototype patch that particular case again separately
        // since we need to store separate values depending on wether it is the actual instance, the prototype, etc
        // e.g. the method for super might not be the same as the method for the prototype which might be not the same
        // as the method for the instance
        const newDefinition = createDefinition(this, methodName, enumerable, mixins, value);
        Object.defineProperty(this, methodName, newDefinition);
      }
    },
    configurable: true,
    enumerable,
  };
}

// ---------------------------------------

const protoStoreKey = newSymbol('disposeOnUnmountProto');
const instStoreKey = newSymbol('disposeOnUnmountInst');

function runDisposersOnWillUnmount(this: any) {
  [...(this[protoStoreKey] || []), ...(this[instStoreKey] || [])].forEach((propKeyOrFunction) => {
    const prop =
      typeof propKeyOrFunction === 'string' ? this[propKeyOrFunction] : propKeyOrFunction;
    if (prop !== undefined && prop !== null) {
      if (Array.isArray(prop)) prop.map((f) => f());
      else prop();
    }
  });
}

export function disposeOnUnmount(target: React.Component<any, any>, propertyKey: PropertyKey): void;
export function disposeOnUnmount<TF extends Disposer | Array<Disposer>>(
  target: React.Component<any, any>,
  fn: TF,
): TF;

export function disposeOnUnmount(
  target: React.Component<any, any>,
  propertyKeyOrFunction: PropertyKey | Disposer | Array<Disposer>,
): PropertyKey | Disposer | Array<Disposer> | void {
  if (Array.isArray(propertyKeyOrFunction)) {
    return propertyKeyOrFunction.map((fn) => disposeOnUnmount(target, fn));
  }

  /**
   * 原版 disposeOnUnmount 会校验是否是 类组件，但是在我们用的 React 16.8.x 上不会有预期的结果
   * 因此这里做了下修改，今后可以通过前端开发规范来约束 disposeOnUnmount 的使用
   * */
  // const c = Object.getPrototypeOf(target).constructor;
  // const c2 = Object.getPrototypeOf(target.constructor);
  // // Special case for react-hot-loader
  // const c3 = Object.getPrototypeOf(Object.getPrototypeOf(target));
  if (
    !(
      // c === React.Component ||
      // c === React.PureComponent ||
      // c2 === React.Component ||
      // c2 === React.PureComponent ||
      // c3 === React.Component ||
      // c3 === React.PureComponent ||
      (target instanceof React.Component)
    )
  ) {
    throw new Error(
      '[mobx-react] disposeOnUnmount only supports direct subclasses of React.Component or React.PureComponent.',
    );
  }

  if (
    typeof propertyKeyOrFunction !== 'string' &&
    typeof propertyKeyOrFunction !== 'function' &&
    !Array.isArray(propertyKeyOrFunction)
  ) {
    throw new Error(
      '[mobx-react] disposeOnUnmount only works if the parameter is either a property key or a function.',
    );
  }

  // decorator's target is the prototype, so it doesn't have any instance properties like props
  const isDecorator = typeof propertyKeyOrFunction === 'string';

  // add property key / function we want run (disposed) to the store
  const componentWasAlreadyModified = !!target[protoStoreKey] || !!target[instStoreKey];
  const store = isDecorator
    ? // decorators are added to the prototype store
      target[protoStoreKey] || (target[protoStoreKey] = [])
    : // functions are added to the instance store
      target[instStoreKey] || (target[instStoreKey] = []);

  store.push(propertyKeyOrFunction);

  // tweak the component class componentWillUnmount if not done already
  if (!componentWasAlreadyModified) {
    patch(target, 'componentWillUnmount', runDisposersOnWillUnmount);
  }

  // return the disposer as is if invoked as a non decorator
  if (typeof propertyKeyOrFunction !== 'string') {
    return propertyKeyOrFunction;
  }
}
