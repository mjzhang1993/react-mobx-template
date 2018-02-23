/*
   MemberCom
*/
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Toolbar from './Toolbar';
import MemberList from './MemberList';

import './member.scss';

/*
   这里有个坑，只要子组件使用了 store 中的可观察属性，
   就需要通过 @observer 将其变成响应式组件
*/

@observer
export default class MemberCom extends Component {
   constructor(props) {
      super(props);
   }
   render() {
      const { filtedMembers, filter, postMember, deleteMember, changeFilter } = this.props.member;

      return (
         <div id="member-container">
            <Toolbar filter={filter} postMember={postMember} changeFilter={changeFilter} />
            <MemberList filtedMembers={filtedMembers} deleteMember={deleteMember} />
         </div>
      );
   }
   componentWillMount() {
      const { getMembers } = this.props.member;
      getMembers();
   }
}
