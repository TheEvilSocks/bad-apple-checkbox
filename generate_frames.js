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

	let pixels = []; // pixels[y][x] = 0 | 1 // 0 = black, 1 = white;
	for (let y = 0; y < image.height; y++) {
		for (let x = 0; x < image.width; x++) {
			const index = (image.width * y + x) << 2; // maths go brrr
			const r = image.data[index];
			const g = image.data[index + 1];
			const b = image.data[index + 2];

			if (!pixels[y]) pixels[y] = [];
			pixels[y][x] = +((r + g + b) / 3 > (255 * 0.8)); // Greyscale the pixel and compare it to something close to white.
		}
	}
	frames[i] = pixels;
}


fs.writeFileSync('./docs/frames.js', `const frames = ${JSON.stringify(frames)}`);

