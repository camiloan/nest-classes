import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { LoginUserDto, CreateUserDto } from "./dto";

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) { }

	async create(createUserDto: CreateUserDto) {
		try {

			const { password, ...userData } = createUserDto;
			const user = this.userRepository.create({
				...userData,
				password: bcrypt.hashSync(password, 10),
			});
			await this.userRepository.save(user);
			const { password: omitted, ...result } = user;
			return result;
		} catch (error) {
			this.handleDBError(error);
		}
	}

	async login(loginUserDto: LoginUserDto) {
		try {
			const user = await this.userRepository.findOne({
				where: {
					email: loginUserDto.email,
				},
				select: ["email", "password"],
			});
			if (!user) {
				throw new BadRequestException("Credentials are not valid (email)");
			}
			const password = await bcrypt.compare(
				loginUserDto.password,
				user.password,
			);
			if (!password) {
				throw new BadRequestException("Credentials are not valid (password)");
			}
			const { password: omitted, ...result } = user;
			return result;

			//TODO Return new jwt token
		} catch (error) {
			this.handleDBError(error);
		}
	}

	private handleDBError(error): never {
		if (error.code === "23505") {
			throw new BadRequestException(error.detail);
		}
		console.log(error);
		throw new BadRequestException("Please check server logs");
	}
}
