import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { generatePrimaryKey } from "../../utilities";
import { OrdinalTipsGroups } from "./OrdinalTipsGroups.entity";

export enum PaymentStatus {
  PENDING = "pending",
  FAILED = "failed",
  SUCCESS = "success",
}

export type PaymentStatusTypes = "pending" | "failed" | "success";

@Entity({
  orderBy: {
    createdAt: "DESC",
  },
})
export class OrdinalTips {
  @PrimaryColumn()
  id: string = generatePrimaryKey();

  @Column({
    length: 130,
  })
  transactionId: string;

  @Column({ type: "int" })
  amount: number;

  @Column({
    length: 20,
  })
  currency: string;

  @Column({
    length: 255,
  })
  lightningAddress: string;

  @Column({
    type: "enum",
    enum: PaymentStatus,
  })
  status: PaymentStatus;

  @Column({
    nullable: true,
    default: null,
    type: "mediumtext",
  })
  imageURL: string;

  @Column({
    length: 255,
    nullable: true,
    default: null,
  })
  error: string;

  @ManyToOne(() => OrdinalTipsGroups, (group) => group.id, { nullable: true })
  ordinalTipGroup: OrdinalTipsGroups;

  @OneToOne(() => OrdinalTipsGroups, (group) => group.singleTip, {
    nullable: true,
  })
  singleOrdinalTip: Relation<OrdinalTipsGroups>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
