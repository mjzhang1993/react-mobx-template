import { makeAutoObservable, runInAction } from 'mobx';

class OriginalStore {
  public users: { name: string; tel: number }[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public get userNum(): number {
    return this.users.length;
  }

  public increaseUser = (user: { name: string; tel: number }) => {
    this.users.push(user);
  };

  public decreaseUser = (username: string) => {
    const idx = this.users.findIndex(
      (user: { name: string; tel: number }) => user.name === username,
    );

    this.users.splice(idx, 1);
  };

  public fetchUsers = () => {
    const getApi = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          { name: 'xiaozhang', tel: 19029 },
          { name: 'bnaiding', tel: 17723 },
        ]);
      }, 3000);
    });

    getApi.then((users: OriginalStore['users']) => {
      // 异步的更新 store 操作需要通过 runInAction 包裹
      runInAction(() => {
        this.users = users;
      });
    });
  };
}

export type TOriginalStore = OriginalStore;

export default new OriginalStore();
