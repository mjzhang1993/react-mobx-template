import { observable } from 'mobx';

class AppStore {
   @observable title = '标题';
}

// 返回的是一个实例
export default new AppStore();
