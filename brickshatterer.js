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
		if(this.colour != null)
		{
			context.strokeStyle = this.colour;
			context.strokeRect(this.x,this.y,this.width,this.height);
			//context.fillStyle("#F");
			context.fillText(this.text, this.x + this.width/2, this.y + this.height/2);
		}
	}
}

class brick
{
	constructor(position,state)
	{
		this.x = WIDTH*position.x;
		this.y = WIDTH*position.y;
		this.width = WIDTH*0.040;
		this.height = WIDTH*0.016;
		this.state = state;
        this.hitFlag = false;
		this.id = null;
		this.collideTimer = new timer();
	}
	
	update()
	{
		if (this.hitFlag)
        {
			this.state --;
			
			// iff state is less than or equal to 0, remove the brick
			if (this.state <= 0)
            {
				brickArray.splice(this.id, 1);
				delete this;
			}
			
			this.hitFlag = false;
        }
	}
	
	draw(shouldColour)
	{
		var rainbowColour = HSVtoRGB(lerp(0,1,timeFrac),1,1);
		
		if(shouldColour)
		{
			switch (this.state)
			{				
				case 0:
					context.fillStyle = "#000";
					break;
				case 1:
					context.fillStyle = "#C40";
					break;
				case 2:
					context.fillStyle = "#16F";
					break;
				case 3:
					context.fillStyle = "#1D6";
					break;
				case 4:
					context.fillStyle = "#80F";
					break;
				case 5:
					context.fillStyle = rgb(rainbowColour.r, rainbowColour.g, rainbowColour.b);
					break;
			}
			context.fillRect(this.x,this.y,this.width,this.height);
		}
		else
		{
			
			context.drawImage(imgBrick, this.x, this.y);
		}
	}
    
    collide(id)
    {
        if (this.collideTimer.stopwatch(.05))
		{
			this.hitFlag = true;
			this.id = id;
			this.collideTimer.reset();
		}
    }
}

