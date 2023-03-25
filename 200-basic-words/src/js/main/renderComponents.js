var flux = require('../flux/FluxInit.js');
var ReactDOM = require("react-dom"),
    React = require("react"),
    SearchInput = require("../components/SearchInput.js"),
    WordsList = require('../components/WordsList.js'),
    MainHeader = require('../components/MainHeader.js'),
    LangSelect = require('../components/LangSelect'),
    dict = require('../dictionary.json');

module.exports = () => {
    ReactDOM.render(<MainHeader flux={flux} />, Dom7('#main-header')[0]);
    ReactDOM.render(<LangSelect type='langFrom' flux={flux} />, Dom7('.popover-lang-from')[0]);
    ReactDOM.render(<LangSelect type='langTo' flux={flux} />, Dom7('.popover-lang-to')[0]);
    ReactDOM.render(<SearchInput flux={flux} />, Dom7('.main-searchbar')[0]);
    ReactDOM.render(<SearchInput flux={flux} />, Dom7('.favorites-searchbar')[0]);
    ReactDOM.render(<WordsList type={"all"}  flux={flux} />, document.getElementById('words-list'));
    ReactDOM.render(<WordsList type={"favorites"} flux={flux} />, document.getElementById('favorites-list'));
};
