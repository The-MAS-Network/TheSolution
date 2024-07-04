import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { generatePrimaryKey } from "../utilities";
import { BtcPayServerPayments } from "./BtcPayServerPayments.entity";
import { OrdinalWallets } from "./ordinal/OrdinalWallets.entity";
import { Ordinals } from "./ordinal/Ordinals.entity";
import { LeaderboardTips } from "./ordinal/LeaderboardTips.entity";

@Entity({
  orderBy: {
    createdAt: "DESC",
  },
})
export class Users {
  @PrimaryColumn()
  id: string = generatePrimaryKey();

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

  @OneToMany(() => Ordinals, (value) => value.id)
  ordinals: Ordinals[];

  @OneToOne(() => OrdinalWallets, (ordinalWallet) => ordinalWallet.user)
  ordinalWallet: Relation<OrdinalWallets>;

  @OneToOne(() => LeaderboardTips, (tip) => tip.user)
  leaderboardTip: Relation<LeaderboardTips>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
