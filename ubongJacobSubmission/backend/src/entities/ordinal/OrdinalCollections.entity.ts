import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { generatePrimaryKey } from "../../utilities";
import { OrdinalTipsGroups } from "./OrdinalTipsGroups.entity";
import { Ordinals } from "./Ordinals.entity";

@Entity({
  orderBy: {
    createdAt: "DESC",
  },
})
export class OrdinalCollections {
  @PrimaryGeneratedColumn()
  numericId: number;

  @Column({
    unique: true,
  })
  id: string = generatePrimaryKey();

  @Column({
    default: false,
  })
  isActive: boolean;

  @ManyToMany(() => Ordinals, (value) => value.ordinalCollections)
  @JoinTable()
  ordinals: Ordinals[];

  @OneToMany(() => OrdinalTipsGroups, (value) => value.id)
  tipGroups: OrdinalTipsGroups[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
