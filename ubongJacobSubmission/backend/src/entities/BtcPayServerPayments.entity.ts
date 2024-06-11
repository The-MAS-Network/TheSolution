import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { generatePrimaryKey } from "../utilities";
import { Users } from "./Users.entity";

export enum InvoicePurpose {
  FORGOT_PASSWORD = "forgot_password",
  VERIFY_ACCOUNT = "verify_account",
}

export type CreateInvoicePurpose = "forgot_password" | "verify_account";
@Entity({
  orderBy: {
    createdAt: "DESC",
  },
})
export class BtcPayServerPayments {
  @PrimaryColumn()
  id: string = generatePrimaryKey();

  @Column({
    type: "enum",
    enum: InvoicePurpose,
  })
  purpose: InvoicePurpose;

  @Column()
  amount: number;

  @Column({
    length: 130,
  })
  transactionId: string;

  @Column({
    length: 600,
  })
  destination: string;

  @Column({
    length: 20,
  })
  currency: string;

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

  @ManyToOne(() => Users, (user) => user.id, { onDelete: "CASCADE" })
  user: Users;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @Column({
  //   length: 255,
  // })
  // storeId: string;

  // @Column({
  //   length: 255,
  // })
  // storeTransactionId: string;

  // @Column({
  //   type: "mediumtext",
  //   nullable: true,
  //   default: null,
  // })
  // paymentHash: string;

  // @Column({
  //   type: "mediumtext",
  // })
  // checkoutLink: string;

  // @Column({
  //   length: 255,
  // })
  // amount: string;

  // @Column({
  //   length: 255,
  // })
  // currency: string;

  // @Column({
  //   type: "mediumtext",
  //   nullable: true,
  //   default: null,
  // })
  // destination: string;
}
