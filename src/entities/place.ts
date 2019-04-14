import {
    OneToOne, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, PrimaryColumn,
    OneToMany, Check, ManyToMany
} from "typeorm";
import {Photo} from "./photo";

@Entity("Place")
export class Place {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    content: string;

    @OneToMany(type => Photo, photo => photo.place )
    attachedPhotoIds: Photo[];
}