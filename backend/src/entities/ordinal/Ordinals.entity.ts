import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { generatePrimaryKey } from "../../utilities";
import { OrdinalCollections } from "./OrdinalCollections.entity";
import { Users } from "../Users.entity";

@Entity({
  orderBy: {
    createdAt: "DESC",
  },
})
export class Ordinals {
  @PrimaryColumn()
  id: string = generatePrimaryKey();

  @Column({
    length: 150,
    unique: true,
  })
  ordinalId: string;

  @Column({
    length: 2000,
    nullable: true,
    default: null,
  })
  possibleOrdinalContent: string;

  @Column({
    length: 255,
  })
  mimeType: string;

  @Column({
    length: 255,
  })
  contentType: string;

  @Column({
    default: false,
  })
  isAdmin: boolean;

  @ManyToOne(() => Users, (user) => user.id, {
    onDelete: "SET NULL",
    nullable: true,
  })
  user: Users;

  @ManyToMany(() => OrdinalCollections, (value) => value.ordinals)
  ordinalCollections: OrdinalCollections[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
