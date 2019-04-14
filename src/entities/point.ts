import {
    OneToOne, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, PrimaryColumn,
    JoinTable, Unique
} from "typeorm";
import {User} from "./user";

@Entity("Point")
export class Point {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    amount: number;

    @OneToOne(type => User)
    @JoinColumn()
    user: User;

}