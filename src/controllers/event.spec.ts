///<reference path="../services/typeorm.ts"/>
import * as request from "supertest"
import {interfaceBindKey} from "../interface_bind_key";
import {ITypeormService, TypeormService} from "../services/typeorm";
import {DevEnv, IEnv} from "../../IEnv";
import {buildContainer} from "../app";
import {Connection} from "typeorm";
import * as typeorm from "typeorm";
import {PointHistory} from "../entities/pointHistory";
import {User} from "../entities/user";
import {Review} from "../entities/review";
import {Point} from "../entities/point";
import {Place} from "../entities/place";
import {Photo} from "../entities/photo";

//https://tutorialedge.net/typescript/testing-typescript-api-with-jest/
describe("GET / - a simple api endpoint", () => {

    let typeormService : any;


    it("insert Code", async () => {
        console.log(__dirname)

        const conn: Connection = await typeorm.createConnection(
            {
                type: "mysql",
                host: "localhost",
                port: 3306,
                username: "yang",
                password: "yang123",
                database: "triple",
                synchronize: false,
                logging: true,
                entities: [   Photo, Place, Point, PointHistory, Review, User],
            });

        // 92c77fc1-67e2-488c-93d8-80eadce38796
        let place = new Place();
        let photo = new Photo;
        photo.id = "92c77fc1-67e2-488c-93d8-80eadce38796";

        type Photos = Array <Photo>;

        let photos : Photos = [
            photo
        ]
        place.content = "일본 좋아여 ~ "
        place.likes = 5;
        place.name = "japan"
        place.attachedPhotoIds = photos;

        const placeRepo  = conn.getRepository(Place);
        // console.log("codeRepo : " + userRepo);

        try {
            var result = await placeRepo
                .save(place)
                .then(post => console.log("post has been saved : ", post))
                .catch(error => {
                        console.log("Cannot save Error ", error);
                        // return Error(error);
                    }
                );

        } catch (e) {
            console.log(e);
        }


/*        User {
            name: '양지한',
                password: '123',
                id: '103d2f8c-ebae-45df-bd89-1a79f6c57312' }*/

/*

Photo {
  name: 'abcd.jpg',
  filePath: '/yjh/photoRepo',
  id: '825e39da-fcbd-487a-9e4a-371a0f5bebfc' }

 name: 'a21521521532525235325235.jpg',
  filePath: '/yjh/photoRepo',
  id: '147bef20-29eb-4cf5-9e47-45b1351d0843'
 */
    });

});