"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IEnv_1 = require("./IEnv");
var app_1 = require("./app");
/*
    start express server
 */
//
console.log("start express server");
var env = new IEnv_1.DevEnv();
console.log("starting express server...");
app_1.buildApp(env)
    .then(function (app) {
    var server = app.listen(app.get("port"), function () {
        console.log("  App is running at http://localhost:%d", app.get("port"));
        console.log("  Press CTRL-C to stop\n");
    });
})
    .catch(function (reason) {
    console.log("  starting express server failed.");
    console.log(reason);
});
