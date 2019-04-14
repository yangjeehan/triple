import {IEnv} from "../IEnv";
import { Container, interfaces } from "inversify";
import "reflect-metadata"
import express from "express";
import { interfaceBindKey } from "./interface_bind_key";
import {EventController} from "./controllers/event";
import bodyParser = require("body-parser");
import compression from "compression";
import expressValidator from "express-validator";

import * as lusca from "lusca";
import {ITypeormService, TypeormService} from "./services/typeorm";
import {PointService} from "./services/point";
import {ReviewService} from "./services/review";
import {PointHistoryService} from "./services/pointHistory";


export async function buildContainer(env: IEnv) {

    const container: interfaces.Container = new Container();

    container.bind(interfaceBindKey.env).toConstantValue(env);
    const app = express();
    container.bind<express.Express>(interfaceBindKey.express).toConstantValue(app);
    container.bind<ITypeormService>(interfaceBindKey.typeormService).toConstantValue(await TypeormService.getInstance(env.getDbConf()));
    app.set("port", env.getPort());
    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(expressValidator());

    app.use(lusca.xframe("SAMEORIGIN"));
    app.use(lusca.xssProtection(true));

    container.bind(interfaceBindKey.pointService).to(PointService).inSingletonScope();
    container.bind(interfaceBindKey.reviewService).to(ReviewService).inSingletonScope();
    container.bind(interfaceBindKey.pointHistoryService).to(PointHistoryService).inSingletonScope();

    container.bind(EventController).to(EventController).inSingletonScope();
    app.post("/events", container.get(EventController).postEvents());

    return container;
}


export async function buildApp(env: IEnv): Promise<express.Express> {
    return (await buildContainer(env)).get<express.Express>(interfaceBindKey.express);
}