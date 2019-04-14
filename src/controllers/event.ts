import {inject, injectable} from "inversify";
import {interfaceBindKey} from "../interface_bind_key";
import { StatusCode } from "../utils/status_code";
import * as express from "express";

import {ReviewService} from "../services/review";

@injectable()
export class EventController {

    private readonly reviewService: ReviewService;
    public constructor(@inject(interfaceBindKey.reviewService) reviewService: ReviewService) {
        this.reviewService = reviewService;
    }

    /*
    "type": "REVIEW",
     "action": "ADD",  "MOD", "DELETE"
        "reviewId": "240a0658-dc5f-4878-9381-ebb7b2667772",
        "content": "좋아요!",
        "attachedPhotoIds": ["e4d1a64e-a531-46de-88d0-ff0ed70c0bb8", "afb0cef2-851d-4a50-bb07-9cc15cbdc332"],
        "userId": "3ede0ef2-92b7-4817-a5f3-0c575361f745",
        "placeId": "2e4baf1c-5acb-4efb-a1af-eddada31b00f"

     */
    public postEvents() : express.RequestHandler{
        console.log("call post event")
        const reviewService: ReviewService = this.reviewService;
        return async function (req: express.Request, res: express.Response, next: express.NextFunction) : Promise<void> {

            let type = req.body.type;
            let action = req.body.action;
            let reviewId = req.body.reviewID;
            let content = req.body.content;
            let attachedPhotoIds = req.body.attachedPhotoIds;
            let userId = req.body.userId;
            let placeId = req.body.placeId;

            try {
                if ( type == "REVIEW" ) {

                    if ( action == "ADD") {
                        await reviewService.writeReview(reviewId, content, attachedPhotoIds, userId, placeId);
                        res.status(StatusCode.OK_200).json({ result : "insert success "  });
                    }
                }


            } catch (e ){
                console.log(e);
                res.status(StatusCode.INTERNAL_SERVER_ERROR_500).json({ result : "internal error"  });

            }
        }

    }


}