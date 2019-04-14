import {
    OneToOne, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, PrimaryColumn, Unique, OneToMany,
    ManyToMany, JoinTable, Check
} from "typeorm";
import {Place} from "./place";
import {Photo} from "./photo";
import {User} from "./user";

@Entity("Review")
@Check(`"likes" < 6`)
export class Review {

    @PrimaryColumn()
    id: string;

    @Column()
    content: string;

    @OneToMany(type => Photo, photo => photo.review )
    attachedPhotoIds: Photo[];

    @Column()
    reviewDate: string;

    // @OneToOne(type => Place)
    // @JoinColumn()
    @ManyToOne(type => Place, place => place.id)
    place: Place;

    // @OneToOne(type => User)
    // @JoinColumn()
    @ManyToOne(type => User, user => user.id)
    user : User;


}