import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async create(createUserDto: CreateUserDto) {
		try {
			const user = this.userRepository.create(createUserDto);
			await this.userRepository.save(user);
			return user;
		} catch (error) {
			this.handleDBError(error);
		}
	}

	private handleDBError(error): never {
		if (error.code === "23505") {
			throw new BadRequestException("This email is already registered");
		}
		console.log(error);
		throw new BadRequestException("Something went wrong");
	}
}
