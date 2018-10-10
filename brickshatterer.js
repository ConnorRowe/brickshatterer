//vector2 object holds two numbers (it is all set up terribly)
class vector2
{				
	constructor(x,y)
	{
		this.x = x;
		this.y = y;
	}

	getX()
	{
		return this.x;
	}

	getY()
	{
		return this.y;
	}

	add(v)
	{
		var x,y;
		x = this.x + v.x;
		y = this.y + v.y;

		var result = new vector2(x,y);
		return result;
	}

	sub(v)
	{
		var x,y;

		if(v === Number)	//checks type of 'v'
		{
		   x = this.x - v;
		   y = this.y - v;
		}
		else
		{
			x = this.x - v.x;
			y = this.y - v.y;
		}
		var result = new vector2(x,y);
		return result;
	}

	multS(s)	//had to have separate multiply functions because it kept breaking trying to distinguish between argument types and I am too stupid / lazy to figure out why
	{
		var x,y;

		x = this.x * s;
		y = this.y * s;

		var result = new vector2(x,y);
		return result;
	}

	multV(v)
	{
		var x,y;

		x = this.x * v.x;
		y = this.y * v.y;

		var result = new vector2(x,y);
		return result;
	}

	div(v)
	{
		var x,y;

		if(v===vector2)
		{
			x = this.x / v.x;
			y = this.y / v.y;
		}
		else
		{
			x = this.x / v;
			y = this.y / v;
		}

		var result = new vector2(x,y);
		return result;
	}

	//returns the dot product of the vector with another ax * bx + ay * by
	dot(v)
	{
		var dotP = this.x * v.x + this.y * v.y;

		return dotP;
	}

	cross()
	{
		//todo add crossproduct
	}

	//returns the magnitude of a vector
	mag()
	{
		return Math.sqrt(this.x * this.x + this.y * this.y); 
	}

	//normalises the vector to a unit vector (0 - 1)
	normalise()
	{
		var m = this.mag();
		if(m > 0)
		{
			return this.div(m);
		}
	}

	//tells it how to print a vector2 to a string
	toString()
	{
		return "[" + this.x + "," + this.y + "]";
	}
}

//Class to handle timers (using the timer class from the DPhoenix engine :-])
class timer
{
	constructor()
	{
		this.reset();
	}

	reset()
	{
		this.startingTime = Math.abs(time);
	}

	stopwatch(seconds)
	{
		if (time >= this.startingTime + seconds)
		{
			this.reset();
			return true;
		}
		else return false;
	}
}

class block
{
	constructor(position,type)
	{
		this.x = position.x;
		this.y = position.y;
	}
}

class button
{
	constructor(x,y,width,height,colour,text,Function)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.colour = colour;
		this.text = text;
		this.eventFunc = Function;
	}
	
	update()
	{
		if(clientX != null)
		{
			if(AABBIntersect(clientX,clientY,1,1,this.x,this.y,this.width,this.height))
			{
				this.eventFunc(true);
			}
			else
				this.eventFunc(false);
		}
		else
			this.eventFunc(false);
	}
	
	draw()
	{
		//context.fillStyle(this.colour);
		context.strokeStyle = "#F";
		context.strokeRect(this.x,this.y,this.width,this.height);
		//context.fillStyle("#F");
		context.fillText(this.text, this.x + this.width/2, this.y + this.height/2);
	}
}

