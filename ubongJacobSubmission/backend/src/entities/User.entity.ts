import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { createId } from "@paralleldrive/cuid2";

@Entity({
  orderBy: {
    createdAt: "DESC",
  },
})
export class User {
  @PrimaryColumn()
  id: string = createId();

  @Column({
    length: 255,
  })
  nickName: string;

  @Column({
    length: 255,
  })
  lightningAddress: string;

  @Column({
    length: 255,
  })
  password: string;

  @Column({
    nullable: true,
    default: null,
    type: "mediumtext",
  })
  imageURL: string;

  @Column({
    default: false,
  })
  isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
