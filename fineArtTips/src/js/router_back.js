var app = require("./f7init/f7init"),
    { mainView } = app;

const back = () => mainView.router.back();

module.exports = back;