<!-- Global Vars -------------------------------------------------------------------------------------------------------------------------------------->
//only need to declare 'var' once
var
	//delcared here are the CONSTANTS
	WIDTH	= 800,
	HEIGHT	= 600,
	pi =  Math.PI, //so I don't have to type Math.PI;

	//keycodes -> https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
	keyLeft		= 65, // A
	keyRight	= 68, // D
	keyStart	= 32, // spacebar
	
	touchLeft	= false,
	touchRight	= false,
	
	clientX,
	clientY,
	
	moveLeft = false,
	moveRight = false,

	//game elements
	canvas,		//play area
	context,	//we use context in JS to relate back to the object we use it in
	keystate,	//check the defined keypress

	//timing
	gameTime = 0,	//total time (in microseconds or something)
	deltaTime = 0,	//time difference between last frames
	time = 0,		//total time (in seconds)
	timeFrac = 0,	//time remainder in seconds (0.0 - 1.0)
	
	//buttons
	buttonLeft = new button(20, 480, 100, 100, "#CCC", "LEFT", function(bool)
	{
		if(bool)
			touchLeft = true;
		else
			touchLeft = false;
	}),

	buttonRight = new button(680, 480, 100, 100, "#CCC", "RIGHT", function(bool)
	{
		if(bool)
			touchRight = true;
		else
			touchRight = false;
	}),
	
	paddle =
	{
		x: null,	//coords
		y: null,
		width: 80,	//sizing
		height: 20,
		velocity: 0,

		update: function()
		{
			//Input
			if (moveLeft || moveRight)
			{
				if(moveLeft)
				{
					this.x -= (deltaTime * 0.5);
					this.velocity = -1;
				}
				if(moveRight)
				{
					this.x += (deltaTime * 0.5);
					this.velocity = 1;
				}
			}
			else this.velocity = 0;


			//clamp paddle to canvas
			this.x = clamp(this.x, 0, WIDTH-this.width);
		},

		draw: function()
		{
			context.fillRect(this.x, this.y, this.width, this.height);
		}
	},

	ball =
	{
		x: null,
		y: null,
		direction: new vector2(0,0),
		side: 20,
		speed: 4,
		iscolliding: false,
		canCollide: true,
		reflectNormal: new vector2(0,0),
		collideTimer: new timer(),

		setReflectNormal: function(v)
		{
			this.reflectNormal.x = v.x;
			this.reflectNormal.y = v.y;
		},

		setDirection: function(x,y)
		{
			this.direction.x = x;
			this.direction.y = y;
		},

		//the serve function tells the ball to begin play,
		serve: function()
		{
			this.x = paddle.x + (paddle.width/2);
			this.y = paddle.y - 20;

			//generate random x val for the direction vector
			var r = Math.random();

			this.setDirection(r,-1);
		},

		update: function()
		{
			//update position with the direction and speed
			this.x += (this.direction.x) * this.speed;
			this.y += (this.direction.y) * this.speed;
			
			if (AABBIntersect(paddle.x,paddle.y,paddle.width,paddle.height,
							  this.x, this.y, this.side, this.side))
			{
				this.iscolliding = true;
				this.setReflectNormal(calcCollisionNormal(this.x + this.side/2, this.y + this.side/2, paddle.x + paddle.width/2, paddle.y + paddle.height/2, paddle.width, paddle.height));
			}

			//Window collision
			if (this.y < 1)                  		//Top
			{
				this.iscolliding = true;
				this.setReflectNormal(new vector2(0,1));
			}
			else if (this.y >= HEIGHT)    			//Bottom
			{
				this.serve();
			}
			else if (this.x < 1)             		//Left
			{
				this.iscolliding = true;
				this.setReflectNormal(new vector2(1,0));
			}
			else if (this.x >= WIDTH - ball.side)	//Right
			{
				this.iscolliding = true;
				this.setReflectNormal(new vector2(-1,0));
			}


			if (this.canCollide)
			{
				if (this.iscolliding)
				{
					this.direction = calcReflectedVector(this.direction, this.reflectNormal);
					this.canCollide = false;
					this.iscolliding = false;
				}
			}
			else
			{
				if (this.collideTimer.stopwatch(.5))
				{
					this.canCollide = true;
				}
			}

			//reset the ball when ball is outisde the canvas (bottom side)
			if (this.y >= HEIGHT - this.side - 2)
			{
				this.serve();
			}

		},

		//drawing the ball
		draw: function()
		{
			context.fillRect(this.x,this.y,this.side,this.side);
		}
	}

	function Main()
	{
		// create, initiate and append the game canvas we create at the start
		// we do this because if we dont give the canvas time to load,
		// it wont appear on the page

		canvas = document.createElement("canvas");
		canvas.width = WIDTH;
		canvas.height = HEIGHT;
		context = canvas.getContext("2d");
		document.body.appendChild(canvas)

		keystate = {};

		// these listeners will keep track of keyboard presses
		document.addEventListener("keydown", function(evt)
		{
			keystate[evt.keyCode] = true;
		})

		//button up can then be used to delete the keystroke
		document.addEventListener("keyup", function(evt)
		{
			delete keystate[evt.keyCode];
		})
		
		document.addEventListener("touchstart", function(evt)
	 	{
			//cache coords
			clientX = evt.touches[0].clientX;
			clientY = evt.touches[0].clientY;
			
			console.log("clientX:" + clientX + ", clientY: " + clientY);
		}, false);
		
		document.addEventListener("touchend", function(evt)
	 	{
			//cache coords
			clientX = null;
			clientY = null;
		}, false);
		
		document.addEventListener("touchcancel", function(evt)
	 	{
			//cache coords
			clientX = null;
			clientY = null;
		}, false);
		
		document.addEventListener("mousedown", function(evt)
	 	{
			//cache coords
			clientX = evt.clientX;
			clientY = evt.clientY;
			
			console.log("clientX:" + clientX + ", clientY: " + clientY);
		}, false);
		
		document.addEventListener("mouseup", function(evt)
	 	{
			//cache coords
			clientX = null;
			clientY = null;
		}, false);

		init(); //initialise game objects

		//game loop function
		var loop = function(timeStamp)
		{
			deltaTime = (timeStamp - gameTime);
			gameTime = timeStamp;
			time = (gameTime / 1000);
			timeFrac = time % 1;
			var boxColour = HSVtoRGB(lerp(0,1,timeFrac*0.1),1,1);
			
			if(keystate[keyLeft] || touchLeft)
				moveLeft = true;
			else
				moveLeft = false;
			
			if(keystate[keyRight] || touchRight)
				moveRight = true;
			else
				moveRight = false;

			update();
			draw();
			//this loops the "animation" of the canvas, the max is 60fps
			window.requestAnimationFrame(loop, canvas);
		}

		//and here we begin the frame loop
		window.requestAnimationFrame(loop, canvas);
	}

	<!-- Helper Functions ----------------------------------------------------------------------------------------------------------------->
	//calculates the surface normal of colliding surface (x2, y2) to use for reflection calculations
	//position values must be centered (not top left) for it to work
	function calcCollisionNormal(x1,y1,x2,y2,width2,height2)
	{
		var c = new vector2(x1,y1);
		var r = new vector2(x2,y2);
		var d = c.sub(r);
		var ux = new vector2(-1,0);
		var uy = new vector2(0,1);
		var ex = width2/2;
		var ey = height2/2;
		
		//project d onto ux to get distance along ux from c
		var dx = d.dot(ux);
		if(dx > ex)
			dx = ex;
		if(dx < -ex)
			dx = -ex;
		
		//project d onto uy to get distance along uy from c
		var dy = d.dot(uy);
		if(dy > ey)
			dy = ey;
		if(dy < -ey)
			dy = -ey;
		
		//calculate closest point p on box to c
		var p  = r.add(ux.multS(dx));
		p = p.add(uy.multS(dy));
		
		var collision_norm = c.sub(p);
		collision_norm = collision_norm.normalise();
		
		return collision_norm;
	}

	// r=d−2(d⋅n)n		found on https://math.stackexchange.com/questions/13261/how-to-get-a-reflection-vector
	function calcReflectedVector(direction, normal)	//equation variables are separated horribly like this because it's the only way it would work
	{
		var dDotn = direction.dot(normal);	//	(d⋅n)
		var ansn = normal.multS(dDotn);		//	(d⋅n)n
		var ans2 = ansn.multS(2);			//	2(d⋅n)n
		var r = direction.sub(ans2);		//	d−2(d⋅n)n
		return r;
	}

	//check intersection between two axis aligned bounding boxes (AABB collision)
	var AABBIntersect = function(ax, ay, aw, ah, bx, by, bw, bh)
	{
		return ax < bx+bw && ay < by+bh && bx < ax+aw && by < ay+ah;
	}

	//clamps a value between  minimum and maximum values
	function clamp(num, min, max)
	{
		return num <= min ? min : num >= max ? max : num;
	}

	//linear interpolation between two values
	function lerp(a, b, x)
	{
		return a + x * (b - a);
	}

	/*
	 * converts 3 values into a string
	 * that is understood by CSS
	*/
	function rgb(r,g,b)
	{
		return 'rgb(' + [(r||0),(g||0),(b||0)].join(',') + ')';
	}

	/* accepts parameters
	 * h  Object = {h:x, s:y, v:z}
	 * OR 
	 * h, s, v
	*/
	function HSVtoRGB(h, s, v) {
		var r, g, b, i, f, p, q, t;
		if (arguments.length === 1) {
			s = h.s, v = h.v, h = h.h;
		}
		i = Math.floor(h * 6);
		f = h * 6 - i;
		p = v * (1 - s);
		q = v * (1 - f * s);
		t = v * (1 - (1 - f) * s);
		switch (i % 6) {
			case 0: r = v, g = t, b = p; break;
			case 1: r = q, g = v, b = p; break;
			case 2: r = p, g = v, b = t; break;
			case 3: r = p, g = q, b = v; break;
			case 4: r = t, g = p, b = v; break;
			case 5: r = v, g = p, b = q; break;
		}
		return {
			r: Math.round(r * 255),
			g: Math.round(g * 255),
			b: Math.round(b * 255)
		};
	}

	//convert degrees to rads
	function toRadians(degree)
	{
		return degree * (pi / 180);
	}

	//convert rads to degrees
	function toDegree(radians)
	{
		return radians * (180 / pi);
	}

	//returns x and y coords on the circumference of the calculated circle (rads)
	function unitCircleFromAngle(centreX, centreY, theta, dist)
	{
		var newV = new vector2(0,0);
		newV.x = (centreX) + Math.cos(theta) * dist;
		newV.y = (centreY) + Math.sin(theta) * dist; 

		return newV;
	}

	<!-- Main game stuff --------------------------------------------------------------------------------------------------------------->

	function init()
	{
		paddle.x = WIDTH/2;
		paddle.y = HEIGHT - 60;
		ball.serve();
	}

	//this is where we call to update all out objects
	function update()
	{
		paddle.update();
		ball.update();
		buttonLeft.update();
		buttonRight.update();
	}

	//drawing everything to the canvas
	function draw()
	{
		// draw the canvas
		context.fillRect(0,0, WIDTH, HEIGHT);
		context.save();

		var boxColour = HSVtoRGB(lerp(0,1,timeFrac),1,1);

		context.fillStyle = "#FFF";	//white draw colour
		context.strokeStyle="#FF0000";
		//text for the stuff
		context.font = "16px Calibri"; //size and font

		context.fillText("deltaTime: " + deltaTime, 10, 25);
		context.fillText("time: " + time, 10, 50);
		context.fillText("timeFrac: " + timeFrac, 10, 75);
		context.fillText("ball pos: x = " + (ball.x - ball.x % 1) + ", y = " + (ball.y - ball.y % 1), 10, 100);
		context.fillText("ball direction: " + ball.direction, 10, 125);
		
		context.fillText("clientX: " + clientX + ", clientY: " + clientY, 10, 150);
		
		var testVec1 = new vector2(0,-1);
		var testVec2 = new vector2(0,1);
		context.fillText(testVec1 + " -> " + testVec2 + "  reflection: " + calcReflectedVector(testVec1,testVec2) + " (testing reflection maths)", 10, 175);

		context.fillStyle = rgb(boxColour.r,boxColour.g,boxColour.b);	//rainbow draw colour
		paddle.draw();

		context.fillStyle = "#FFF"; //white draw colour
		ball.draw();
		context.fillStyle = "#FFF"; //white draw colour
		buttonLeft.draw();
		buttonRight.draw();

		context.restore();
	}

	Main();
