import { Button, Form, Input, InputNumber } from 'antd';
import { TGlobalStore } from 'store';
import UserLess from '../style/user.module.less';

interface Props {
  funcRefComStore: TGlobalStore['funcRefComStore'];
  renderUserName: () => React.ReactNode;
}

const UserCreateForm: React.FC<Props> = (props: Props) => {
  const { funcRefComStore, renderUserName } = props;
  const onFinish = (values: { name: string; tel: number }) => {
    funcRefComStore.increaseUser(values);
  };

  console.log('render user create Form');
  return (
    <header className={UserLess.header}>
      {renderUserName && renderUserName()}
      <Form onFinish={onFinish}>
        <Form.Item label="姓名" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="电话" name="tel">
          <InputNumber />
        </Form.Item>
        <Form.Item label="module" name="module">
          <Button type="primary" htmlType="submit">
            create
          </Button>
        </Form.Item>
      </Form>
    </header>
  );
};

export default React.memo(UserCreateForm);
