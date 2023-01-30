var mySize, margin;
var tile_w, tile_h;
var tile_num_x, tile_num_y, num_x;
var seed = Math.random() * 765;
var t;
var dir, dir_dis;

//color
let colors = [];
let colors1 = "#61E294-#7BCDBA-#63C7B2-#A0EEC0-#8AE9C1".split("-").map((a) => a);
let colors2 = "#9799CA-#BD93D8-#B47AEA-#4A306D-#54426B--#564256".split("-").map((a) => "#" + a);
let colorsbg = "#7B9E87-#2E6171#5E747F".split("-").map((a) => "#" + a);


function setup() {
	// frameRate(25);
	// pixelDensity(3);
	randomSeed(seed);
	mySize = (windowWidth, windowHeight);
	//margin = mySize / 100;
	createCanvas(windowWidth, windowHeight);
	tile_num_x = 10;
	t = 0.5;
	background(random(colors2));
	dir_dis = 2;
	dir = dir_dis;
	colors[0] = random(colors1);
	colors[1] = random(colors2);
	colors[2] = random(colors1);
	colors[3] = random(colors2);
	colors[4] = random(colors2);
	num_x = int(random(2, 4));
	let filter1 = new makeFilter();
}

function draw() {

	randomSeed(seed);
	noFill();
	tile_w = tile_h = width / tile_num_x;
	tile_num_y = int(height / tile_h);
	for (let i = 1; i < tile_num_x +1; i++) {
		for (let j = -1; j < tile_num_y + 1; j++) {
			push();
			translate(i * tile_w, j * tile_h);
			stroke(colors[random([0, 1, 2, 3, 4])]);
			rotate(t);

			strokeWeight(random());

			//shadow & highlight
			drawingContext.shadowColor = "#ffffff40";
			drawingContext.shadowOffsetX = 1;
			drawingContext.shadowOffsetY = 1;
			drawingContext.shadowBlur = 0;
			drawingContext.shadowColor = "#20202040";
			drawingContext.shadowOffsetX = -1;
			drawingContext.shadowOffsetY = -1;
			drawingContext.shadowBlur = 0;

			for (let l_x = -1; l_x < num_x + 1; l_x++) {
				let l_y = random(tile_h, tile_w);
				arc(l_x * tile_w / num_x, -l_y - t / random(8, 10), -l_x * tile_w / num_x, l_y + t / random(8, 20),
					random(-PI / 2), random(PI / 2));

				if (dir == dir_dis && t < tile_h) {
					t += dir_dis * num_x/ num_x ;
				}
				if (dir == dir_dis && t >= tile_h) {
					dir = -dir_dis;
				}
				if (dir == -dir_dis) {
					t += -dir_dis / num_x /num_x/ num_x;
				}
				if (dir == -dir_dis && t <= 0) {
					dir = dir_dis;
				}
			}

			pop();
		}
	}


	if (frameCount == 300) {
		//strokeWeight(random(0.1, 0.05));
	stroke(str(random(colors2)));
		noFill();
		image(overAllTexture, 0, 0);
		noFill();
		//stroke("#202020");
		strokeWeight(margin);
		blendMode(BLEND);
		rectMode(CORNER);
		rect(0, 0, width, height);
		noLoop();
	}
}

function drawOverPattern() {
	push();
	translate(width / 2, height / 2);
	rotate(-PI / 2);

	let s = mySize / 2 * sqrt(3) - 2;
	let n = 4;

	for (let theta = 0; theta < TWO_PI; theta += TWO_PI / 6) { // noprotect
		divideOP(0, 0, s * cos(theta), s * sin(theta), s * cos(theta + TWO_PI / 6), s * sin(theta + TWO_PI / 6), n);
	}
	pop();
}

function prop(x1, y1, x2, y2, k) {
	let x3 = (1 - k) * x1 + k * x2;
	let y3 = (1 - k) * y1 + k * y2;
	return [x3, y3];
}

function divideOP(x1, y1, x2, y2, x3, y3, n) {
	if (n > 1) {
		let [xA, yA] = prop(x1, y1, x2, y2, 1 / 3);
		let [xB, yB] = prop(x1, y1, x2, y2, 2 / 3);
		let [xC, yC] = prop(x2, y2, x3, y3, 1 / 3);
		let [xD, yD] = prop(x2, y2, x3, y3, 2 / 3);
		let [xE, yE] = prop(x3, y3, x1, y1, 1 / 3);
		let [xF, yF] = prop(x3, y3, x1, y1, 2 / 3);
		let [xG, yG] = prop(xF, yF, xC, yC, 1 / 2);
		divideOP(x1, y1, xA, yA, xF, yF, n - 1);
		divideOP(xA, yA, xB, yB, xG, yG, n - 1);
		divideOP(xB, yB, x2, y2, xC, yC, n - 1);
		divideOP(xG, yG, xF, yF, xA, yA, n - 1);
		divideOP(xC, yC, xG, yG, xB, yB, n - 1);
		divideOP(xF, yF, xG, yG, xE, yE, n - 1);
		divideOP(xG, yG, xC, yC, xD, yD, n - 1);
		divideOP(xD, yD, xE, yE, xG, yG, n - 1);
		divideOP(xE, yE, xD, yD, x3, y3, n - 1);
	} else {
		makeTriangle([x1, y1], [x2, y2], [x3, y3]);
	}
}

function makeTriangle(v1, v2, v3) {
	let points = shuffle([v1, v2, v3]);
	let [x1, y1] = points[0];
	let [x2, y2] = points[1];
	let [x3, y3] = points[2];
	let iStep = 1 / (pow(2, floor(random(4, 2))));
	for (let i = 0; i < 1; i += iStep) { // noprotect
		let [x4, y4] = prop(x1, y1, x2, y2, 1 - i);
		let [x5, y5] = prop(x1, y1, x3, y3, 1 - i);
		triangle(x1, y1, x4, y4, x5, y5);
	}
}

function makeFilter() {
	randomSeed(seed);

	drawingContext.shadowColor = color(0, 0, 5, 55);
	overAllTexture = createGraphics(windowWidth, windowHeight);
	overAllTexture.loadPixels();
	for (var i = 0; i < width; i++) {
		for (var j = 0; j < height; j++) {
			overAllTexture.set(
				i,
				j,
				color(245, 245, 245, noise(i / 3, j / 3, (i * j) / 100) * random(10, 5))
			);
		}
	}
	overAllTexture.updatePixels();
}

function keyTyped() {
	if (key === "s" || key === "S") {
		saveCanvas("0818_blue mood_2022", "png");
	}
}