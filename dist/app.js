"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const interface_bind_key_1 = require("./interface_bind_key");
const point_1 = require("./controllers/point");
const bodyParser = require("body-parser");
const compression_1 = __importDefault(require("compression"));
const express_validator_1 = __importDefault(require("express-validator"));
const point_2 = require("./services/point");
function buildContainer(env) {
    return __awaiter(this, void 0, void 0, function* () {
        const container = new inversify_1.Container();
        container.bind(interface_bind_key_1.interfaceBindKey.env).toConstantValue(env);
        const app = express_1.default();
        container.bind(interface_bind_key_1.interfaceBindKey.express).toConstantValue(app);
        app.set("port", env.getPort());
        app.use(compression_1.default());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(express_validator_1.default());
        container.bind(interface_bind_key_1.interfaceBindKey.pointService).to(point_2.PointService).inSingletonScope();
        container.bind(point_1.PointController).to(point_1.PointController).inSingletonScope();
        app.post("/point", container.get(point_1.PointController).postPoint());
        return container;
    });
}
exports.buildContainer = buildContainer;
function buildApp(env) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield buildContainer(env)).get(interface_bind_key_1.interfaceBindKey.express);
    });
}
exports.buildApp = buildApp;
//# sourceMappingURL=app.js.map