<!-- Global Vars -------------------------------------------------------------------------------------------------------------------------------------->
//only need to declare 'var' once
var
	//CONTSTANTS
	pi =  Math.PI, //so I don't have to type Math.PI;

	//keycodes -> https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
	keyLeft		= 65, // A
	keyRight	= 68, // D
	keyStart	= 32, // spacebar
    keyDebug    = 80, // P
	
	touchLeft	= false,
	touchRight	= false,
    showDebug   = false,
	
	clientX,   //position of mouse click / touch input
	clientY,
	
	moveLeft = false,
	moveRight = false,

	//game elements
	WIDTH	= 1000,	//canvas height
	HEIGHT	= WIDTH*9/16,	//canvas width
	canvas,			//play area
	context,		//we use context in JS to relate back to the object we use it in
	keystate,		//check the defined keypress
	isMob,			//if running on mobile
	
	//Game states
	gameState	= 1,
	STATE_TITLE	= 1,
	STATE_GAME	= 2,
	STATE_WIN	= 3,
	STATE_LOSE	= 4,
	
	//Image objects
	imgBrick = new Image(),
	imgPaddle = new Image(),
	imgBall = new Image(),
	imgStartBackground = new Image(),

	//timing
	gameTime = 0,	//total time (in microseconds or something)
	deltaTime = 0,	//time difference between last frames
	time = 0,		//total time (in seconds)
	timeFrac = 0,	//time remainder in seconds (0.0 - 1.0)
	debugTimer = new timer(), //timer to handle debug toggle
	
	//<!-- Objects ---------------------------------------------------------------------------------------------------------------------------------->
	
	//Array for all bricks
	brickArray = [],
	
	//brick position data is used as a multiplier to WIDTH / height
	brickPositions =	//13, then 12, and so on for brick pattern
    [
        new vector2(.07,.06), new vector2(.14,.06), new vector2(.21,.06), new vector2(.28,.06), new vector2(.35,.06), new vector2(.42,.06), new vector2(.49,.06), new vector2(.56,.06), new vector2(.63,.06), new vector2(.70,.06), new vector2(.77,.06), new vector2(.84,.06), new vector2(.91,.06),
		new vector2(.10,.105), new vector2(.17,.105), new vector2(.24,.105), new vector2(.31,.105), new vector2(.38,.105), new vector2(.45,.105), new vector2(.52,.105), new vector2(.59,.105), new vector2(.66,.105), new vector2(.73,.105), new vector2(.80,.105), new vector2(.87,.105), 
		new vector2(.07,.16), new vector2(.14,.16), new vector2(.21,.16), new vector2(.28,.16), new vector2(.35,.16), new vector2(.42,.16), new vector2(.49,.16), new vector2(.56,.16), new vector2(.63,.16), new vector2(.70,.16), new vector2(.77,.16), new vector2(.84,.16), new vector2(.91,.16),
		new vector2(.10,.2125), new vector2(.17,.2125), new vector2(.24,.2125), new vector2(.31,.2125), new vector2(.38,.2125), new vector2(.45,.2125), new vector2(.52,.2125), new vector2(.59,.2125), new vector2(.66,.2125), new vector2(.73,.2125), new vector2(.80,.2125), new vector2(.87,.2125), 
    ],
	
	brickPositionsName =
	[
		new vector2(.04,.048), new vector2(.08,.048), new vector2(.12,.048), new vector2(.20,.048), new vector2(.24,.048), new vector2(.28,.048), new vector2(.36,.048), new vector2(.40,.048), new vector2(.44,.048), new vector2(.52,.048), new vector2(.56,.048), new vector2(.60,.048), new vector2(.68,.048), new vector2(.72,.048), new vector2(.76,.048), new vector2(.84,.048), new vector2(.88,.048), new vector2(.92,.048), 
		
		new vector2(.04,.064), new vector2(.20,.064), new vector2(.28,.064), new vector2(.36,.064), new vector2(.44,.064), new vector2(.52,.064), new vector2(.60,.064), new vector2(.68,.064), new vector2(.76,.064), new vector2(.84,.064), new vector2(.92,.064), 
		
		new vector2(.04,.080), new vector2(.20,.080), new vector2(.28,.080), new vector2(.36,.080), new vector2(.44,.080), new vector2(.52,.080), new vector2(.60,.080), new vector2(.68,.080), new vector2(.76,.080), new vector2(.84,.080), new vector2(.88,.080), 
		
		new vector2(.04,.096), new vector2(.20,.096), new vector2(.28,.096), new vector2(.36,.096), new vector2(.44,.096), new vector2(.52,.096), new vector2(.60,.096), new vector2(.68,.096), new vector2(.76,.096), new vector2(.84,.096), new vector2(.92,.096), 
		
		new vector2(.04,.112), new vector2(.08,.112), new vector2(.12,.112), new vector2(.20,.112), new vector2(.24,.112), new vector2(.28,.112), new vector2(.36,.112), new vector2(.44,.112), new vector2(.52,.112), new vector2(.60,.112), new vector2(.68,.112), new vector2(.72,.112), new vector2(.76,.112), new vector2(.84,.112), new vector2(.92,.112), 
		
		new vector2(.04,.160), new vector2(.08,.160), new vector2(.12,.160), new vector2(.20,.160), new vector2(.24,.160), new vector2(.28,.160), new vector2(.36,.160), new vector2(.40,.160), new vector2(.44,.160), new vector2(.52,.160), new vector2(.56,.160), new vector2(.68,.160), new vector2(.76,.160), new vector2(.84,.160), new vector2(.88,.160), new vector2(.92,.160), 
		
		new vector2(.04,.176), new vector2(.20,.176), new vector2(.36,.176), new vector2(.52,.176), new vector2(.60,.176), new vector2(.68,.176), new vector2(.76,.176), new vector2(.84,.176), new vector2(.92,.176),
		
		new vector2(.04,.192), new vector2(.08,.192), new vector2(.12,.192), new vector2(.20,.192), new vector2(.24,.192), new vector2(.28,.192), new vector2(.36,.192), new vector2(.44,.192), new vector2(.52,.192), new vector2(.60,.192), new vector2(.76,.192), new vector2(.84,.192), new vector2(.88,.192), new vector2(.92,.192), 
		
		new vector2(.12,.208), new vector2(.20,.208), new vector2(.36,.208), new vector2(.44,.208), new vector2(.52,.208), new vector2(.60,.208), new vector2(.76,.208), new vector2(.84,.208), new vector2(.92,.208), 
		
		new vector2(.04,.224), new vector2(.08,.224), new vector2(.12,.224), new vector2(.20,.224), new vector2(.24,.224), new vector2(.28,.224), new vector2(.36,.224), new vector2(.40,.224), new vector2(.44,.224), new vector2(.52,.224), new vector2(.56,.224), new vector2(.76,.224), new vector2(.84,.224), new vector2(.88,.224), new vector2(.92,.224)
	],
	
	brickStates =
	[
		5,4,5,4,5,4,5,4,5,4,5,4,5,
		 4,3,4,3,4,3,4,3,4,3,4,3,
		3,2,3,2,3,2,3,2,3,2,3,2,3,
		 2,1,2,1,2,1,2,1,2,1,2,1
	],
	
	brickStatesName =
	[
		5,5,5, 3,3,3, 4,4,4, 4,4,4, 3,3,3, 2,2,2,
		5,     3,  3, 4,  4, 4,  4, 3,  3, 2,  2,
		5,     3,  3, 4,  4, 4,  4, 3,  3, 2,2,
		5,     3,  3, 4,  4, 4,  4, 3,  3, 2,  2,
		5,5,5, 3,3,3, 4,  4, 4,  4, 3,3,3, 2,  2,
	
		2,2,2, 1,1,1, 2,2,2, 1,1,   5,  1, 5,5,5,
		2,     1,     2,     1,  1, 5,  1, 5,  5,
		2,2,2, 1,1,1, 2,  2, 1,  1,     1, 5,5,5,
		    2, 1,     2,  2, 1,  1,     1, 5,  5,
		2,2,2, 1,1,1, 2,2,2, 1,1,       1, 5,5,5		

	],
	
    		
	//buttons
	buttonStart = new button(0.2640625 * WIDTH, 0.321875 * WIDTH, 0.45625 * WIDTH, 0.096875 * WIDTH, null, "", function(bool)
	{
		if(bool)
			gameState = STATE_GAME;
	}),
	
	buttonLeft = new button(0, 0, WIDTH/2, HEIGHT, null, "LEFT", function(bool)
	{
		if(bool)
			touchLeft = true;
		else
			touchLeft = false;
	}),

	buttonRight = new button(WIDTH/2, 0, WIDTH/2, HEIGHT, null, "RIGHT", function(bool)
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
		width: WIDTH*0.080,	//sizing
		height: WIDTH*0.016,
		velocity: 0,

		update: function()
		{
			//Input
			if (moveLeft || moveRight)
			{
				if (!AABBIntersect(this.x,	this.y,	this.width,	this.height,
							  	   ball.x, 	ball.y, ball.side, 	ball.side))
				{
					if(moveLeft)
					{
						this.x -= (deltaTime * WIDTH * 0.0005);
						this.velocity = -1;
					}
					if(moveRight)
					{
						this.x += (deltaTime * WIDTH * 0.0005);
						this.velocity = 1;
					}
				}
			}
			else this.velocity = 0;


			//clamp paddle to canvas
			this.x = clamp(this.x, 0, WIDTH-this.width);
		},

		draw: function()
		{
			context.drawImage(imgPaddle, this.x, this.y, this.width, this.height);
		}
	},

	ball =
	{
		x: null,
		y: null,
		prevX: null,
		prevY: null,
		direction: new vector2(0,0),
		side: WIDTH*0.016,
		speed: WIDTH*0.0035,
		isColliding: false,
		canCollidePaddle: true,
		isPaddleCollision: false,
		reflectNormal: new vector2(0,0),
		collideTimer: new timer(),

		setReflectNormal: function(v)
		{
			if (v != undefined)
			{
				this.reflectNormal.x = v.x;
				this.reflectNormal.y = v.y;
			}
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
			this.y = paddle.y - paddle.height*1.5;

			//generate random x val for the direction vector
			var r;
			if (Math.random() < 0.5)
				r = -1;
			else r = 1;

			this.setDirection(r,-1);
		},

		update: function()
		{
            this.prevX = this.x;
			this.prevY = this.y;
			
			//update position with the direction and speed
			this.x += (this.direction.x) * this.speed;
			this.y += (this.direction.y) * this.speed;
			
			<!-- Collision Checks ----------------------------------------------------------------------------------------------------------------------------------------------------->
			
            //paddle collision
			if(this.canCollidePaddle)
			{
				this.collideTimer.reset();
				
				if (AABBIntersect(paddle.x,paddle.y,paddle.width,paddle.height,
								  this.x, this.y, this.side, this.side))
				{

					this.isColliding = true;
					var newNormal = calcCollisionNormal(this.x + this.side/2, this.y + this.side/2, paddle.x + paddle.width/2, paddle.y + paddle.height/2, paddle.width, paddle.height);
					
					if (newNormal != undefined)
					{
						if(this.y < paddle.y)
						{
							newNormal.x += paddle.velocity*0.2; //	imparts some x velocity of the paddle onto the ball direction
							newNormal.x = clamp(newNormal.x, -0.4, 0.4);
						}
						
						this.setReflectNormal(newNormal.normalise());
					}
					this.isPaddleCollision = true;
				}
			}
            
            //brick collision
            //update all bricks in array
            for (var i = 0; i < brickArray.length; i++)
            {
                var brick = brickArray[i];
                if (AABBIntersect(brick.x, brick.y, brick.width, brick.height,
                                  this.x,  this.y,   this.side,    this.side))
                {
                    if (!this.isColliding)
						brick.collide(i);
					this.isColliding = true;
				    this.setReflectNormal(calcCollisionNormal(this.x + this.side/2, this.y + this.side/2, brick.x + brick.width/2, brick.y + brick.height/2, brick.width, brick.height));
                }
            }
            
			//Window collision
			if (this.y < 1)                  		//Top
			{
				this.isColliding = true;
				this.setReflectNormal(new vector2(0,1));
			}
			else if (this.y >= HEIGHT)    			//Bottom
			{
				this.serve();
			}
			else if (this.x < 1)             		//Left
			{
				this.isColliding = true;
				this.setReflectNormal(new vector2(1,0));
			}
			else if (this.x >= WIDTH - ball.side)	//Right
			{
				this.isColliding = true;
				this.setReflectNormal(new vector2(-1,0));
			}


			
			if (this.isColliding)
			{
				if((this.isPaddleCollision && this.canCollidePaddle) || !this.isPaddleCollision)
				{
					this.direction = calcReflectedVector(this.direction, this.reflectNormal);
					this.isColliding = false;

					if(this.isPaddleCollision)
					{
						this.canCollidePaddle = false;
					}
				}
			}
			
			if (!this.canCollidePaddle)
			{
				if (this.collideTimer.stopwatch(1))
				{
					this.canCollidePaddle = true;
				}
				else this.canCollidePaddle = false;
			}
			
			this.isPaddleCollision = false;

			//reset the ball when ball is outisde the canvas (bottom side)
			if (this.y >= HEIGHT - this.side - 2)
			{
				this.serve();
			}
		},

		//drawing the ball
		draw: function()
		{
			context.drawImage(imgBall, this.x, this.y, this.side, this.side);
		}
	}

