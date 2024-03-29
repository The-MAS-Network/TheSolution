import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { createId } from "@paralleldrive/cuid2";
import { Users } from "./Users.entity";

@Entity({
  orderBy: {
    createdAt: "DESC",
  },
})
export class BtcPayServerPayments {
  @PrimaryColumn()
  id: string = createId();

  @Column({
    length: 255,
  })
  storeId: string;

  @Column({
    length: 255,
  })
  storeTransactionId: string;

  @Column({
    length: 255,
  })
  amount: string;

  @Column({
    type: "mediumtext",
  })
  checkoutLink: string;

  @Column({
    length: 255,
  })
  currency: string;

  @Column({
    type: "mediumtext",
    nullable: true,
    default: null,
  })
  destination: string;

  @Column({
    type: "mediumtext",
    nullable: true,
    default: null,
  })
  paymentHash: string;

  @Column({
    length: 255,
    nullable: true,
    default: null,
  })
  lightningAddress: string;

  @Column({
    nullable: true,
    default: null,
  })
  firstPayoutAmount: number;

  @Column({
    nullable: true,
    default: null,
  })
  secondPayoutAmount: number;

  @Column({
    default: 0,
  })
  trialCount: number;

  @Column({
    default: false,
  })
  isVerified: boolean;

  @ManyToOne(() => Users, (user) => user.id)
  user: Users;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
