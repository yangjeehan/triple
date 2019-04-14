import {
    OneToOne, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, PrimaryColumn, Unique
} from "typeorm";

@Entity("User")
// @Unique(["id"])
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    password: string;


}