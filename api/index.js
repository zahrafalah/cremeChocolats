require("@babel/register")({
  extends: "./.node.babelrc",
  extensions: [".js", ".jsx", ".ts", ".tsx"],
});

import customerRoutes from "./customerRoutes";

import { dashTrackCookieStrategy } from "./customerAuth";

const cors = require("cors");
const express = require("express");
const passport = require("passport");
const morgan = require("morgan");
const followRedirects = require("follow-redirects");

const app = express();

followRedirects.maxBodyLength = 50 * 1024 * 1024;

app.use(
  morgan(function (tokens, req, res) {
    return (
      tokens.method(req, res) +
      " " +
      tokens.url(req, res) +
      " " +
      tokens.status(req, res) +
      ", length: " +
      (tokens.res(req, res, "content-length") || "-") +
      ", customer: " +
      (req.customer ? req.customer.id + " / " + req.customer.email : "-") +
      ", time: " +
      tokens["response-time"](req, res) +
      "ms"
    );
  })
);
// app.use(forceSSL());
app.use(cors());
app.use(express.json({ limit: "420mb" }));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(passport.initialize());

passport.use("dashtrack-cookie", dashTrackCookieStrategy);

customerRoutes(app, express.json({ limit: "420mb" }));

module.exports = app;
