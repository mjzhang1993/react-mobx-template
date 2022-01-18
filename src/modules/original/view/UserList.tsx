import { observer } from 'mobx-react';
import { TOriginalStore } from '../OriginalStore';
import UserLess from '../style/user.module.less';

interface Props {
  originalStore: TOriginalStore;
}

const UserList: React.FC<Props> = (props: Props) => {
  const { originalStore } = props;

  function deleteUser(username: string) {
    originalStore.decreaseUser(username);
  }
  console.log('render User List');
  return (
    <ul className={UserLess.main}>
      <li>
        <span>姓名</span>
        <span>电话</span>
      </li>
      {originalStore.users.map((user: { name: string; tel: number }) => {
        return (
          <li key={user.name}>
            <span>{user.name}</span>
            <span>{user.tel}</span>
            <a onClick={() => deleteUser(user.name)}>DELETE</a>
          </li>
        );
      })}
    </ul>
  );
};

export default observer(UserList);
