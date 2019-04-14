///<reference path="../services/typeorm.ts"/>
import {TypeormService} from "../services/typeorm";
import {DevEnv, IEnv} from "../../IEnv";
import {Point} from "../entities/point";
import {IPointService, PointService} from "./point";
import {PointType} from "../utils/point_type_code";
import * as assert from "assert";
import {buildApp, buildContainer} from "../app";
import {interfaceBindKey} from "../interface_bind_key";
import {interfaces} from "inversify";
import {PointHistory} from "../entities/pointHistory";
import {PointHistoryService} from "./pointHistory";
import {User} from "../entities/user";
import {Review} from "../entities/review";
import {Photo} from "../entities/photo";
import {Place} from "../entities/place";

//https://tutorialedge.net/typescript/testing-typescript-api-with-jest/

// 유저에 포인트를 적립한다.
// savePoint( userId: string, reviewId: string, pointType: string, amount: number ): Promise<void>;
// 유저에 포인트를 회수한다
// lossPoint( userId: string, reviewId: string, pointType: string, amount: number ): Promise<void>;
// 유저 포인트를 조회하다.
// searchPoint( userId : any ): Promise<Point>;
describe("point test", () => {


    it("포인트를 적립기능 - 포인트가 적립되면 값이 달라져ㅑ함  ", async () => {

        let pointService : PointService;
        let pointHistoryService : PointHistoryService;

        let env :any;


        let DbConf = {
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "yang",
            password: "yang123",
            database: "triple",
            synchronize: false,
            logging: true,
            entities: [
                Point, User, PointHistory, Review, Photo, Place
            ]
        };

        let  typeormService= await TypeormService.getInstance(DbConf);
        // console.log(typeormService)

        pointHistoryService = new PointHistoryService(typeormService);
        pointService = new PointService(typeormService, pointHistoryService);

        //userId: string, reviewId: string ,pointType: string, amount: number
        let userId = "103d2f8c-ebae-45df-bd89-1a79f6c57312";
        let reviewId = "240a0658-dc5f-4878-9381-ebb7b2667772";
        let amount = 1;
        let pointType = PointType.FIRST_PLACE_REVIEW;

        // userId: string, reviewId: string, pointType: string, amount: number
        // let point1 : Point = await pointService.searchPoint( userId );
        let point1  = await pointService.searchPoint( userId );
        await pointService.savePoint(userId, reviewId, pointType, amount);
        await new Promise(resolve => setTimeout(()=>resolve(), 300)).then(()=>console.log("fired"));
        let point2  = await pointService.searchPoint( userId );


        if( point1 == undefined) {
            point1 = new Point();
            point1.amount = 0;
        }
        assert.notStrictEqual(point1.amount, point2.amount);
    });

    it.only("포인트를 적립기능 - 포인트가 적립되면 history가 남아야한다 ", async () => {

        let pointService : PointService;
        let pointHistoryService : PointHistoryService;

        let env :any;


        let DbConf = {
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "yang",
            password: "yang123",
            database: "triple",
            synchronize: true,
            logging: true,
            entities: [
                Point, User, PointHistory, Review, Photo, Place
            ]
        };

        let  typeormService= await TypeormService.getInstance(DbConf);

        pointHistoryService = new PointHistoryService(typeormService);
        pointService = new PointService(typeormService, pointHistoryService);
        //getPointHistoryCount()
        //userId: string, reviewId: string ,pointType: string, amount: number
        let userId = "103d2f8c-ebae-45df-bd89-1a79f6c57312";
        let reviewId = "240a0658-dc5f-4878-9381-ebb7b2667772";
        let amount = 1;
        let pointType = PointType.FIRST_PLACE_REVIEW;

        // userId: string, reviewId: string, pointType: string, amount: number
        // let point1 : Point = await pointService.searchPoint( userId );
        let cnt1  = await pointHistoryService.getPointHistoryCount()
        await pointService.savePoint(userId, reviewId, pointType, amount);
        await new Promise(resolve => setTimeout(()=>resolve(), 300)).then(()=>console.log("fired"));
        let cnt2  = await pointHistoryService.getPointHistoryCount()

        console.log(cnt1)
        console.log(cnt2)

        assert.notStrictEqual(cnt1, cnt2);
    });

});