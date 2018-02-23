/*
   成员列表页
*/

import { observable, computed, action } from 'mobx';
// 将获取数据部分分离出去
import { obtainMemberList, postNewMember, deleteMember } from '../../api/members';

class MemberStore {
   // 将需要观察的属性设置为可观察的
   @observable members;
   @observable filter;

   // 在这里给可观察的属性设置初始值
   constructor() {
      this.members = [];
      this.filter = '';
   }

   // 计算属性
   @computed
   get filtedMembers() {
      const members = [...this.members];
      if (this.filter === '') {
         return members;
      }

      const filterReg = new RegExp(this.filter, 'g');

      return members.filter(({ name, tel }) => filterReg.test(name) || filterReg.test(tel));
   }

   // 动作，代码专注于更新可观察属性，额外的操作分离出去
   @action
   changeMembers = members => {
      this.members = members;
   };
   @action
   changeFilter = newFilter => {
      this.filter = newFilter;
   };

   /*
      一些函数，包含更新可观察属性的部分已经被分离为 action
      在 action 中使用异步函数或者 promise 都比较麻烦，所以尽可能的分离，
      据文档指出，不但 异步函数需要被 @action 
      await 后的代码如果更改了可观察属性，需要使用 runInAction 包裹
   */

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
