import { Button, Form, Input, InputNumber } from 'antd';
import { TGlobalStore } from 'store';
import { withRouter, RouterProps } from '../../../utils/routerHoc';
import UserLess from '../style/user.module.less';

interface Props extends RouterProps {
  classicComStore: TGlobalStore['classicComStore'];
  renderUserName: () => React.ReactNode;
}

class UserCreateForm extends React.PureComponent<Props> {
  public onFinish = (values: { name: string; tel: number }) => {
    const { classicComStore } = this.props;
    classicComStore.increaseUser(values);
  };

  public render(): React.ReactNode {
    const { renderUserName } = this.props;
    console.log('render create Form');
    return (
      <header className={UserLess.header}>
        {renderUserName && renderUserName()}
        <Form onFinish={this.onFinish}>
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
  }
}

export default withRouter(UserCreateForm);
