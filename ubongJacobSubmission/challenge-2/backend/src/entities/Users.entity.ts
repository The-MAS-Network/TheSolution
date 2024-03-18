import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { createId } from "@paralleldrive/cuid2";
import { BtcPayServerPayments } from "./BtcPayServerPayments.entity";

@Entity({
  orderBy: {
    createdAt: "DESC",
  },
})
export class Users {
  @PrimaryColumn()
  id: string = createId();

  @Column({
    length: 255,
  })
  nickName: string;

  @Column({
    length: 255,
    unique: true,
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

  @OneToMany(() => BtcPayServerPayments, (value) => value.id)
  btcPayServerPayments: BtcPayServerPayments[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
