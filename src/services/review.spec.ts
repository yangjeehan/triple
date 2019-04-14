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
import {ReviewService} from "./review";
import {treeAdapters} from "parse5/lib";

//https://tutorialedge.net/typescript/testing-typescript-api-with-jest/

// 유저에 포인트를 적립한다.
// savePoint( userId: string, reviewId: string, pointType: string, amount: number ): Promise<void>;
// 유저에 포인트를 회수한다
// lossPoint( userId: string, reviewId: string, pointType: string, amount: number ): Promise<void>;
// 유저 포인트를 조회하다.
// searchPoint( userId : any ): Promise<Point>;
describe("review test", () => {


    it("리뷰기능 - 리뷰를 남기면 리뷰에 저장된다  ", async () => {

        let reviewService : ReviewService;
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

        pointHistoryService = new PointHistoryService(typeormService);
        pointService = new PointService(typeormService, pointHistoryService);
        reviewService = new ReviewService(typeormService, pointService);

        let userId = "103d2f8c-ebae-45df-bd89-1a79f6c57312";
        let reviewId = "330a0658-dc5f-4878-9381-ebb7b2667773";
        let content = "실헝여 ";
        let attachedPhotoId = ["825e39da-fcbd-487a-9e4a-371a0f5bebfc"];
        let amount = 1;
        let pointType = PointType.FIRST_PLACE_REVIEW;
        let placeId = "e10ad976-b5a3-4ff5-94bb-e2df0c61450c";

        let cnt1 = await reviewService.getReviewCount();

        console.log("0000000000")
        console.log(cnt1)
        await reviewService.writeReview(reviewId, content, attachedPhotoId, userId, placeId);
        await new Promise(resolve => setTimeout(()=>resolve(), 300)).then(()=>console.log("fired"));
        let cnt2 = await reviewService.getReviewCount();

        console.log("0000000000")

        console.log(cnt2)
        if( cnt1 == undefined) {

            cnt1 = 0;
        }
        assert.notStrictEqual(cnt1, cnt2);
    });

    it("리뷰등록기능 - 글자수가 1이상이면 포인트 1이 추가됌  ", async () => {

        let reviewService : ReviewService;
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

        pointHistoryService = new PointHistoryService(typeormService);
        pointService = new PointService(typeormService, pointHistoryService);
        reviewService = new ReviewService(typeormService, pointService);

        let userId = "103d2f8c-ebae-45df-bd89-1a79f6c57312";
        let reviewId = "44450658-abcd-4878-9381-ebb7b2668883";
        let content = "포인트 추가 테스트 3";
        let attachedPhotoId :string[] = [];
        let placeId = "e10ad976-b5a3-4ff5-94bb-e2df0c61450c";

        let point1 =await pointService.searchPoint(userId);
        await reviewService.writeReview(reviewId, content, attachedPhotoId, userId, placeId);
        await new Promise(resolve => setTimeout(()=>resolve(), 300)).then(()=>console.log("fired"));
        let point2 = await pointService.searchPoint(userId);

        console.log( (point1.amount+1)  )
        console.log(point2.amount)

        assert.strictEqual( (point1.amount+1 ), point2.amount);
    });


    it("리뷰등록기능 - 사진이 첨부되면 포인트 1이 추가됌  ", async () => {

        let reviewService : ReviewService;
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

        pointHistoryService = new PointHistoryService(typeormService);
        pointService = new PointService(typeormService, pointHistoryService);
        reviewService = new ReviewService(typeormService, pointService);

        let userId = "103d2f8c-ebae-45df-bd89-1a79f6c57312";
        let reviewId = "44450658-abcd-4878-9381-ebb7b2668883";
        let content = "";
        let attachedPhotoId :string[] = ["147bef20-29eb-4cf5-9e47-45b1351d0843"];
        let placeId = "e10ad976-b5a3-4ff5-94bb-e2df0c61450c";

        let point1 =await pointService.searchPoint(userId);
        await reviewService.writeReview(reviewId, content, attachedPhotoId, userId, placeId);
        await new Promise(resolve => setTimeout(()=>resolve(), 300)).then(()=>console.log("fired"));
        let point2 = await pointService.searchPoint(userId);


        assert.strictEqual( (point1.amount+1 ), point2.amount);
    });

    it.only("리뷰등록기능 - 최초 place 등록시 포인트 1이 추가됌  ", async () => {

        let reviewService : ReviewService;
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
        reviewService = new ReviewService(typeormService, pointService);

        let userId = "103d2f8c-ebae-45df-bd89-1a79f6c57312";
        let reviewId = "77770658-xxxs-4878-9311-ebb7b2999002";
        let content = "리듀등록 최초 place테스트";
        let attachedPhotoId :string[] = [];
        let placeId = "103d2f8c-yyyy-ssss-xxxx-1a79f6c573aa";

        let point1 =await pointService.searchPoint(userId);
        await reviewService.writeReview(reviewId, content, attachedPhotoId, userId, placeId);
        await new Promise(resolve => setTimeout(()=>resolve(), 300)).then(()=>console.log("fired"));
        let point2 = await pointService.searchPoint(userId);


        assert.strictEqual( (point1.amount+2 ), point2.amount);
    });

});