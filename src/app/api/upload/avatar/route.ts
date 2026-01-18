import { v2 as cloudinary } from "cloudinary";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";
import { requireAuth } from "@/lib/rbac/access-control";

const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

cloudinary.config({
	cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: env.CLOUDINARY_API_KEY,
	api_secret: env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
	await requireAuth(request);
	const formData = await request.formData();
	const file = formData.get("file") as File | null;

	if (!file) {
		return NextResponse.json({ error: "No file provided" }, { status: 400 });
	}

	if (!ALLOWED_TYPES.includes(file.type)) {
		return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
	}

	if (file.size > MAX_SIZE) {
		return NextResponse.json(
			{ error: "File too large (max 2MB)" },
			{ status: 400 },
		);
	}

	const buffer = Buffer.from(await file.arrayBuffer());

	const result = await new Promise<any>((resolve, reject) => {
		cloudinary.uploader
			.upload_stream(
				{
					folder: "avatars",
					resource_type: "image",
				},
				(error, result) => {
					if (error) reject(error);
					else resolve(result);
				},
			)
			.end(buffer);
	});

	return NextResponse.json({
		url: result.secure_url,
	});
}
