/**
 * Created by developercomputer on 25.11.15.
 */
/*
data:
 Account ID: 873827
 FolderID: 9313
 Additionally, I have different lists in the account, i.e. one will
 be for Fine Art-Tips and one will be for
 Arte Divierte. Here are the ideas for these lists, in case you need them:
 Fine Art-Tips (list name: Art Instruction) ID: 29213
 Arte Divierte, ID: 45087
*/

module.exports = {
 init(ln) {
  switch (ln) {
   case "en":
    this.listId = this.listId_FAT;
    break;
   case "es":
    this.listId = this.listId_AD;
    break;
   default:
    this.listId = this.listId_AD;
    break;
  }
 },
 app_id: "nO3SkzRjYVfheQtsoKibnvID0Thn5qFS",
 username: "ArtistLeonardo",
 password: "nNx7H05RtxV",
 account_id: "873827",
 client_folder_id: "9313",
 listId_FAT: "29213", //Fine Art-Tips (list name: Art Instruction),
 listId_AD: "45087", //Arte Divierte (list name: ?),
 listId: null,
 subscribe(email, firstName, win, fail) {
  var headers = {
   "Accept": "application/json",
   "Api-Version": "2.2",
   "Api-AppId":  this.app_id,
   "Api-Username": this.username,
   "API-Password": this.password
  };
  new Promise((resolve, reject) => {
   $$.ajax({
    method: "POST",
    url: `https://app.icontact.com/icp/a/${this.account_id}/c/${this.client_folder_id}/contacts`,
    contentType: "application/json",
    data: JSON.stringify([
     {
      "email": email,
      "firstName": firstName,
      "status": "normal"
     }
    ]),
    headers: headers,
    success: res => resolve(JSON.parse(res)),
    error: err => reject(err)
   });
  })
  .then(
      res => {
       console.log("Win: ", res);
       let contactId = res.contacts[0].contactId;
       const subscriptionId = `${this.listId}_${contactId}`;
       $$.ajax({
        method: "POST",
        url: `https://app.icontact.com/icp/a/${this.account_id}/c/${this.client_folder_id}/subscriptions`,
        contentType: "application/json",
        data: JSON.stringify([
         {
          "subscriptionId": subscriptionId,
          "status": "normal"
         }
        ]),
        headers: headers,
        success(res) {
         res = JSON.parse(res);
         console.log("Another win: ", res);
         if(typeof(win) === "function") {
          win();
         }
        },
        error(e) {
         console.log(e);
         console.warn("Error");
         if(typeof(fail) === "function") {
          fail();
         }
        }
       });
      },
      err => {
       console.warn("Failed: ", err.response);
       if(typeof(fail) === "function") {
        fail();
       }
      }
  );
 }
};
