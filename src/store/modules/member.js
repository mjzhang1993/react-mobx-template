/*
   成员列表页
*/

import { observable, computed, action } from 'mobx';
import { obtainMemberList, postNewMember, deleteMember } from '../../api/members';

class MemberStore {
   @observable members;
   @observable filter;

   constructor() {
      this.members = [];
      this.filter = '';
   }

   @computed
   get filtedMembers() {
      const members = [...this.members];
      if (this.filter === '') {
         return members;
      }

      const filterReg = new RegExp(this.filter, 'g');

      return members.filter(({ name, tel }) => filterReg.test(name) || filterReg.test(tel));
   }

   @action
   changeMembers = members => {
      this.members = members;
   };
   @action
   changeFilter = newFilter => {
      this.filter = newFilter;
   };

   getMembers = async () => {
      const members = await obtainMemberList();

      this.changeMembers(members);
   };

   postMember = async newMember => {
      await postNewMember(newMember);
      await this.getMembers();
   };

   deleteMember = async memberId => {
      await deleteMember(memberId);
      await this.getMembers();
   };
}

export default new MemberStore();
