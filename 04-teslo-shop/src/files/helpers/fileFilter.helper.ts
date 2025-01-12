import { BadRequestException, HttpException, HttpStatus } from "@nestjs/common";
import { Request } from "express";

export const fileFilter = (
	req: Request,
	file: Express.Multer.File,
	// biome-ignore lint/complexity/noBannedTypes: false
	callback: Function,
) => {
	const fileExtension = file.mimetype.split("/")[1];
	const validExtensions = ["jpg", "jpeg", "png", "gif"];

	if (validExtensions.includes(fileExtension)) {
		console.log(fileExtension);

		return callback(null, true);
	}

	return callback(new BadRequestException("Only image files are allowed!"), false);
};
