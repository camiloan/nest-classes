import { Injectable } from "@nestjs/common";
import { ProductsService } from "../products/products.service";
import { initialData } from "../seed/data/seed-data";
@Injectable()
export class SeedService {
	constructor(private readonly productsService: ProductsService) {}

	async runSeed() {
		await this.insertNewProducts();
		return "SEED EXECUTED";
	}

	private async insertNewProducts() {
		this.productsService.deleteAllProducts();

		const products = initialData.products;

		const insertPromises = [];

		for (let i = 0; i < products.length; i++) {
			const product = products[i];
			insertPromises.push(this.productsService.create(product));
		}

		await Promise.all(insertPromises);
		return true;
	}
}
