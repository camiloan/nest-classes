import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Headers,
	SetMetadata,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto, LoginUserDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "./decorators/get-user.decorator";
import { User } from "./entities/user.entity";
import { RawHeaders } from "./decorators/raw-headers.decorator";
import { IncomingHttpHeaders } from "node:http";
import { UserRoleGuard } from "./guards/user-role/user-role.guard";
import { RoleProtected } from "./decorators/role-protected.decorator";
import { ValidRoles } from "./interfaces";
import { Auth } from "./decorators";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post("register")
	createUser(@Body() createUserDto: CreateUserDto) {
		return this.authService.create(createUserDto);
	}
	@Post("login")
	loginUser(@Body() loginUserDto: LoginUserDto) {
		return this.authService.login(loginUserDto);
	}
	@Get('private')
	@UseGuards(AuthGuard())
	testingPrivateRoute(
		@GetUser() user: User,
		@GetUser('email') userEmail: string,
		@RawHeaders() rawHeaders: string[],
		@Headers() headers: IncomingHttpHeaders,
	) {
		return {
			ok: true,
			message: "Hello World Private",
			user: user,
			userEmail: userEmail,
			rawHeaders: rawHeaders,
			headers: headers,
		}
	}

	// @SetMetadata('roles', ['admin', 'super-user'])
	@Get("private2")
	@RoleProtected(ValidRoles.user)
	@UseGuards(AuthGuard(), UserRoleGuard)
	privateRoute2(
		@GetUser() user: User,
	) {

		return {
			ok: true,
			message: "Hello World Private 2",
			user: user,
		}

	}

	@Get("private3")
	@Auth(ValidRoles.user)
	privateRoute3(
		@GetUser() user: User,
	) {

		return {
			ok: true,
			message: "Hello World Private 3",
			user: user,
		}

	}
}
