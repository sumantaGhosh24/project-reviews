import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  text,
} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  imageUrl: varchar("image_url").notNull(),
  imagePublicId: varchar("image_public_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  content: text("content"),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  price: integer("price").notNull(),
  discount: integer("discount").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  url: varchar("url").notNull(),
  publicId: varchar("public_Id").notNull(),
  blurHash: varchar("blur_hash").notNull(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
});

export const categoriesRelations = relations(categories, ({many}) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({one, many}) => ({
  categories: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  productImages: many(productImages),
}));

export const productImagesRelations = relations(productImages, ({one}) => ({
  products: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));
