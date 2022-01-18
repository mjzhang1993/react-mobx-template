import { Checkbox } from 'antd';
import { TGlobalStore, convert } from 'store';

import UserLess from '../style/user.module.less';

interface Props {
  classicComStore: TGlobalStore['classicComStore'];
}

class UserList extends React.PureComponent<Props> {
  private deleteUser = (username: string) => {
    const { classicComStore } = this.props;
    classicComStore.decreaseUser(username);
  };

  private selectUser = (user: { name: string; tel: number }) => {
    const { classicComStore } = this.props;
    classicComStore.updateStore({ currentUser: user });
  };

  public render(): React.ReactNode {
    const { classicComStore } = this.props;
    const currentUser = classicComStore.currentUser;
    console.log('render User list');
    return (
      <ul className={UserLess.main}>
        <li>
          <span>姓名</span>
          <span>电话</span>
        </li>
        {classicComStore.users.map((user: { name: string; tel: number }) => {
          return (
            <li key={user.name}>
              <Checkbox
                onChange={() => this.selectUser(user)}
                checked={currentUser.name === user.name}
              />
              <span>{user.name}</span>
              <span>{user.tel}</span>
              <a onClick={() => this.deleteUser(user.name)}>DELETE</a>
            </li>
          );
        })}
      </ul>
    );
  }
}

export default convert(UserList);
