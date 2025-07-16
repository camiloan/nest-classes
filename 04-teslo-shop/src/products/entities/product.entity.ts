import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BeforeInsert,
	BeforeUpdate,
	OneToMany,
	ManyToOne,
} from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "products" })
export class Product {

	@ApiProperty({ example: "d8e7ed66-611b-4303-b01f-8c9f82545940", description: "Product ID", uniqueItems: true })
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ApiProperty({ example: "T-shirt Teslo", description: "Product Title", uniqueItems: true })
	@Column("text", { unique: true })
	title: string;

	@ApiProperty({ example: 0, description: "Product Price" })
	@Column("float", { default: 0 })
	price: number;

	@ApiProperty({ example: "Ullamco reprehenderit proident ex exercitation sit duis voluptate excepteur ea eu nostrud Lorem.", description: "Product Description", default: null })
	@Column({ type: "text", nullable: true })
	description: string;

	@ApiProperty({ example: "mens_t_shirt_teslo", description: "Product Slug", uniqueItems: true })
	@Column("text", { unique: true })
	slug: string;

	@ApiProperty({ example: 10, description: "Product Stock", default: 0 })
	@Column("int", { default: 0 })
	stock: number;

	@ApiProperty({ example: ["XS", "S", "M", "L", "XL", "XXL"], description: "Product Sizes", default: [] })
	@Column("text", { array: true })
	sizes: string[];

	@ApiProperty({ example: "man", description: "Product Gender" })
	@Column("text")
	gender: string;

	@ApiProperty()
	@Column("text", { array: true, default: [] })
	tags: string[];

	//images
	@ApiProperty()
	@OneToMany(
		() => ProductImage,
		(ProductImage) => ProductImage.product,
		{ cascade: true, eager: true },
	)
	images?: ProductImage[];

	@ManyToOne(() => User, user => user.product, { eager: true })
	user: User;

	@BeforeInsert()
	checkSlugInsert() {
		if (!this.slug) {
			this.slug = this.title;
		}
		this.slug = this.slug
			.toLowerCase()
			.replaceAll(" ", "_")
			.replaceAll("'", "");
	}
	@BeforeUpdate()
	checkSlugUpdate() {
		this.slug = this.slug
			.toLowerCase()
			.replaceAll(" ", "_")
			.replaceAll("'", "");
	}
}
