import {inject, injectable} from "inversify";
import {IEnv} from "../../IEnv";
import {interfaceBindKey} from "../interface_bind_key";
import {ITypeormService} from "./typeorm";
import {User} from "../entities/user";
import {Connection} from "mysql";
import {Review} from "../entities/review";
import {LOSS_POINT_VALUE, PointAction, SAVE_POINT_VALUE} from "../utils/point_type_code";
import {Column, PrimaryGeneratedColumn} from "typeorm";
import {Point} from "../entities/point";
import {IPointHistoryService} from "./pointHistory";

export interface IPointService {

    // 유저에 포인트를 적립한다.
    savePoint( userId: string, reviewId: string, pointType: string, amount: number ): Promise<void>;
    // 유저에 포인트를 회수한다
    lossPoint( userId: string, reviewId: string, pointType: string, amount: number ): Promise<void>;
    // 유저 포인트를 조회하다.
    searchPoint( userId : any ): Promise<Point>;
}

@injectable()
export class PointService {
    private readonly typeormService: ITypeormService;
    private readonly pointHistoryService: IPointHistoryService;

    public constructor( @inject(interfaceBindKey.typeormService) typeormService : ITypeormService, @inject(interfaceBindKey.pointHistoryService) pointHistoryService: IPointHistoryService) {
        this.typeormService = typeormService;
        this.pointHistoryService = pointHistoryService;
    }

    public async savePoint(userId: string, reviewId: string ,pointType: string, amount: number ) : Promise<void>{

        console.log("call savePoint")
        try {
            await this.registryPointByUser(userId, reviewId, pointType, amount, PointAction.SAVE);
        } catch (e) {
            console.log(e);
        }
    }

    public async lossPoint(userId: string, reviewId: string, pointType: string, amount: number ) : Promise<void> {
        console.log("call lossPoint")

        try {
            let lossAmount = amount * -1;
            await this.registryPointByUser(userId, reviewId, pointType, amount, PointAction.LOSS);
        } catch (e) {
            console.log(e);
        }
    }

    private async registryPointByUser(userId: string, reviewId: string, pointType: string, amount: number, action: string ) : Promise<void> {
        console.log("call registryPointByUser")

        try {
            // 1. 해당 유저의 포인트를 가져온다.
            this.searchPoint(userId).then((point : Point) => {
                console.log(point)
                if( point == undefined ){
                    this.insertAddedPoint(userId, point, amount).then(totalAmount => {
                        // history에 업데이트
                        this.pointHistoryService.loggingPointHistory(userId, reviewId, amount, action, pointType, totalAmount);
                    }).catch(err =>{
                        console.log(err)
                    })
                } else {
                    // point을 업데이트
                    this.updateAddedPoint(userId, point, amount).then(totalAmount => {
                    // history에 업데이트
                        this.pointHistoryService.loggingPointHistory(userId, reviewId, amount, action, pointType, totalAmount);
                    }).catch(err =>{
                        console.log(err)
                    })
                }
            })
        } catch (e) {
            console.log(e);
        }
    }

    public async searchPoint(userId : any) : Promise<Point> {
        console.log("call searchPointByUser")

        try {
            const conn = this.typeormService.getConnection();
            const pointRepo  = conn.getRepository(Point);

            let user = new User();
            user.id = userId;

            let point : Point = await pointRepo.findOne({user : user});
            return point;
        } catch (e) {
            console.log(e);
        }

    }

    private async updateAddedPoint(userId: string, point: Point, amount : number) : Promise<number> {
        console.log("call updateAddedPoint")
        try {
            let totalAmount = ( point.amount + amount );
            const conn = this.typeormService.getConnection();
            conn.createQueryBuilder()
                .update(Point)
                .set({ amount: totalAmount})
                .where("userId = :user", {user : userId})
                .execute();
            console.log(totalAmount)


            return totalAmount;

        } catch (e) {
            console.log(e);
        }
    }


    private async insertAddedPoint(userId: string, point: Point, amount: number) : Promise<number> {
        console.log("call updateAddedPoint")
        try {
            let user = new User();
            user.id = userId;

            let point = new Point();
            point.amount = amount;
            point.user = user;

            const conn = this.typeormService.getConnection();
            const pointRepo = conn.getRepository(Point);
            await pointRepo.save(point);

            return amount;

        } catch (e) {
            console.log(e);
        }
    }
}