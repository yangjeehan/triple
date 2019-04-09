import {IEnv} from "./IEnv";
import { Container, interfaces } from "inversify";
import "reflect-metadata"
import express from "express";
import { interfaceBindKey } from "./interface_bind_key";
import {PointController} from "./controllers/point";
import bodyParser = require("body-parser");
import compression from "compression";
import expressValidator from "express-validator";
import {PointService} from "./services/point";

export async function buildContainer(env: IEnv) {
    const container: interfaces.Container = new Container();
    container.bind(interfaceBindKey.env).toConstantValue(env);

    const app = express();
    container.bind<express.Express>(interfaceBindKey.express).toConstantValue(app);

    app.set("port", env.getPort());
    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(expressValidator());

    container.bind(interfaceBindKey.pointService).to(PointService).inSingletonScope();

    container.bind(PointController).to(PointController).inSingletonScope();
    app.post("/point", container.get(PointController).postPoint());

    return container;
}


export async function buildApp(env: IEnv): Promise<express.Express> {
    return (await buildContainer(env)).get<express.Express>(interfaceBindKey.express);
}