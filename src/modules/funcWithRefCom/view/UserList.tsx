import { Checkbox } from 'antd';
import { TGlobalStore, convert } from 'store';

import UserLess from '../style/user.less';

interface Props {
  funcRefComStore: TGlobalStore['funcRefComStore'];
}

const UserList: React.FC<Props> = (props: Props) => {
  const { funcRefComStore } = props;

  function deleteUser(username: string) {
    funcRefComStore.decreaseUser(username);
  }

  function selectUser(user: { name: string; tel: number }) {
    funcRefComStore.updateStore({ currentUser: user });
  }
  console.log('render User List');
  const currentUser = funcRefComStore.currentUser;
  return (
    <ul className={UserLess.main}>
      <li>
        <span>姓名</span>
        <span>电话</span>
      </li>
      {funcRefComStore.users.map((user: { name: string; tel: number }) => {
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
