import {
    Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, PrimaryColumn, OneToOne,
    Unique
} from "typeorm";
import {Point} from "./point";
import {User} from "./user";
import {Review} from "./review";
import {Place} from "./place";

@Entity("PointHistory")
@Index(["user", "review", "id"], { unique : true })
export class PointHistory{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(type => User, user => user.id)
    user: User;

    @ManyToOne(type => Review, review => review.id)
    review: Review;

    @Column()
    amount: number;

    @Column()
    totalUserPoint: number;

    @Column()
    action: string;

    @Column()
    revision: number;

    @Column()
    pointType: string;

    @Column()
    historyDate: string;

}