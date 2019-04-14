import { IEnv, DevEnv } from "../IEnv";
import { buildApp } from "./app";
import * as express from "express";

/*
    start express server
 */
//
console.log("start express server");
const env: IEnv = new DevEnv();
console.log("starting express server...");
buildApp(env)
    .then((app: express.Express) => {
        const server = app.listen(app.get("port"), () => {
            console.log(
                "  App is running at http://localhost:%d",
                app.get("port")
            );
            console.log("  Press CTRL-C to stop\n");
        });
    })
    .catch(reason => {
        console.log("  starting express server failed.");
        console.log(reason);
    });