//Loading image sources
imgBrick.src 	= "images/T_Brick.bmp";
imgPaddle.src 	= "images/T_Paddle.bmp";
imgBall.src		= "images/T_Ball.bmp";
imgStartBackground.src = "images/BG_Start.bmp";


function Main()
{
	// create, initiate and append the game canvas we create at the start
	// we do this because if we dont give the canvas time to load,
	// it wont appear on the page
	isMob = detectMob();

	canvas = document.createElement("canvas");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	
	if(isMob)
	{
		updateMobCanvasSize();
	}
	
	context = canvas.getContext("2d");
	document.body.appendChild(canvas);
	
	
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
		clientX = evt.touches[0].clientX - 8;
		clientY = evt.touches[0].clientY - 8;

		console.log("clientX:" + clientX-8 + ", clientY: " + clientY-8);
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
		clientX = evt.clientX - 8;
		clientY = evt.clientY - 8;

		console.log("clientX:" + clientX-8 + ", clientY: " + clientY-8);
	}, false);

	document.addEventListener("mouseup", function(evt)
	{
		//cache coords
		clientX = null;
		clientY = null;
	}, false);
	
	document.addEventListener("select", function(evt)
	{
		//disable selection
		event.preventDefault();
		event.stopPropagation();
	}, false);
	
	//resize mobile canvas size
	document.addEventListener("orientationchange", function(evt)
	{
		if(isMob)
			updateMobCanvasSize();
	}, false);
	
	document.addEventListener("resize", function(evt)
	{
		if(isMob)
			updateMobCanvasSize();
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
		
		if(keystate[keyDebug])
			if(debugTimer.stopwatch(1))
			{
				if(showDebug)
					showDebug = false;
				else
					showDebug = true;
			}

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

function detectMob()
{ 
	if( navigator.userAgent.match(/Android/i)
	 || navigator.userAgent.match(/webOS/i)
	 || navigator.userAgent.match(/iPhone/i)
	 || navigator.userAgent.match(/iPad/i)
	 || navigator.userAgent.match(/iPod/i)
	 || navigator.userAgent.match(/BlackBerry/i)
	 || navigator.userAgent.match(/Windows Phone/i)
 	  )
	{
    	return true;
	}
	else
	{
    	return false;
	}
}

function updateMobCanvasSize()
{
	var w = window.innerWidth;
	var h = w*9/16;
	
	WIDTH = w;
	HEIGHT = h;
	
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	buttonLeft.width = WIDTH/2;
	buttonLeft.height = HEIGHT;
	buttonRight.x = WIDTH/2;
	buttonRight.width = WIDTH/2;
	buttonRight.height = HEIGHT;
}

<!-- Main game stuff --------------------------------------------------------------------------------------------------------------->

function init()
{
	paddle.x = WIDTH/2;
	paddle.y = HEIGHT - WIDTH*0.060;
	ball.serve();
	
	//loop through brick position array, create all objects, add them to the appropriate array and set states
    for (var i = 0; i < brickPositionsName.length; i++)
    {
        var newBrick = new brick(brickPositionsName[i], brickStatesName[i]);
        brickArray.push(newBrick);
    }
}

//this is where we call to update all out objects
function update()
{
	if (gameState == STATE_TITLE)
	{
		buttonStart.update();
	}
	
	if (gameState == STATE_GAME)
	{
		ball.update();
		paddle.update();
		buttonLeft.update();
		buttonRight.update();

		//update all bricks in array
		for (var i = 0; i < brickArray.length; i++)
		{
			brickArray[i].update();
		}
	}
	
	if (gameState == STATE_WIN)
	{
		
	}
	
	if (gameState == STATE_LOSE)
	{
		
	}
}

//drawing everything to the canvas
function draw()
{
	// draw the canvas
	context.fillStyle = "#111";
	context.fillRect(0,0, WIDTH, HEIGHT);
	context.save();
	
	context.msImageSmoothingEnabled = false;
	context.imageSmoothingEnabled = false;
	
	if (gameState == STATE_TITLE)
	{
		context.drawImage(imgStartBackground,0,0,WIDTH,HEIGHT);
	}
	
	
	if (gameState == STATE_GAME)
	{
		//draw objects
		paddle.draw();
		context.fillStyle = "#FFF"; //white draw colour
		ball.draw();
		buttonLeft.draw();
		buttonRight.draw();

		//draw all bricks in array
		for (var i = 0; i < brickArray.length; i++)
		{
			brickArray[i].draw(false);
		}

		context.globalCompositeOperation = 'color';
		for (var i = 0; i < brickArray.length; i++)
		{
			brickArray[i].draw(true);
		}

		context.fillStyle = "#F00";	//white draw colour
		context.strokeStyle="#F00";
		//text for the stuff
		context.font = "12px Courier New"; //size and font

		//draw debug text
		if(showDebug)
		{
			context.globalCompositeOperation = 'source-over';
			context.fillText(Math.ceil(1000/deltaTime) + " FPS", 10, 25);
			context.fillText("deltaTime: " + deltaTime, 10, 50);
			context.fillText("time: " + time, 10, 75);
			context.fillText("ball pos: x = " + (ball.x - ball.x % 1) + ", y = " + (ball.y - ball.y % 1), 10, 100);
			context.fillText("ball direction: " + ball.direction, 10, 125);
			context.fillText("clientX: " + clientX + ", clientY: " + clientY, 10, 150);
			var testVec1 = new vector2(0,-1);
			var testVec2 = new vector2(0,1);
			context.fillText(testVec1 + " -> " + testVec2 + "  reflection: " + calcReflectedVector(testVec1,testVec2) + " (testing reflection maths)", 10, 175);
		}
	}
	
	if (gameState == STATE_WIN)
	{
		
	}
	
	if (gameState == STATE_LOSE)
	{
		
	}
	
	context.restore();
}

Main();
