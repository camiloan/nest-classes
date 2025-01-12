import { Request } from "express";
import { v4 as uuid } from "uuid";

export const fileNamer = (
	req: Request,
	file: Express.Multer.File,
	// biome-ignore lint/complexity/noBannedTypes: false
	callback: Function,
) => {
	const fileExtension = file.mimetype.split("/")[1];

	const fileName = `${uuid()}.${fileExtension}`;
	callback(null, fileName);
};
