/*
   MemberList
*/
import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
export default class MemberList extends Component {
   constructor(props) {
      super(props);
   }

   deleteMember(id) {
      console.log('delete', id);
      this.props.deleteMember(id);
   }

   render() {
      const filtedMembers = [...this.props.filtedMembers];

      return (
         <ul className="member-list-container">
            {filtedMembers.map(member => {
               return (
                  <li key={member.id}>
                     <p>tel: {member.tel}</p>
                     <p>name: {member.name}</p>
                     <button onClick={this.deleteMember.bind(this, member.id)}>delete</button>
                  </li>
               );
            })}
         </ul>
      );
   }
}
