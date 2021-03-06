class FuncComStore {
  public users: { name: string; tel: number }[] = [];
  public currentUser: FuncComStore['users'][number] = { name: '', tel: 0 };
  public type = 'LIST';

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

  public clearUsers = () => {
    // 使用 “可观察数据” 追加的 api 时
    (this.users as Mobx.TObservableArray<FuncComStore['users'][number]>).clear();
  };

  public fetchUsers = (options?: { id: string; type: string; storeType: string }) => {
    console.log('fetch user options:', options);
    const getApi = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          { name: 'xiaozhang', tel: 19029 },
          { name: 'bnaiding', tel: 17723 },
        ]);
      }, 3000);
    });

    getApi.then((users: FuncComStore['users']) => {
      // 异步的更新 store 操作需要通过 runInAction 包裹
      mobx.runInAction(() => {
        this.users = users;
      });
    });
  };

  public resetType = () => {
    console.log('store action resetType');
    // this.type = this.type === 'LIST' ? 'EDIT' : 'LIST';
    this.type = '';
  };
}

export default FuncComStore;
