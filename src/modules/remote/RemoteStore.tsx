import { TGlobalStore } from 'store';

class RemoteStore {
  private readonly global: TGlobalStore;
  public counter = 0;
  public currentRemote = {
    scope: '',
    remoteUrl: '',
    module: '',
  };

  public increase = () => {
    this.counter += 1;
  };

  public updateRemote = (remote: Partial<RemoteStore['currentRemote']>) => {
    Object.keys(remote).forEach((key: string) => {
      this.currentRemote[key] = remote[key];
    });
  };

  public resetUser = () => {
    this.global.classicComStore.type = 'xxx';
  };

  public get remoteStr(): string {
    return `${this.currentRemote.scope}:${this.currentRemote.module}@${this.currentRemote.remoteUrl}`;
  }
}

export default RemoteStore;
