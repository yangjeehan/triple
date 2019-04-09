"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DevEnv = /** @class */ (function () {
    function DevEnv() {
    }
    DevEnv.prototype.getDbConf = function () {
        return {
            type: "mysql",
            host: "127.0.0.1",
            port: 3306,
            database: "triple",
            username: "root",
            password: "root",
            synchronize: true
        };
    };
    DevEnv.prototype.getExternalIp = function () {
        return "127.0.0.1";
    };
    DevEnv.prototype.getPort = function () {
        return 3000;
    };
    return DevEnv;
}());
exports.DevEnv = DevEnv;
