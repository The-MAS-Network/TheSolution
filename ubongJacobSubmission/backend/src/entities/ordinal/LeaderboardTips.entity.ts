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
export class LeaderboardTips {
  @PrimaryColumn()
  id: string = generatePrimaryKey();

  @Column({ type: "int" })
  totalTip: number;

  @OneToOne(() => Users, (user) => user.ordinalWallet, { onDelete: "CASCADE" })
  @JoinColumn()
  user: Relation<Users>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
