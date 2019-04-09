"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DevEnv {
    getDbConf() {
        return {
            type: "mysql",
            host: "127.0.0.1",
            port: 3306,
            database: "triple",
            username: "root",
            password: "root",
            synchronize: true
        };
    }
    getExternalIp() {
        return "127.0.0.1";
    }
    getPort() {
        return 3000;
    }
}
exports.DevEnv = DevEnv;
//# sourceMappingURL=IEnv.js.map