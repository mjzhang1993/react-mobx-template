import { Button, Form, Input, InputNumber } from 'antd';
import { TOriginalStore } from '../OriginalStore';
import UserLess from '../style/user.less';

interface Props {
  originalStore: TOriginalStore;
}

const UserCreateForm: React.FC<Props> = (props: Props) => {
  const { originalStore } = props;
  const onFinish = (values: { name: string; tel: number }) => {
    originalStore.increaseUser(values);
  };

  console.log('render user create Form');
  return (
    <header className={UserLess.header}>
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
