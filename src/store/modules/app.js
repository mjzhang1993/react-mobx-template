import { observable } from 'mobx';

class AppStore {
   @observable title = '标题';
}

export default new AppStore();
