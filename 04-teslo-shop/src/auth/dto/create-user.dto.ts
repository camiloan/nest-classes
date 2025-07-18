import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from "class-validator";

export class CreateUserDto {
	@ApiProperty({ description: "User Email", nullable: false, minLength: 1 })
	@IsString()
	@IsEmail()
	email: string;

	@ApiProperty({ description: "User Password", nullable: false, minLength: 8 })
	@IsString()
	@MinLength(8)
	@MaxLength(50)
	@Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message:
			"The password must have a Uppercase, lowercase letter and a number",
	})
	password: string;

	@ApiProperty({ description: "User Full Name", nullable: false, minLength: 1 })
	@IsString()
	@MinLength(1)
	fullName: string;
}
