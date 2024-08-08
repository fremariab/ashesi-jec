const functions = require("firebase-functions");
const next = require("next");
const nextConfig = require("../next.config.js");
const nextjsDistDir = nextConfig.distDir || ".next";

// const nextjsDistDir = require("../next.config.js").distDir;
const app = next({dev: false, conf: {distDir: nextjsDistDir}});
const handle = app.getRequestHandler();
exports.nextApp = functions.https.onRequest((req, res) => {
  return app.prepare().then(() => handle(req, res));
});
