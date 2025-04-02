import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
	controllers: [AuthController],
	providers: [AuthService],
	imports: [TypeOrmModule.forFeature([User]), PassportModule.register({ defaultStrategy: "jwt" }),
	JwtModule.registerAsync({
		imports: [],
		inject: [],
		useFactory: async (configService: ConfigService) => {
			return {
				secret: configService.get<string>("JWT_SECRET"),
				signOptions: {
					expiresIn: "2h"
				}
			}
		}
	})],
	/* 	JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions:{
				expiresIn: "2h"
			}
		})], */
	exports: [TypeOrmModule],
})
export class AuthModule { }
