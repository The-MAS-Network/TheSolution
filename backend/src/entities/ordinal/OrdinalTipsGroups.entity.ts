import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { generatePrimaryKey } from "../../utilities";
import { OrdinalTips } from "./OrdinalTips.entity";
import { OrdinalCollections } from "./OrdinalCollections.entity";

export enum GroupType {
  SINGLE_TIP = "single_tip",
  GROUP_TIP = "group_tip",
}

@Entity({
  orderBy: {
    createdAt: "DESC",
  },
})
export class OrdinalTipsGroups {
  @PrimaryColumn()
  id: string = generatePrimaryKey();

  @Column({ type: "int" })
  totalTip: number;

  @Column({ type: "int" })
  totalSent: number;

  @Column({ type: "int", default: 0 })
  individualAmount: number;

  @Column({
    length: 20,
  })
  currency: string;

  @Column({ length: 100, nullable: true, default: null })
  dollarPrice: string;

  @Column({ length: 100, nullable: true, default: null })
  dollarValue: string;

  @Column({ length: 100, nullable: true, default: null })
  dollarSource: string;

  @OneToMany(() => OrdinalTips, (value) => value.id, { nullable: true })
  ordinalTips: OrdinalTips[];

  @OneToOne(() => OrdinalTips, (value) => value.singleOrdinalTip, {
    nullable: true,
  })
  @JoinColumn()
  singleTip: Relation<OrdinalTips>;

  @ManyToOne(() => OrdinalCollections, (value) => value.id)
  ordinalCollection: OrdinalCollections;

  @Column({
    type: "enum",
    enum: GroupType,
  })
  type: GroupType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
