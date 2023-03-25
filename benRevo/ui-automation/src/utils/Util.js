import {Selector} from 'testcafe';


export default class Util {
    constructor() {
        this.getElementsByTagNameSelector = Selector(tag => document.getElementsByTagName(tag));
    }

    getElementsByTagName(tag, options) {
        if (options && options.withAttribute !== null && options.withAttribute.attributeName !== null && options.withAttribute.attributeValue !== null) {
            return this.getElementsByTagNameSelector(tag).withAttribute(options.withAttribute.attributeName, options.withAttribute.attributeValue).with({
                visibilityCheck: false
            });
        } else if (options && options.withText !== null && options.withText.textValue !== null) {
            return this.getElementsByTagNameSelector(tag).withText(options.withText.textValue).with({
                visibilityCheck: false
            });
        }
    }

    getTodayDate() {
        var date = new Date();
        var month = date.getUTCMonth() + 1,
            day = date.getUTCDate(),
            year = date.getUTCFullYear();

        if (month.toString().length == 1) {
            month = "0" + month;
        }

        if (day.toString().length == 1) {
            day = "0" + day;
        }
        return (month + "/" + day + "/" + year);
    }

    getFullTodayDate() {
        const date = new Date();
        let month = date.getUTCMonth(),
            day = date.getUTCDate(),
            hours = date.getUTCHours(),
            minutes = date.getUTCMinutes(),
            seconds = date.getUTCSeconds(),
            year = date.getUTCFullYear();
        return (`${year}.${month}.${day} ${hours}:${minutes}:${seconds}`);
    }

 
}