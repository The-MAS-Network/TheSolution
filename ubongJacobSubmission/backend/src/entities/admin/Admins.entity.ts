import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({
  orderBy: {
    createdAt: "DESC",
  },
})
export class Admins {
  @PrimaryColumn({
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    length: 255,
  })
  password: string;

  @Column({
    default: false,
  })
  isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
