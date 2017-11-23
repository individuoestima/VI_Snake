// snake
function Snake(scene, color) {
	this.snake = [];
	this.scene = scene;
	this.size = 1;
	this.color = color;
	this.distance = 0.5; // distance to move by

	this.dir = ['x', 'y', 'z'];

	this.direction = null;
	this.axis = null;

	this.flag = 'z';

	this.m = null;

	this.onSelfCollision = function () { };
	this.onFoodCollision = function () { };

	this.position = null; // current position of the snake instance
	this.foodPosition = null; // the current position of the tag to be hit

	this.geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
	var texloader = new THREE.TextureLoader();
	var tex = texloader.load('textures/snake.jpg');
	this.material = new THREE.MeshLambertMaterial({ map: tex, color: 0xffffff });
	this.addCube();
	this.snake.forEach(function (cube) {
		cube.position.z = 5.5;
		cube.position.y = 0;
		cube.position.x = 0;
	});
}

Snake.prototype = {
	selfCollision() {
		this.onSelfCollision();
	},
	foodCollision() {
		this.onFoodCollision();
		this.addCube();
	},
	setFoodPosition(position) {
		this.foodPosition = position;
	},
	setFlag(value) {
		this.flag = value;
	},
	itItself(p1, p2) {
		if (p1.x === p2.x && p1.y === p2.y && p1.z === p2.z) {
			return true;
		}
		return false;
	},
	itFood(p1, p2) {
		if (this.flag == 'z') {
			var d1 = Math.abs(p1.x - p2.x);
			var d2 = Math.abs(p1.y - p2.y);
			if (d1 <= 0.5 && d1 >= -0.5 && d2 <= 0.5 && d2 >= -0.5 && p1.z == p2.z) {
				return true;
			}
		}
		if (this.flag == 'y') {

			var d1 = Math.abs(p1.x - p2.x);
			var d2 = Math.abs(p1.z - p2.z);
			if (d1 <= 0.5 && d1 >= -0.5 && d2 <= 0.5 && d2 >= -0.5 && p1.y == p2.y) {
				return true;
			}

		}
		if (this.flag == 'x') {

			var d1 = Math.abs(p1.z - p2.z);
			var d2 = Math.abs(p1.y - p2.y);
			if (d1 <= 0.5 && d1 >= -0.5 && d2 <= 0.5 && d2 >= -0.5 && p1.x == p2.x) {
				return true;
			}
		}
		return false
	},
	verify(x, y, z) {
		if (this.snake[0].position.x === x && this.snake[0].position.y === y && this.snake[0].position.z === z) {
			return true;
		}
		return false;
	},
	createCube(position) {
		var cube = new THREE.Mesh(this.geometry, this.material);
		cube.castShadow = true;
		cube.receiveShadow = true;
		return cube;
	},
	addCube() {
		this.snake.push(this.createCube());
	},
	render() {
		var self = this;
		var next = null;
		this.snake.forEach(function (cube) {
			var temp = null;
			if (self.axis !== null && self.direction !== null) {
				if (!next) {
					next = { x: cube.position.x, y: cube.position.y, z: cube.position.z };
					cube.position[self.axis] += (self.direction * self.distance);
					self.position = { x: cube.position.x, y: cube.position.y, z: cube.position.z };
					if (self.foodPosition) {
						if (self.itFood(self.position, self.foodPosition)) {
							self.foodCollision();
						}
					}
				} else {
					temp = { x: cube.position.x, y: cube.position.y, z: cube.position.z };
					cube.position.set(next.x, next.y, next.z);
					// check if it collides with itself
					if (self.itItself(self.position, cube.position)) {
						self.selfCollision();

					};
					next = { x: temp.x, y: temp.y, z: temp.z };
				}
			}

			//create snake in the beggining
			self.renderCube(cube);
		});
	},
	back() {
		this.m = 'b';
		this.axis = this.dir[1];
		this.direction = -1;
	},
	forward() {
		this.m = 'f';
		this.axis = this.dir[1];
		this.direction = 1;
		//new
	},
	right() {
		this.m = 'f';
		this.axis = this.dir[0];
		this.direction = 1;
	},
	left() {
		this.m = 'b';
		this.axis = this.dir[0];
		this.direction = -1;

	},
	renderCube(cube) {
		this.scene.add(cube)
	},
	getPos() {
		if (this.snake[0].position.y == 5.5 && this.snake[0].position.z == 5.5 && this.m == 'f') {
			this.forward = function () {
				this.m = 'f';
				this.axis = this.dir[2];
				this.direction = -1;
			};
			this.back = function () {
				this.m = 'b';
				this.axis = this.dir[2];
				this.direction = 1;
			};
			this.right = function () {
				this.m = 'f';
				this.axis = this.dir[0];
				this.direction = 1;
			};
			this.left = function () {
				this.m = 'b';
				this.axis = this.dir[0];
				this.direction = -1;
			};
			keyActions.backward.enabled = false;
			keyActions.left.enabled = true;
			keyActions.right.enabled = true;
			this.forward();
		}

		if (this.snake[0].position.y == 5.5 && this.snake[0].position.z == 5.5 && this.m == 'b') {
			this.forward = function () {
				this.m = 'b';
				this.axis = this.dir[1];
				this.direction = -1;
			};
			this.back = function () {
				this.m = 'f';
				this.axis = this.dir[1];
				this.direction = 1;
			};
			this.right = function () {
				this.m = 'b';
				this.axis = this.dir[0];
				this.direction = -1;
			};
			this.left = function () {
				this.m = 'f';
				this.axis = this.dir[0];
				this.direction = 1;
			};
			keyActions.backward.enabled = false;
			keyActions.left.enabled = true;
			keyActions.right.enabled = true;
			this.forward();

		}


		if (this.snake[0].position.y == 5.5 && this.snake[0].position.z == -5.5 && this.m == 'f') {
			this.forward = function () {
				this.m = 'f';
				this.axis = this.dir[1];
				this.direction = -1;
			};
			this.back = function () {
				this.m = 'b';
				this.axis = this.dir[1];
				this.direction = 1;
			};
			this.right = function () {
				this.m = 'b';
				this.axis = this.dir[0];
				this.direction = 1;
			};
			this.left = function () {
				this.m = 'f';
				this.axis = this.dir[0];
				this.direction = -1;
			};
			keyActions.backward.enabled = false;
			keyActions.left.enabled = true;
			keyActions.right.enabled = true;
			this.forward();
		}

		if (this.snake[0].position.y == 5.5 && this.snake[0].position.z == -5.5 && this.m == 'b') {
			this.forward = function () {
				this.m = 'b';
				this.axis = this.dir[2];
				this.direction = 1;
			};
			this.back = function () {
				this.m = 'f';
				this.axis = this.dir[2];
				this.direction = -1;
			};
			this.right = function () {
				this.m = 'b';
				this.axis = this.dir[0];
				this.direction = -1;
			};
			this.left = function () {
				this.m = 'f';
				this.axis = this.dir[0];
				this.direction = 1;
			};
			keyActions.backward.enabled = false;
			keyActions.left.enabled = true;
			keyActions.right.enabled = true;
			this.forward();
		}

		if (this.snake[0].position.y == 5.5 && this.snake[0].position.x == -5.5 && this.m == 'b') {
			this.forward = function () {
				this.m = 'b';
				this.axis = this.dir[1];
				this.direction = -1;
			};
			this.back = function () {
				this.m = 'f';
				this.axis = this.dir[1];
				this.direction = 1;
			};

			this.right = function () {
				this.m = 'b';
				this.axis = this.dir[2];
				this.direction = -1;
			};
			this.left = function () {
				this.m = 'f';
				this.axis = this.dir[2];
				this.direction = 1;
			};
			keyActions.backward.enabled = false;
			keyActions.left.enabled = true;
			keyActions.right.enabled = true;
			this.forward();
		}
		if (this.snake[0].position.y == 5.5 && this.snake[0].position.x == -5.5 && this.m == 'f') {
			this.forward = function () {
				this.m = 'f';
				this.axis = this.dir[0];
				this.direction = 1;
			};
			this.back = function () {
				this.m = 'b';
				this.axis = this.dir[0];
				this.direction = -1;
			};

			this.right = function () {
				this.m = 'b';
				this.axis = this.dir[2];
				this.direction = 1;
			};
			this.left = function () {
				this.m = 'f';
				this.axis = this.dir[2];
				this.direction = -1;
			};
			keyActions.backward.enabled = false;
			keyActions.left.enabled = true;
			keyActions.right.enabled = true;
			this.forward();
		}

		if (this.snake[0].position.y == 5.5 && this.snake[0].position.x == 5.5 && this.m == 'f') {
			this.forward = function () {
				this.m = 'f';
				this.axis = this.dir[1];
				this.direction = -1;
			};
			this.back = function () {
				this.m = 'b';
				this.axis = this.dir[1];
				this.direction = 1;
			};

			this.right = function () {
				this.m = 'b';
				this.axis = this.dir[2];
				this.direction = 1;
			};
			this.left = function () {
				this.m = 'f';
				this.axis = this.dir[2];
				this.direction = -1;
			};
			keyActions.backward.enabled = false;
			keyActions.left.enabled = true;
			keyActions.right.enabled = true;
			this.forward();
		}

		if (this.snake[0].position.y == 5.5 && this.snake[0].position.x == 5.5 && this.m == 'b') {
			this.forward = function () {
				this.m = 'b';
				this.axis = this.dir[0];
				this.direction = -1;
			};
			this.back = function () {
				this.m = 'f';
				this.axis = this.dir[0];
				this.direction = 1;
			};

			this.right = function () {
				this.m = 'f';
				this.axis = this.dir[2];
				this.direction = -1;
			};
			this.left = function () {
				this.m = 'b';
				this.axis = this.dir[2];
				this.direction = 1;
			};
			keyActions.backward.enabled = false;
			keyActions.left.enabled = true;
			keyActions.right.enabled = true;
			this.forward();
		}



		if (this.snake[0].position.y == -5.5 && this.snake[0].position.z == -5.5 && this.m == 'f') {
			this.forward = function () {
				this.m = 'f';
				this.axis = this.dir[2];
				this.direction = 1;
			};
			this.back = function () {
				this.m = 'b';
				this.axis = this.dir[2];
				this.direction = -1;
			};
			this.right = function () {
				this.m = 'f';
				this.axis = this.dir[0];
				this.direction = -1;
			};
			this.left = function () {
				this.m = 'b';
				this.axis = this.dir[0];
				this.direction = 1;
			};
			keyActions.backward.enabled = false;
			keyActions.left.enabled = true;
			keyActions.right.enabled = true;
			this.forward();
		}

		if (this.snake[0].position.y == -5.5 && this.snake[0].position.z == -5.5 && this.m == 'b') {
			this.forward = function () {
				this.m = 'b';
				this.axis = this.dir[1];
				this.direction = 1;
			};
			this.back = function () {
				this.m = 'f';
				this.axis = this.dir[1];
				this.direction = -1;
			};
			this.right = function () {
				this.m = 'f';
				this.axis = this.dir[0];
				this.direction = -1;
			};
			this.left = function () {
				this.m = 'b';
				this.axis = this.dir[0];
				this.direction = 1;
			};
			keyActions.forward.enabled = false;
			keyActions.left.enabled = true;
			keyActions.right.enabled = true;
			this.forward();
		}


		if (this.snake[0].position.y == -5.5 && this.snake[0].position.z == 5.5 && this.m == 'f') {
			this.forward = function () {
				this.m = 'f';
				this.axis = this.dir[1];
				this.direction = 1;
			};
			this.back = function () {
				this.m = 'b';
				this.axis = this.dir[1];
				this.direction = -1;
			};
			this.right = function () {
				this.m = 'f';
				this.axis = this.dir[0];
				this.direction = 1;
			};
			this.left = function () {
				this.m = 'b';
				this.axis = this.dir[0];
				this.direction = -1;
			};
			keyActions.backward.enabled = false;
			keyActions.left.enabled = true;
			keyActions.right.enabled = true;
			this.forward();
		}

		if (this.snake[0].position.y == -5.5 && this.snake[0].position.z == 5.5 && this.m == 'b') {
			this.forward = function () {
				this.m = 'b';
				this.axis = this.dir[2];
				this.direction = -1;
			};
			this.back = function () {
				this.m = 'f';
				this.axis = this.dir[2];
				this.direction = 1;
			};
			this.right = function () {
				this.m = 'b';
				this.axis = this.dir[0];
				this.direction = 1;
			};
			this.left = function () {
				this.m = 'f';
				this.axis = this.dir[0];
				this.direction = -1;
			};
			keyActions.backward.enabled = false;
			keyActions.left.enabled = true;
			keyActions.right.enabled = true;
			this.forward();
		}


		if (this.snake[0].position.y == -5.5 && this.snake[0].position.x == 5.5 && this.m == 'b') {
			this.forward = function () {
				this.m = 'b';
				this.axis = this.dir[1];
				this.direction = 1;
			};
			this.back = function () {
				this.m = 'f';
				this.axis = this.dir[1];
				this.direction = -1;
			};
			this.right = function () {
				this.m = 'f';
				this.axis = this.dir[2];
				this.direction = -1;
			};
			this.left = function () {
				this.m = 'b';
				this.axis = this.dir[2];
				this.direction = 1;
			};
			keyActions.backward.enabled = false;
			keyActions.left.enabled = true;
			keyActions.right.enabled = true;
			this.forward();
		}

		if (this.snake[0].position.y == -5.5 && this.snake[0].position.x == 5.5 && this.m == 'f') {
			this.forward = function () {
				this.m = 'f';
				this.axis = this.dir[0];
				this.direction = -1;
			};
			this.back = function () {
				this.m = 'b';
				this.axis = this.dir[0];
				this.direction = 1;
			};
			this.right = function () {
				this.m = 'f';
				this.axis = this.dir[2];
				this.direction = 1;
			};
			this.left = function () {
				this.m = 'b';
				this.axis = this.dir[2];
				this.direction = -1;
			};
			keyActions.backward.enabled = false;
			keyActions.left.enabled = true;
			keyActions.right.enabled = true;
			this.forward();
		}


		if (this.snake[0].position.y == -5.5 && this.snake[0].position.x == -5.5 && this.m == 'f') {
			this.forward = function () {
				this.m = 'f';
				this.axis = this.dir[1];
				this.direction = 1;
			};
			this.back = function () {
				this.m = 'b';
				this.axis = this.dir[1];
				this.direction = -1;
			};
			this.right = function () {
				this.m = 'f';
				this.axis = this.dir[2];
				this.direction = 1;
			};
			this.left = function () {
				this.m = 'b';
				this.axis = this.dir[2];
				this.direction = -1;
			};
			keyActions.backward.enabled = false;
			keyActions.left.enabled = true;
			keyActions.right.enabled = true;
			this.forward();
		}
		if (this.snake[0].position.y == -5.5 && this.snake[0].position.x == -5.5 && this.m == 'b') {
			this.forward = function () {
				this.m = 'b';
				this.axis = this.dir[0];
				this.direction = 1;
			};
			this.back = function () {
				this.m = 'f';
				this.axis = this.dir[0];
				this.direction = -1;
			};
			this.right = function () {
				this.m = 'b';
				this.axis = this.dir[2];
				this.direction = -1;
			};
			this.left = function () {
				this.m = 'f';
				this.axis = this.dir[2];
				this.direction = 1;
			};
			keyActions.forward.enabled = false;
			keyActions.left.enabled = true;
			keyActions.right.enabled = true;
			this.forward();
		}


		if (this.snake[0].position.x == -5.5 && this.snake[0].position.z == 5.5 && this.m == 'b') {
			this.forward = function () {
				this.m = 'f';
				this.axis = this.dir[1];
				this.direction = 1;
			};
			this.back = function () {
				this.m = 'b';
				this.axis = this.dir[1];
				this.direction = -1;
			};
			this.right = function () {
				this.m = 'f';
				this.axis = this.dir[2];
				this.direction = 1;
			};
			this.left = function () {
				this.m = 'b';
				this.axis = this.dir[2];
				this.direction = -1;
			};
			keyActions.right.enabled = false;
			keyActions.left.enabled = true;
			this.left();

		}
		if (this.snake[0].position.x == -5.5 && this.snake[0].position.z == -5.5 && this.m == 'b') {
			this.forward = function () {
				this.m = 'b';
				this.axis = this.dir[1];
				this.direction = 1;
			};
			this.back = function () {
				this.m = 'f';
				this.axis = this.dir[1];
				this.direction = -1;
			};
			this.right = function () {
				this.m = 'f';
				this.axis = this.dir[0];
				this.direction = -1;
			};
			this.left = function () {
				this.m = 'b';
				this.axis = this.dir[0];
				this.direction = 1;
			};
			keyActions.right.enabled = false;
			keyActions.left.enabled = true;
			this.left();
		}

		if (this.snake[0].position.x == 5.5 && this.snake[0].position.z == -5.5 && this.m == 'b') {
			this.forward = function () {
				this.m = 'b';
				this.axis = this.dir[1];
				this.direction = 1;
			};
			this.back = function () {
				this.m = 'f';
				this.axis = this.dir[1];
				this.direction = -1;
			};
			this.right = function () {
				this.m = 'f';
				this.axis = this.dir[2];
				this.direction = -1;
			};
			this.left = function () {
				this.m = 'b';
				this.axis = this.dir[2];
				this.direction = 1;
			};
			keyActions.right.enabled = false;
			keyActions.left.enabled = true;
			this.left();
		}

		if (this.snake[0].position.x == 5.5 && this.snake[0].position.z == 5.5 && this.m == 'b') {
			this.forward = function () {
				this.m = 'f';
				this.axis = this.dir[1];
				this.direction = 1;
			};
			this.back = function () {
				this.m = 'b';
				this.axis = this.dir[1];
				this.direction = -1;
			};
			this.right = function () {
				this.m = 'f';
				this.axis = this.dir[0];
				this.direction = 1;
			};
			this.left = function () {
				this.m = 'b';
				this.axis = this.dir[0];
				this.direction = -1;
			};
			keyActions.right.enabled = false;
			keyActions.left.enabled = true;
			this.left();
		}


		if (this.snake[0].position.x == 5.5 && this.snake[0].position.z == 5.5 && this.m == 'f') {
			this.forward = function () {
				this.m = 'b';
				this.axis = this.dir[1];
				this.direction = 1;
			};
			this.back = function () {
				this.m = 'f';
				this.axis = this.dir[1];
				this.direction = -1;
			};
			this.right = function () {
				this.m = 'f';
				this.axis = this.dir[2];
				this.direction = -1;
			};
			this.left = function () {
				this.m = 'b';
				this.axis = this.dir[2];
				this.direction = 1;
			};
			keyActions.right.enabled = true;
			keyActions.left.enabled = false;
			this.right();
		}

		if (this.snake[0].position.x == 5.5 && this.snake[0].position.z == -5.5 && this.m == 'f') {
			this.forward = function () {
				this.m = 'b';
				this.axis = this.dir[1];
				this.direction = 1;
			};
			this.back = function () {
				this.m = 'f';
				this.axis = this.dir[1];
				this.direction = -1;
			};
			this.right = function () {
				this.m = 'f';
				this.axis = this.dir[0];
				this.direction = -1;
			};
			this.left = function () {
				this.m = 'b';
				this.axis = this.dir[0];
				this.direction = 1;
			}; keyActions.right.enabled = true;
			keyActions.left.enabled = false;
			this.right();
		}

		if (this.snake[0].position.x == -5.5 && this.snake[0].position.z == -5.5 && this.m == 'f') {
			this.forward = function () {
				this.m = 'f';
				this.axis = this.dir[1];
				this.direction = 1;
			};
			this.back = function () {
				this.m = 'b';
				this.axis = this.dir[1];
				this.direction = -1;
			};
			this.right = function () {
				this.m = 'f';
				this.axis = this.dir[2];
				this.direction = 1;
			};
			this.left = function () {
				this.m = 'b';
				this.axis = this.dir[2];
				this.direction = -1;
			};
			keyActions.right.enabled = true;
			keyActions.left.enabled = false;
			this.right();
		}

		if (this.snake[0].position.x == -5.5 && this.snake[0].position.z == 5.5 && this.m == 'f') {
			this.forward = function () {
				this.m = 'f';
				this.axis = this.dir[1];
				this.direction = 1;
			};
			this.back = function () {
				this.m = 'b';
				this.axis = this.dir[1];
				this.direction = -1;
			};
			this.right = function () {
				this.m = 'f';
				this.axis = this.dir[0];
				this.direction = 1;
			};
			this.left = function () {
				this.m = 'b';
				this.axis = this.dir[0];
				this.direction = -1;
			};
			keyActions.right.enabled = true;
			keyActions.left.enabled = false;
			this.right();
		}
	},
};
