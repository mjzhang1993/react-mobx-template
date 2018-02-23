/*
   App 应用总容器
*/
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import AppCom from '../components/App/index';

@inject('app') // 给组件注入其需要的 store，指定对应的子 store 名称
@observer // 将组件转化为响应式组件
export default class App extends Component {
   constructor(props) {
      super(props);
   }
   render() {
      const { app: { title } } = this.props;

      return <AppCom title={title}>{this.props.children}</AppCom>;
   }
}
