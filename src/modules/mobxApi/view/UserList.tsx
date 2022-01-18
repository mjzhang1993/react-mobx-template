import { Checkbox } from 'antd';
import { TGlobalStore, convert } from 'store';

import UserLess from '../style/user.module.less';

interface Props {
  mobxApiStore: TGlobalStore['mobxApiStore'];
}

const UserList: React.FC<Props> = (props: Props) => {
  const { mobxApiStore } = props;

  function deleteUser(username: string) {
    mobxApiStore.decreaseUser(username);
  }

  function selectUser(user: { name: string; tel: number }) {
    mobxApiStore.updateStore({ currentUser: user });
  }
  console.log('render User List');
  const currentUser = mobxApiStore.currentUser;
  return (
    <ul className={UserLess.main}>
      <li>
        <span>姓名</span>
        <span>电话</span>
      </li>
      {mobxApiStore.users.map((user: { name: string; tel: number }) => {
        return (
          <li key={user.name}>
            <Checkbox onChange={() => selectUser(user)} checked={currentUser.name === user.name} />
            <span>{user.name}</span>
            <span>{user.tel}</span>
            <a onClick={() => deleteUser(user.name)}>DELETE</a>
          </li>
        );
      })}
    </ul>
  );
};

export default convert(UserList);
