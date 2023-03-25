
'use strict';


module.exports = function (User) {
  User.sync({force: true}).then(function () {
    //Table created
    return User.create({
      firstName: 'John',
      lastName: 'Hancock',
      email: 'test@test.te',
      password: 'maryhadalittlelamb',
      username: 'babaBlackSheep',
      avatar: 'goodPic',
      store: []
    });
  });
};

