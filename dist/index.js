"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IEnv_1 = require("./IEnv");
const app_1 = require("./app");
/*
    start express server
 */
//
console.log("start express server");
const env = new IEnv_1.DevEnv();
console.log("starting express server...");
app_1.buildApp(env)
    .then((app) => {
    const server = app.listen(app.get("port"), () => {
        console.log("  App is running at http://localhost:%d", app.get("port"));
        console.log("  Press CTRL-C to stop\n");
    });
})
    .catch(reason => {
    console.log("  starting express server failed.");
    console.log(reason);
});
//# sourceMappingURL=index.js.map