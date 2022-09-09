import customerRoutes from "./api/customerRoutes";

import { dashTrackCookieStrategy } from "./api/customerAuth";

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

if (process.env.NODE_ENV === "production") {
  // Use `x-forwarded-for` header for having client's ip in `req.ip`. This is needed
  // because app is hosted behind the proxy.
  app.enable("trust proxy");

  app.use(express.static(__dirname + "/dist/"));
  // app.use(
  //   "/",
  //   expressStaticGzip(__dirname + "/dist/", {
  //     enableBrotli: true,
  //     orderPreference: ["br", "gz"],
  //     setHeaders: function (res, path) {
  //       res.setHeader("Cache-Control", "public, max-age=31536000");
  //     },
  //   })
  // );
  // console.log("In the prod server");
  // app.get(/.*js/, function (req, res, next) {
  //   req.url = req.url + ".gz";
  //   res.set("Accept-Encoding", "gzip");
  //   next();
  // });
  app.get(/.*/, function (req, res) {
    res.sendFile(__dirname + "/dist/index.html");
  });
}

const PORT = process.env.PORT || 8080;

console.log(`Listening on port ${PORT}`);
app.listen(PORT);
