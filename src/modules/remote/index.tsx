import { Button, Row, Col, Form, Input } from 'antd';
import { TGlobalStore, inject } from 'store';
import DynamicSystem from '../../components/DynamicSystem';

interface Props {
  remoteStore: TGlobalStore['remoteStore'];
}

class DynamicRemote extends React.Component<Props> {
  componentDidMount() {
    const { remoteStore } = this.props;
    console.log('didmount');
    mobx.reaction(
      () => remoteStore.currentRemote.scope,
      (val) => {
        console.log('update', val);
      },
      {
        fireImmediately: false, // 立即执行 (reaction)
        delay: 0, // 第二个参数函数延迟执行毫秒数 (autorun reaction)
        // timeout: 0, // when 等待的截止时间，过时则 reject
      },
    );
  }

  onFinish = (values: TGlobalStore['remoteStore']['currentRemote']) => {
    const { remoteStore } = this.props;
    remoteStore.updateRemote(values);
  };

  val = () => {
    const { remoteStore } = this.props;
    return mobx.computed(() => remoteStore.currentRemote.scope).get();
  };

  resetUser = () => {
    const { remoteStore } = this.props;
    remoteStore.resetUser();
  };

  render(): React.ReactNode {
    const { remoteStore } = this.props;
    const scope = remoteStore.currentRemote.scope;
    const remoteUrl = remoteStore.currentRemote.remoteUrl;
    const module = remoteStore.currentRemote.module;

    console.log('render remote');
    return (
      <div>
        <Button onClick={this.resetUser}>reset user</Button>
        <Row>
          <Col span={8}>scope: {scope}</Col>
          <Col span={8}>remoteUrl: {remoteUrl}</Col>
          <Col span={8}>module: {module}</Col>
        </Row>
        <Form onFinish={this.onFinish}>
          <Form.Item label="remoteUrl" name="remoteUrl">
            <Input />
          </Form.Item>
          <Form.Item label="scope" name="scope">
            <Input />
          </Form.Item>
          <Form.Item label="module" name="module">
            <Input />
          </Form.Item>
          <Form.Item label="module" name="module">
            <Button type="primary" htmlType="submit">
              Get Dynamic Remote App
            </Button>
          </Form.Item>
        </Form>
        <div style={{ width: '100%', height: 'auto', border: '1px solid red' }}>
          <DynamicSystem
            module={module}
            remoteUrl={remoteUrl}
            scope={scope}
            store={{ counter: 0 }}
          />
        </div>
      </div>
    );
  }
}

export default inject((store) => {
  return { remoteStore: store.remoteStore };
})(DynamicRemote);
