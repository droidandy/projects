import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';


@Injectable()
export class DataProvider {
  // Data Provider
  // This is the provider class for most of the Firebase observables in the app.
  roleList:any=[
                {name:'Fashion Designer',checked:false},
                {name:'Fashion Stylist',checked:false},
                {name:'Fashion Photographer',checked:false},
                {name:'Model',checked:false},
                {name:'Makeup Artist',checked:false},
                {name:'Hair Stylist',checked:false},
                {name:'Other',checked:false}
              ]
  filterRoleList:any=[
                {name:'Fashion Designer',checked:false},
                {name:'Fashion Stylist',checked:false},
                {name:'Fashion Photographer',checked:false},
                {name:'Model',checked:false},
                {name:'Makeup Artist',checked:false},
                {name:'Hair Stylist',checked:false},
                {name:'Other',checked:false}
              ];
  constructor(public angularfire: AngularFireDatabase) {
    console.log("Initializing Data Provider");
  }

  calcDate(date1,date2) {
    console.log(date1,date2);
    var diff = Math.floor(date1.getTime() - date2.getTime());
    var day = 1000 * 60 * 60 * 24;

    var days = Math.floor(diff/day);
    var months = Math.floor(days/31);
    var years = Math.floor(months/12);


    var message = days + " days "
    message += months + " months "
    message += years + " years ago \n"

    return message
    }


  getRole(){
    return this.roleList;
  }

  setFilterRole(roleList){
    return this.filterRoleList=roleList;
  }
  getFilterRole(){
    return this.filterRoleList;
  }
  // Get all users
  getUsers() {
    return this.angularfire.list('/accounts', ref => ref.orderByChild('name'));
  }

  // Get user with username
  getUserWithUsername(username) {
    return this.angularfire.list('/accounts', ref => ref.orderByChild('username').equalTo(username));
  }

  // Get logged in user data
  getCurrentUser() {
    return this.angularfire.object('/accounts/' + firebase.auth().currentUser.uid);
  }

  // Get logged in user data
  getAllUser() {
    return this.angularfire.object('/accounts');
  }

  // Get user by their userId
  getUser(userId) {
    return this.angularfire.object('/accounts/' + userId);
  }

  // Get requests given the userId.
  getRequests(userId) {
    return this.angularfire.object('/requests/' + userId);
  }

  // Get friend requests given the userId.
  getFriendRequests(userId) {
    return this.angularfire.list('/requests', ref => ref.orderByChild('receiver').equalTo(userId));
  }

  // Get conversation given the conversationId.
  getConversation(conversationId) {
    return this.angularfire.object('/conversations/' + conversationId);
  }

  // Get conversations of the current logged in user.
  getConversations() {
    return this.angularfire.list('/accounts/' + firebase.auth().currentUser.uid + '/conversations');
  }

  // Get messages of the conversation given the Id.
  getConversationMessages(conversationId) {
    return this.angularfire.object('/conversations/' + conversationId + '/messages');
  }

  // Get messages of the group given the Id.
  getGroupMessages(groupId) {
    return this.angularfire.object('/groups/' + groupId + '/messages');
  }

  // Get groups of the logged in user.
  getGroups() {
    return this.angularfire.list('/accounts/' + firebase.auth().currentUser.uid + '/groups');
  }

  // Get group info given the groupId.
  getGroup(groupId) {
    return this.angularfire.object('/groups/' + groupId);
  }

  getJobs(){
    return this.angularfire.list('/jobs');
  }


  getBlockedLists(){
    return this.angularfire.list('/accounts/' + firebase.auth().currentUser.uid + '/conversations', ref => ref.orderByChild('blocked').equalTo(true));
  }

  block(userId) {
     this.angularfire.object('accounts/'+firebase.auth().currentUser.uid+'/conversations/'+userId).update({
      blocked: true
    });
  }

  spamUser(userId) {
    console.log(firebase.auth().currentUser.uid);
     this.angularfire.object('accounts/'+firebase.auth().currentUser.uid+'/spam/'+userId).update({
      reportspam: true
    });
  }


}
