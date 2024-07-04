import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { generatePrimaryKey } from "../../utilities";
import { OTPPurpose } from "../../utilities/enums";

@Entity({
  orderBy: {
    createdAt: "DESC",
  },
})
export class AdminOTPS {
  @PrimaryColumn()
  id: string = generatePrimaryKey();

  @Column({
    length: 10,
  })
  otp: string;

  @Column({
    length: 255,
  })
  email: string;

  @Column({
    type: "enum",
    enum: OTPPurpose,
  })
  purpose: OTPPurpose;

  @Column({
    default: false,
  })
  isUsed: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
