import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { LoginUserDto, CreateUserDto } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./interfaces/jwt-payload.interface";

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly jwtService: JwtService,
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
			return {
				...result,
				token: this.getJwtToken({
					id: result.id,
				}),
			};
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
				select: ["email", "password", "id"],
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
			return {
				...result,
				token: this.getJwtToken({
					id: result.id,
				}),
			};
		} catch (error) {
			this.handleDBError(error);
		}
	}

	async checkAuthStatus(user: User) {

		return {

			...user,
			token: this.getJwtToken({
				id: user.id,
			}),
		};
	}

	private getJwtToken(payload: JwtPayload) {
		const token = this.jwtService.sign(payload);
		return token

	}

	private handleDBError(error): never {
		if (error.code === "23505") {
			throw new BadRequestException(error.detail);
		}
		console.log(error);
		throw new BadRequestException("Please check server logs");
	}
}
