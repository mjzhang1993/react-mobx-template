/**
 * mobx 初始化，兼容非 Proxy 浏览器
 * */
import { configure } from 'mobx';

configure({
  useProxies: 'ifavailable',
  enforceActions: 'observed',
  reactionRequiresObservable: true,
});
