import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  mysqlEnum,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { generatePrimaryKey } from "../utilities";
import enums from "./enums";

const uniquePkId = varchar("id", { length: 50 })
  .$defaultFn(generatePrimaryKey)
  .primaryKey()
  .notNull();

export const AdminTable = mysqlTable("admins", {
  email: varchar("email", { length: 255 }).notNull().unique().primaryKey(),
  password: varchar("password", { length: 1024 }).notNull(),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
export type IAdmin = InferSelectModel<typeof AdminTable>;
export type ICreateAdmin = InferInsertModel<typeof AdminTable>;

export const OtpTable = mysqlTable("otps", {
  id: uniquePkId,
  otp: varchar("otp", { length: 10 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  purpose: mysqlEnum("purpose", [
    enums.onboarding,
    enums.forgotPassword,
  ]).notNull(),
  isUsed: boolean("is_used").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const OrdinalCollectionsTable = mysqlTable("ordinal_collections", {
  id: uniquePkId,
  numericId: serial("numeric_id"),
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
export type IOrdinalCollections = InferSelectModel<
  typeof OrdinalCollectionsTable
>;
export type ICreateOrdinalCollections = InferInsertModel<
  typeof OrdinalCollectionsTable
>;

export const OrdinalsTable = mysqlTable(enums.oridnalsTableName, {
  id: uniquePkId,
  ordinalId: varchar("ordinal_id", { length: 150 }).notNull(),
  ordinalNumber: varchar("ordinal_number", { length: 50 }).notNull(),
  possibleOrdinalContent: varchar("possible_ordinal_content", { length: 2000 }),
  mimeType: varchar("mime_type", { length: 255 }).notNull(),
  contentType: varchar("content_type", { length: 255 }).notNull(),
  ordinalCollectionId: varchar(enums.ordinalCollectionIdColumnName, {
    length: 50,
  })
    .references(() => OrdinalCollectionsTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type IOrdinals = InferSelectModel<typeof OrdinalsTable>;
export type ICreateOrdinals = InferInsertModel<typeof OrdinalsTable>;

export const OrdinalCollectionRelations = relations(
  OrdinalCollectionsTable,
  ({ many }) => ({
    ordinals: many(OrdinalsTable),
  })
);

export const OrdinalRelations = relations(OrdinalsTable, ({ one }) => ({
  ordinalCollection: one(OrdinalCollectionsTable, {
    fields: [OrdinalsTable.ordinalCollectionId],
    references: [OrdinalCollectionsTable.id],
  }),
}));

// export const OrdinalToOrdinalCollectionTable = mysqlTable(
//   "ord_to_ord_collection",
//   {
//     ordinalId: varchar("ord_id", { length: 50 })
//       .references(() => OrdinalsTable.id)
//       .notNull(),
//     ordinalCollectionId: varchar("ord_col_id", { length: 50 })
//       .references(() => OrdinalCollectionsTable.id)
//       .notNull(),
//   },
//   (table) => ({
//     pk: primaryKey({ columns: [table.ordinalId, table.ordinalCollectionId] }),
//   })
// );

// export const OrdinalsTableRelations = relations(OrdinalsTable, ({ many }) => ({
//   OrdinalToOrdinalCollectionTable: many(OrdinalToOrdinalCollectionTable),
// }));

// export const OrdinalCollectionsTableRelations = relations(
//   OrdinalCollectionsTable,
//   ({ many }) => ({
//     OrdinalToOrdinalCollectionTable: many(OrdinalToOrdinalCollectionTable),
//   })
// );

// export const OrdinalToOrdinalCollectionTableRelations = relations(
//   OrdinalToOrdinalCollectionTable,
//   ({ one }) => ({
//     ordinals: one(OrdinalsTable, {
//       fields: [OrdinalToOrdinalCollectionTable.ordinalId],
//       references: [OrdinalsTable.id],
//     }),
//     ordinalsCollections: one(OrdinalCollectionsTable, {
//       fields: [OrdinalToOrdinalCollectionTable.ordinalCollectionId],
//       references: [OrdinalCollectionsTable.id],
//     }),
//   })
// );
