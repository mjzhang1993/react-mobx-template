/**
 * 不封装，直接使用 mobx + react 的案例
 * */

import { observer } from 'mobx-react';
import originalStore from './OriginalStore';
import UserCreateForm from './view/UserCreateForm';
import UserList from './view/UserList';
import UserLess from './style/user.less';

const Origin: React.FC = () => {
  React.useEffect(() => {
    originalStore.fetchUsers();
  }, []);
  console.log('original container render');
  return (
    <div className={UserLess.container}>
      <div className={UserLess.content}>
        <p>userNum: {originalStore.userNum}</p>
        <UserCreateForm originalStore={originalStore} />
        <UserList originalStore={originalStore} />
      </div>
    </div>
  );
};

export default observer(Origin);
