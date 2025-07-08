import { BaseModel } from 'src/common/entities/base.entity';
import { UserModel } from './user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsDate } from 'class-validator';

@Entity()
export class RelationshipModel extends BaseModel {
  @ManyToOne(() => UserModel, (user) => user.followers)
  follower: UserModel;

  @ManyToOne(() => UserModel, (user) => user.followees)
  followee: UserModel;

  @Column({
    type: 'timestamptz',
    nullable: true,
    default: null,
  })
  @IsDate()
  confirmedAt: Date;
}
