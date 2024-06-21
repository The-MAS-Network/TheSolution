import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { generatePrimaryKey } from "../../utilities";
import { Users } from "../Users.entity";

@Entity({
  orderBy: {
    createdAt: "DESC",
  },
})
export class OrdinalWallets {
  @PrimaryColumn()
  id: string = generatePrimaryKey();

  @Column({
    length: 255,
  })
  onChainWallet: string;

  @Column({
    length: 255,
    nullable: true,
    default: null,
  })
  transactionId: string;

  @Column({
    length: 255,
  })
  address: string;

  @Column({
    default: false,
  })
  isVerified: boolean;

  @Column({
    default: false,
  })
  isBroadcasted: boolean;

  @OneToOne(() => Users, (user) => user.ordinalWallet, { onDelete: "CASCADE" })
  @JoinColumn()
  user: Relation<Users>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
