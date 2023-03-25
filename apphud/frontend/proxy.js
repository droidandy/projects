const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
app.use(cors());
app.use(
  "/",
  createProxyMiddleware({
    target: process.env.API,
    changeOrigin: true,
    onProxyRes(proxyRes, req, res) {
      proxyRes.headers["Access-Control-Allow-Origin"] = "*"
    }
  })
);

app.listen(3001);
