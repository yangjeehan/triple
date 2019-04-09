import {inject, injectable} from "inversify";
import {interfaceBindKey} from "../interface_bind_key";
import { StatusCode } from "../utils/status_code";
import * as express from "express";
import {IEnv} from "../IEnv";
import {PointService} from "../services/point";

@injectable()
export class PointController {

    private readonly pointService: PointService;
    public constructor(@inject(interfaceBindKey.pointService) pointService: PointService) {
        this.pointService = pointService;
    }

    public postPoint() : express.RequestHandler{

        const pointService: PointService = this.pointService;

        return async function (req: express.Request, res: express.Response, next: express.NextFunction) : Promise<void> {
            console.log("Test");

            
            res.status(StatusCode.INTERNAL_SERVER_ERROR_500).json({ result : "internal error"  });
        }

    }


}