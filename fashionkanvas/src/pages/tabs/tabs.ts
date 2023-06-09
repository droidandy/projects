import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController,Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MessagesPage } from '../messages/messages';
import { GroupsPage } from '../groups/groups';
import { FriendsPage } from '../friends/friends';
import { DataProvider } from '../../providers/data';
import { DiscoverPage } from '../discover/discover';
import { JobsPage } from '../jobs/jobs';
import { UserInfoPage } from '../user-info/user-info';
import { Badge } from '@ionic-native/badge';
import * as firebase from 'firebase';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  messages: any = MessagesPage;
  groups: any = GroupsPage;
  friends: any = FriendsPage;
  discover: any = HomePage;
  profile: any = UserInfoPage;
  jobs: any = JobsPage;
  private unreadMessagesCount: any;
  private friendRequestCount: any = 0;
  private unreadGroupMessagesCount: any;
  private groupList: any;
  private groupsInfo: any;
  private conversationList: any;
  private conversationsInfo: any;
  private totalBageCount: any;
  // TabsPage
  // This is the page where we set our tabs.
  constructor(public events: Events,private badge: Badge,public navCtrl: NavController, public navParams: NavParams, public dataProvider: DataProvider, public alertCtrl: AlertController, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    // Get friend requests count.
    this.dataProvider.getRequests(firebase.auth().currentUser.uid).snapshotChanges().subscribe((requestsRes:any) => {
      let requests = requestsRes.payload.val();
      if (requests != null){
        if(requests.friendRequests != null) this.friendRequestCount = requests.friendRequests.length;
        else this.friendRequestCount = null
      } else this.friendRequestCount = null

    });

    // Get conversations and add/update if the conversation exists, otherwise delete from list.
    this.dataProvider.getConversations().snapshotChanges().subscribe((conversationsInfoRes) => {
      let conversationsInfo = [];
      conversationsInfo = conversationsInfoRes.map(c => ({ $key: c.key, ...c.payload.val()}));


      this.conversationsInfo = null;
      this.conversationList = null;
      if (conversationsInfo.length > 0) {
        this.conversationsInfo = conversationsInfo;
        conversationsInfo.forEach((conversationInfo) => {
          if(conversationInfo.blocked != true){
            this.dataProvider.getConversation(conversationInfo.conversationId).snapshotChanges().subscribe((conversationRes) => {
              if (conversationRes.payload.exists()) {
                let conversation:any = { $key: conversationRes.key, ...conversationRes.payload.val()};
                if(conversation.blocked != true)
                  this.addOrUpdateConversation(conversation);
              }
            });
          }
        });

      }
    });

    this.dataProvider.getGroups().snapshotChanges().subscribe((groupIdsRes) => {
      let groupIds = [];
      groupIds = groupIdsRes.map(c => ({ $key: c.key, ...c.payload.val()}));
      if (groupIds.length > 0) {
        this.groupsInfo = groupIds;
        if (this.groupList && this.groupList.length > groupIds.length) {
          // User left/deleted a group, clear the list and add or update each group again.
          this.groupList = null;
        }
        groupIds.forEach((groupId) => {
          this.dataProvider.getGroup(groupId.$key).snapshotChanges().subscribe((groupRes) => {
            let group = {$key: groupRes.key, ... groupRes.payload.val()};
            if (group.$key != null) {
              this.addOrUpdateGroup(group);
            }
          });
        });
      } else {
        this.unreadGroupMessagesCount = null;
        this.groupsInfo = null;
        this.groupList = null;
      }
    });
  }

  // Add or update conversaion for real-time sync of unreadMessagesCount.
  addOrUpdateConversation(conversation) {
    if (!this.conversationList) {
      this.conversationList = [conversation];
    } else {
      var index = -1;
      for (var i = 0; i < this.conversationList.length; i++) {
        if (this.conversationList[i].$key == conversation.$key) {
          index = i;
        }
      }
      if (index > -1) {
        this.conversationList[index] = conversation;
      } else {
        this.conversationList.push(conversation);
      }
    }
    this.computeUnreadMessagesCount();
  }

  // Compute all conversation's unreadMessages.
  computeUnreadMessagesCount() {
    //console.log('this.conversationsInfo====',this.conversationsInfo);
    this.unreadMessagesCount = 0;
    if (this.conversationList) {
      for (var i = 0; i < this.conversationList.length; i++) {
        //console.log(this.conversationsInfo[i].blocked);
        if(!this.conversationsInfo[i].blocked||this.conversationsInfo[i].blocked==undefined){
          this.unreadMessagesCount += this.conversationList[i].messages.length - this.conversationsInfo[i].messagesRead;
        }
        //console.log('step by step===',this.unreadMessagesCount);
        if (this.unreadMessagesCount == 0) {
          this.unreadMessagesCount = null;
        }
      }

    }
    this.setBadge();
  }

  setBadge(){
    var notificationCount=0;
    //console.log('this.totalBageCount==================',this.unreadMessagesCount);
    if(this.unreadGroupMessagesCount){

        notificationCount = this.unreadGroupMessagesCount;
    }

    if(this.unreadMessagesCount){
        notificationCount = notificationCount+this.unreadMessagesCount;
    }
    this.totalBageCount = notificationCount;

    if(this.totalBageCount>0){
      this.badge.set(this.totalBageCount);
    }else{
      this.badge.clear();
    }
  }

  getUnreadMessagesCount() {

    if (this.unreadMessagesCount) {
      if (this.unreadMessagesCount > 0) {
        this.totalBageCount = this.totalBageCount+this.unreadMessagesCount;
        return this.unreadMessagesCount;
      }
    }
    return null;
  }

  // Add or update group
  addOrUpdateGroup(group) {
    if (!this.groupList) {
      this.groupList = [group];
    } else {
      var index = -1;
      for (var i = 0; i < this.groupList.length; i++) {
        if (this.groupList[i].$key == group.$key) {
          index = i;
        }
      }
      if (index > -1) {
        this.groupList[index] = group;
      } else {
        this.groupList.push(group);
      }
    }
    this.computeUnreadGroupMessagesCount();
  }

  // Remove group from list if group is already deleted.
  removeGroup(groupId) {
    if (this.groupList) {
      var index = -1;
      for (var i = 0; i < this.groupList.length; i++) {
        if (this.groupList[i].$key == groupId) {
          index = i;
        }
      }
      if (index > -1) {
        this.groupList.splice(index, 1);
      }

      index = -1;
      for (var j = 0; j < this.groupsInfo.length; j++) {
        if (this.groupsInfo[i].$key == groupId) {
          index = j;
        }
      }
      if (index > -1) {
        this.groupsInfo.splice(index, 1);
      }
      this.computeUnreadGroupMessagesCount();
    }
  }

  // Compute all group's unreadMessages.
  computeUnreadGroupMessagesCount() {
    this.unreadGroupMessagesCount = 0;
    if (this.groupList) {
      for (var i = 0; i < this.groupList.length; i++) {
        if (this.groupList[i].messages) {
          this.unreadGroupMessagesCount += this.groupList[i].messages.length - this.groupsInfo[i].messagesRead;
        }
        if (this.unreadGroupMessagesCount == 0) {
          this.unreadGroupMessagesCount = null;
        }
      }

    }
    this.setBadge();
  }

  getUnreadGroupMessagesCount() {

    if (this.unreadGroupMessagesCount) {
      if (this.unreadGroupMessagesCount > 0) {

        return this.unreadGroupMessagesCount;
      }
    }

    return null;
  }

  gotoDiscover(){
    console.log('dicover page==');
    this.events.publish('home:scrollToTop');
  }
}
