// I'm not a python person so I'm gonna redo it in NodeJS :/

const png = require('pngjs').PNG; // npm install
const fs = require('fs');

// ffmpeg -i in.mp4 -vf fps=20 -s 48x36 -vsync 0 frames/f%4d.png
const files = fs.readdirSync('./frames/', { withFileTypes: true }).filter(file => file.isFile() && file.name.endsWith('.png'));


let frames = [];
for (let i = 0; i < files.length; i++) {
	const file = files[i];
	const imageFile = fs.readFileSync(`./frames/${file.name}`);
	const image = png.sync.read(imageFile);

	let pixels = []; // pixels[y] // bitflag
	for (let y = 0; y < image.height; y++) {
		pixels[y] = 0n
		for (let x = 0; x < image.width; x++) {
			const index = (image.width * y + x) << 2; // maths go brrr
			const r = image.data[index];
			const g = image.data[index + 1];
			const b = image.data[index + 2];

			// 1 = black, 0 = white
			const pixel = +((r + g + b) / 3 < (255 * 0.8)); // Greyscale the pixel and compare it to something close to white. 
			pixels[y] |= BigInt(pixel) << BigInt(x);
		}
		pixels[y] = Number(pixels[y]);
	}
	frames[i] = pixels;
}



const _img = png.sync.read(fs.readFileSync(`./frames/${files[0].name}`));
fs.writeFileSync('./docs/frames.js', `const height = ${_img.height};\nconst width = ${_img.width};\nconst frames = ${JSON.stringify(frames)}`);

