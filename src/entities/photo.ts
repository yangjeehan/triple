import {
    OneToOne, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, PrimaryColumn,
    OneToMany, Unique
} from "typeorm";
import {Place} from "./place";
import {Review} from "./review";

@Entity("Photo")
export class Photo {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    filePath: string;

    @ManyToOne(type => Review, review => review.attachedPhotoIds)
    review: Review;

    @ManyToOne(type => Place, place => place.attachedPhotoIds)
    place: Place;


}