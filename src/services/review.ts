import {inject, injectable} from "inversify";
import {interfaceBindKey} from "../interface_bind_key";
import {ITypeormService} from "./typeorm";
import {Photo} from "../entities/photo";
import {User} from "../entities/user";
import {Review} from "../entities/review";
import {Place} from "../entities/place";
import {IPointService, PointService} from "./point";
import {PointType, SAVE_POINT_VALUE} from "../utils/point_type_code";
import {IPointHistoryService} from "./pointHistory";
import {__await} from "tslib";

export interface IReviewService {

    // 리뷰를 작성한다
    writeReview(reviewId : string ,content : any, attachedPhotoIds: string[], userId: string, placeId: string): Promise<void>;
    modifyReview(reviewId : string ,content : any, attachedPhotoIds: string[], userId: string, placeId: string ): Promise<void>;
    deleteReview(reviewId : string ,content : any, attachedPhotoIds: string[], userId: string, placeId: string ): Promise<void>;
}


@injectable()
export class ReviewService implements IReviewService{

    private readonly typeormService: ITypeormService;
    private readonly pointService: IPointService;

    public constructor(@inject(interfaceBindKey.typeormService) typeormService: ITypeormService,
                       @inject(interfaceBindKey.pointService) pointService: IPointService) {
        this.typeormService = typeormService;
        this.pointService = pointService;
    }
    /*
    public constructor(  typeormService : ITypeormService,  pointService: PointService) {
        this.typeormService = typeormService;
        this.pointService = pointService;
    }*/

    public async writeReview(reviewId: string, content: string, attachedPhotoIds: string[], userId: string, placeId: string) {

        console.log("call writeReview")
        // 1. review을 디비에 등록
        await this.insertReviewInfo(reviewId, content, attachedPhotoIds, userId, placeId).then( () => {
            this.saveBonusPoint(userId, reviewId, content, attachedPhotoIds, placeId);
        })

    }

    private async saveBonusPoint(userId: string, reviewId: string, content: string, attachedPhotoIds: string[], placeId: string ) : Promise<void>{
        console.log("call saveBonusPointWhenAdd")
        // 내용이 1글자 이상 1점
        if ( content.length >= 1 ) {
            //savePoint( userId: string, reviewId: string, pointType: string, amount: number ): Promise<void>;
            await this.pointService.savePoint(userId, reviewId, PointType.CONTENT_POINT, SAVE_POINT_VALUE.DEFAULT);
        }

        // 1장이상 사진 첨부 1점
        if (attachedPhotoIds.length >= 1) {
            if( attachedPhotoIds[0] != "" ) {
                await this.pointService.savePoint(userId, reviewId, PointType.ATTACH_PHOTO_BONUS_POINT, SAVE_POINT_VALUE.DEFAULT);
            }
        }

        // 특정장소에 첫 리뷰작성 1점
        await this.searchFirstReview(placeId).then(reviewSize =>{
            if( reviewSize == 1 ) {
                this.pointService.savePoint(userId, reviewId, PointType.FIRST_PLACE_REVIEW, SAVE_POINT_VALUE.DEFAULT);
            }
        })
    }

    // review중 placeId을 찾는다.
    private async searchFirstReview(placeId: string) : Promise<number> {
        console.log("call searchFirstReview : " + placeId )
        try {
            let place = new Place();
            place.id = placeId;

            const conn = this.typeormService.getConnection();
            const reviewRepo  = conn.getRepository(Review);
            let cnt = await reviewRepo
                .count({ where: {place: place } })

            return cnt;

        } catch (e) {
            console.log(e);
        }

    }

    private async insertReviewInfo(reviewId: string, content: any, attachedPhotoIds: string[], userId: string, placeId: any) : Promise<void> {
        console.log("call insertReviewInfo");
        try {

            let user = new User();
            user.id = userId;

            let place = new Place();
            place.id = placeId;

            const photos : Photo[]= []
            attachedPhotoIds.forEach(function (element) {
                let photo = new Photo();
                photo.id = element;
                photos.push(photo);
            })

            let date = new Date();
            
            let review = new Review();
            review.id = reviewId;
            review.content = content;
            review.attachedPhotoIds = photos;
            review.user = user;
            review.place = place;
            review.reviewDate = date.toString();

            const conn = this.typeormService.getConnection();
            const reviewRepo  = conn.getRepository(Review);
            await reviewRepo
                .save(review)
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

    // TODO
    public async modifyReview(reviewId: string, content: any, attachedPhotoIds: string[], userId: string, placeId: string): Promise<void> {
        return undefined;
    }

    // TODO
    public async deleteReview(reviewId: string, content: any, attachedPhotoIds: string[], userId: string, placeId: string): Promise<void> {
        return undefined;
    }

    public async getReviewCount(): Promise<number> {
        console.log("get reviewCount")
        try {

            let review = new Review();

            const conn = this.typeormService.getConnection();
            const reviewRepo  = conn.getRepository(Review);
            const result = await reviewRepo.findAndCount();

            let cnt = 0;
            if( result ){
                cnt = result[1];
            }
            return cnt;

        } catch (e) {
            console.log(e);
        }
    }
}