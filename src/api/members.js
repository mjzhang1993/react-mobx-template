/*
   home 的网络请求部分
*/
import { get, post, del } from './request';

export function obtainMemberList() {
   return get('/members').then(res => res.data);
}

export function postNewMember(newMember) {
   if (!newMember.name) {
      return Promise.reject('name is wrong');
   }
   return post('/members', newMember).then(res => res.data);
}

export function deleteMember(memberId) {
   return del(`/members/${memberId}`).then(() => 'success');
}
