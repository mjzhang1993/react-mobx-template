import { TGlobalStore } from 'store';

class MobxApiStore {
  private readonly global: TGlobalStore;
  public users: { name: string; tel: number }[] = [];
  public userSet = new Set();
  public userMap = new Map();
  public currentUser: MobxApiStore['users'][number] = { name: '', tel: 0 };

  public get userNum(): number {
    return this.users.length;
  }

  public increaseUser = (user: { name: string; tel: number }) => {
    // 使用 Mobx 可观察数据 追加 api 时
    (this.users as Mobx.TObservableArray<MobxApiStore['users'][number]>).clear();
    (this.userMap as Mobx.TObservableMap<string, any>).merge({ name: user });
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

    getApi.then((users: MobxApiStore['users']) => {
      // 异步的更新 store 操作需要通过 runInAction 包裹
      mobx.runInAction(() => {
        this.users = users;
      });
    });
  };

  public resetRemote = () => {
    this.global.remoteStore.currentRemote.scope = 'nwe scope';
  };
}

export default MobxApiStore;
