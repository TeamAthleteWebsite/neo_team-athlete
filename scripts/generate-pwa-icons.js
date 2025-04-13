import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

const SIZES = [16, 32, 48, 72, 96, 120, 128, 144, 152, 180, 192, 384, 512];

async function generateIcons() {
	const sourceIcon = path.join(
		process.cwd(),
		"public",
		"images",
		"logo_body.png",
	);

	// Ensure the icons directory exists
	const iconsDir = path.join(process.cwd(), "public", "icons");
	try {
		await fs.mkdir(iconsDir, { recursive: true });
	} catch (err) {
		if (err.code !== "EEXIST") throw err;
	}

	// Generate PWA icons
	for (const size of SIZES) {
		await sharp(sourceIcon)
			.resize(size, size, {
				fit: "contain",
				background: { r: 0, g: 0, b: 0, alpha: 0 },
				kernel: "lanczos3",
				position: "center",
			})
			.png({ quality: 100, compressionLevel: 9 })
			.toFile(path.join(iconsDir, `icon-${size}x${size}.png`));

		console.log(`Generated ${size}x${size} icon`);
	}

	// Generate Apple Touch Icon (180x180)
	await sharp(sourceIcon)
		.resize(180, 180, {
			fit: "contain",
			background: { r: 255, g: 255, b: 255, alpha: 1 },
			kernel: "lanczos3",
			position: "center",
		})
		.png({ quality: 100, compressionLevel: 9 })
		.toFile(path.join(process.cwd(), "public", "apple-icon.png"));

	console.log("Generated Apple Touch Icon");

	// Generate favicon.ico (multi-size)
	const faviconSizes = [16, 32, 48];
	const faviconBuffers = await Promise.all(
		faviconSizes.map((size) =>
			sharp(sourceIcon)
				.resize(size, size, {
					fit: "contain",
					background: { r: 0, g: 0, b: 0, alpha: 0 },
					kernel: "lanczos3",
					position: "center",
				})
				.toBuffer(),
		),
	);

	await sharp(faviconBuffers[0]).toFile(
		path.join(process.cwd(), "public", "favicon.ico"),
	);

	console.log("Generated favicon.ico");
}

generateIcons().catch(console.error);
