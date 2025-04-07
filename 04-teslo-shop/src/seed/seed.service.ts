import { Injectable } from "@nestjs/common";
import { ProductsService } from "../products/products.service";
import { initialData } from "../seed/data/seed-data";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/auth/entities/user.entity";
import { Repository } from "typeorm";
@Injectable()
export class SeedService {
	constructor(private readonly productsService: ProductsService,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,

	) { }

	async runSeed() {
		await this.deleteTables();
		const adminUser = await this.insertUsers();
		await this.insertNewProducts(adminUser);
		return "SEED EXECUTED";
	}

	private async deleteTables() {
		await this.productsService.deleteAllProducts();

		const queryBuilder = this.userRepository.createQueryBuilder();
		await queryBuilder.delete().where({}).execute();

	}

	private async insertUsers() {
        const seedUsers = initialData.users; // Datos crudos
        const users: User[] = []; // Array para instancias de entidad

        // biome-ignore lint/complexity/noForEach: <explanation>
        seedUsers.forEach(user => {
            // Crea la instancia de la entidad User a partir del objeto plano
            users.push(this.userRepository.create(user)); 
        });

        // Guarda las instancias de entidad que fueron creadas
        const dbUsers = await this.userRepository.save(users); // <--- Usar 'users' aquí

        return dbUsers[0]; 
    }

	private async insertNewProducts(user: User) {
		this.productsService.deleteAllProducts();

		const products = initialData.products;

		const insertPromises = [];

		for (let i = 0; i < products.length; i++) {
			const product = products[i];
			insertPromises.push(this.productsService.create(product, user));
		}

		await Promise.all(insertPromises);
		return true;
	}
}
