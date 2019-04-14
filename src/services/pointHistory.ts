import {inject, injectable} from "inversify";
import {interfaceBindKey} from "../interface_bind_key";
import {ITypeormService} from "./typeorm";
import {User} from "../entities/user";
import {PointHistory} from "../entities/pointHistory";
import {Review} from "../entities/review";

export interface IPointHistoryService {

    /* {
         "type": "REVIEW",
         "action": "ADD", "MOD", "DELETE"
            "reviewId": "240a0658-dc5f-4878-9381-ebb7b2667772",
            "content": "좋아요!",
            "attachedPhotoIds": ["e4d1a64e-a531-46de-88d0-ff0ed70c0bb8", "afb0cef2-851d-4a50-bb07-9cc15cbdc332"],
            "userId": "3ede0ef2-92b7-4817-a5f3-0c575361f745",
            "placeId": "2e4baf1c-5acb-4efb-a1af-eddada31b00f"
        }     */
    // 유저 포인트 history를 기록한다.
    loggingPointHistory( userId : string ,reviewId : string ,amount : number, action: string, pointType: string, totalUserPoint: number): Promise<void>;

}

@injectable()
export class PointHistoryService implements IPointHistoryService {

    private readonly typeormService: ITypeormService;

    public constructor( @inject(interfaceBindKey.typeormService) typeormService: ITypeormService) {
        this.typeormService = typeormService;
    }
  /*
    public constructor( typeormService: ITypeormService) {
        this.typeormService = typeormService;
    }*/

    public async loggingPointHistory(userId: string, reviewId: string, amount: number, action: string, pointType: string, totalUserPoint: number ): Promise<void> {
        console.log("call loggingPointHistory")
        try {
            // 1. reviewId와 userId을 통해 revision 아이디를 가져온다.
            // revision : reviewId와 userId을 통해 구한 history의 등수
            this.getRevisionByUserIdAndReviewID(userId, reviewId).then(revision => {
                console.log( 'revision ' + revision);
                // point에 대한 기록을 남김
                this.insertPointHistory(userId, reviewId, amount, action, pointType, revision, totalUserPoint);
            })
        } catch (e) {
            console.log(e);
        }

    }

    private async insertPointHistory(userId: string, reviewId: string, amount: number, action: string, pointType: string, revision: number, totalUserPoint: number ): Promise<void> {
        console.log("call insertPointHistory")
        try {

            let user = new User();
            user.id = userId;

            let review = new Review();
            review.id = reviewId;

            let date = new Date();

            let pointHistory = new PointHistory();
            pointHistory.user = user;
            pointHistory.review = review;
            pointHistory.amount = amount;
            pointHistory.action = action;
            pointHistory.revision = revision;
            pointHistory.pointType = pointType;
            pointHistory.totalUserPoint = totalUserPoint;
            pointHistory.historyDate = date.toString()

            const conn = this.typeormService.getConnection();
            const pointHistoryRepo  = conn.getRepository(PointHistory);
            var result = await pointHistoryRepo
                .save(pointHistory)
                .then(post => console.log("post has been saved : ", post))
                .catch(error => {
                        console.log("Cannot save Error ", error);
                        // return Error(error);
                    }
                );

        } catch (e) {
            console.log(e);
        }
    }

    private async getRevisionByUserIdAndReviewID(userId: string, reviewId: string): Promise<number> {

        var revision = -1;
        try {
            let user = new User();
            user.id = userId;

            let review = new Review();
            review.id = reviewId;

            const conn = this.typeormService.getConnection();
            const pointHistoryRepo  = conn.getRepository(PointHistory);
            const result : PointHistory = await pointHistoryRepo.createQueryBuilder("point_history")
                .andWhere("(point_history.user = :userId AND point_history.review = :reviewId)")
                .orderBy("point_history.revision", "DESC")
                .setParameters({ userId: userId , reviewId: reviewId})
                .getOne();

            if (result == undefined) {
                revision = 0;
            } else {
                revision = result.revision + 1;
            }

        } catch (e) {
            console.log(e);
        }

        return revision;
    }


    public async getPointHistoryCount(): Promise<number> {
        console.log("get getPointHistoryCount")
        try {


            let pointHistory = new PointHistory();


            const conn = this.typeormService.getConnection();
            const pointHistoryRepo  = conn.getRepository(PointHistory);
            const result = await pointHistoryRepo.findAndCount();

            let cnt = 0;
            if( result != undefined){
                cnt = result[1];
            }
            return cnt;

        } catch (e) {
            console.log(e);
        }
    }


}