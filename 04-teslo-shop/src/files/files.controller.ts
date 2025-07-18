import {
	BadRequestException,
	Controller,
	Get,
	Param,
	ParseFilePipe,
	Post,
	Res,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { FilesService } from "./files.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { fileFilter } from "./helpers/fileFilter.helper";
import { diskStorage } from "multer";
import { fileNamer } from "./helpers/fileNamer";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Files - Get and Upload")
@Controller("files")
export class FilesController {
	constructor(
		private readonly filesService: FilesService,
		private readonly configService: ConfigService,
	) { }

	@Get("product/:imageName")
	findProductImage(
		@Res() res: Response,
		@Param("imageName") imageName: string,
	) {
		const path = this.filesService.getStaticProductImage(imageName);
		res.sendFile(path);
	}

	@Post("product")
	@UseInterceptors(
		FileInterceptor("file", {
			fileFilter: fileFilter,
			limits: { fileSize: 1024 * 1024 * 5 },
			storage: diskStorage({
				destination: "./static/products",
				filename: fileNamer,
			}),
		}),
	)
	uploadProductImage(
		@UploadedFile("file", ParseFilePipe)
		file: Express.Multer.File,
	) {
		if (!file) {
			throw new BadRequestException("Make sure to upload a file.");
		}

		const secureUrl = `${this.configService.get("HOST_API")}/files/product/${file.filename}`;
		return { secureUrl };
	}
}
