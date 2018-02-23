/*
   成员列表
*/

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import MemberCom from '../components/member/index';

@inject('member')
@observer
export default class Member extends Component {
   constructor(props) {
      super(props);
   }
   render() {
      const { member } = this.props;

      return <MemberCom member={member} />;
   }
}
