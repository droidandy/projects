// invalidate babel cache require filesystem changes
// version 0

module.exports = {
  API_URL: process.env.API_URL || "https://api.tradekoo.com",
  NODE_ENV: process.env.NODE_ENV || "development",
  SERVER_PORT: process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT, 10) : 3000,
  BASE_URL: process.env.BASE_URL || "http://localhost:3000"
}
