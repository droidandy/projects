const env = process.env.NODE_ENV;
const params = require(`./${env}.json`);

console.log('HOST --->', params.API_HOST);
console.log('ENV --->', process.env.NODE_ENV);

export default params;
