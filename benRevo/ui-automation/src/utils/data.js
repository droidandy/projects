export default class Data {

    constructor() {

    }

    getClient() {

        return JSON.parse(require("fs").readFileSync("src/resources/client.uhc.json"));

    }
}