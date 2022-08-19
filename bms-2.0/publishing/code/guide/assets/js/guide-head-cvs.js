/* s : g-bg-canvas style1 */
function random(low, high) {
  return Math.random() * (high - low) + low;
}

class Visual {
  constructor() {
    this.canvas = document.querySelector('.g-bg-canvas');
    this.context = this.canvas.getContext('2d');
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.particleLength = 300; // d : 150
    this.particles = [];
    this.particleMaxRadius = 2; // d : 8
    this.initialize();
    this.render();
  }
  initialize() {
    this.resizeCanvas();
    for (let i = 0; i < this.particleLength; i++) {
      this.particles.push(this.createParticle(i));
    }
  }
  resizeCanvas() {
    this.canvasWidth = document.body.offsetWidth;
    this.canvasHeight = document.body.offsetHeight;
    this.canvas.width = this.canvasWidth * window.devicePixelRatio;
    this.canvas.height = this.canvasHeight * window.devicePixelRatio;
    this.context = this.canvas.getContext('2d');
    this.context.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  createParticle(id, isRecreate) {
    const radius = random(1, this.particleMaxRadius);
    const x = isRecreate ? -radius - random(0, this.canvasWidth) : random(0, this.canvasWidth);
    let y = random(this.canvasHeight / 2 - 150, this.canvasHeight / 2 + 150); // d : -150, 150
    y += random(-500, 300); // d : -100, 100
    const alpha = random(0.05, 1);
    return {
      id: id,
      x: x,
      y: y,
      startY: y,
      radius: radius,
      defaultRadius: radius,
      startAngle: 0,
      endAngle: Math.PI * 2,
      alpha: alpha,
      color: { r: random(30, 100), g: random(150, 200), b: 255 },
      speed: alpha + 0, // d : 1
      amplitude: random(50, 200),
    };
  }
  drawParticles() {
    this.particles.forEach(particle => {
      this.moveParticle(particle);
      this.context.beginPath();
      this.context.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.alpha})`;
      this.context.arc(particle.x, particle.y, particle.radius, particle.startAngle, particle.endAngle);
      this.context.fill();
    });
  }
  moveParticle(particle) {
    particle.x += particle.speed;
    particle.y = particle.startY + particle.amplitude * Math.sin(((particle.x / 5) * Math.PI) / 300); // d : 5, 180
  }
  render() {
    this.context.clearRect(0, 0, this.canvasWidth + this.particleMaxRadius * 2, this.canvasHeight);
    this.drawParticles();
    this.particles.forEach(particle => {
      if (particle.x - particle.radius >= this.canvasWidth) {
        this.particles[particle.id] = this.createParticle(particle.id, true);
      }
    });
    requestAnimationFrame(this.render.bind(this));
  }
}
/* e : g-bg-canvas style1 */

/* s : g-bg-canvas style2 */
function starsParticle () {
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;
	var MAX_PARTICLES = (WIDTH * HEIGHT) / 20000;
	var DRAW_INTERVAL = 60;
	var canvas = document.querySelector('.g-bg-canvas');
	var context = canvas.getContext('2d');
	var gradient = null;
	var pixies = new Array();
	
	function setDimensions(e) {
		WIDTH = window.innerWidth;
		HEIGHT = window.innerHeight;
		MAX_PARTICLES = (WIDTH * HEIGHT) / 20000;
		canvas.width = WIDTH;
		canvas.height = HEIGHT;
	}
	
	setDimensions();
	window.addEventListener('resize', setDimensions);
	
	function Circle() {
		this.settings = {ttl:8000, xmax:4, ymax:3, rmin:2, rmax:3, drt:1}; // d : this.settings = {ttl:8000, xmax:5, ymax:2, rmin:8, rmax:15, drt:1};

		this.reset = function() {
			this.x = WIDTH*Math.random();                                                   //X 위치 랜덤 (0 ~ WIDTH)
			this.y = HEIGHT*Math.random();                                                  //Y 위치 랜덤 (0 ~ HEIGHT)
			this.r = ((this.settings.rmax-1)*Math.random()) + 1;                            //반지름 크기 랜덤 (1 ~ rmax)
			this.dx = (Math.random()*this.settings.xmax) * (Math.random() < .5 ? -1 : 1);   //X 이동거리 랜덤 (-xmax ~ xmax)
			this.dy = (Math.random()*this.settings.ymax) * (Math.random() < .5 ? -1 : 1);   //Y 이동거리 랜덤 (-ymax ~ ymax)
			this.hl = (this.settings.ttl/DRAW_INTERVAL)*(this.r/this.settings.rmax);        //총 생존 시간 (반지름 크기에 비례)
			this.rt = 0;                                                                    //현재 생존 시간 (0 -> hl -> 0)
			this.settings.drt = Math.random()+1;                                             //노화 속도 (1 ~ 2)
			this.stop = Math.random()*.2+.4;                                                //음영 범위 (0.4 ~ 0.6)
		}
	
		this.fade = function() {
			this.rt += this.settings.drt;	//노화 진행

			if(this.rt >= this.hl) {
				this.rt = this.hl;
				this.settings.drt = this.settings.drt*-1;
			} else if(this.rt < 0) {
				this.reset();	//수명이 다하면 새로운 위치에 생성
			}
		}
	
		this.draw = function() {
			var newo = (this.rt/this.hl); //밝기 (0 ~ 1) 
			context.beginPath();
			context.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);  //(x, y) 좌표에 반지름 r 크기의 원 그림
			context.closePath();

			var cr = this.r*newo; //밝기에 따른 반지름
			gradient = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, (cr < this.settings.rmin) ? this.settings.rmin : cr); 
			gradient.addColorStop(0.0, 'rgba(22, 160, 240,'+newo+')'); // d : gradient.addColorStop(0.0, 'rgba(255,255,255,'+newo+')');
			gradient.addColorStop(this.stop, 'rgba(22, 160, 240,'+(newo*.4)+')'); // d : gradient.addColorStop(this.stop, 'rgba(77,101,181,'+(newo*.6)+')');
			gradient.addColorStop(1.0, 'rgba(22, 160, 240, .05)'); // d : gradient.addColorStop(1.0, 'rgba(77,101,181,0)');
			context.fillStyle = gradient;
			context.fill();
		}
	
		this.move = function() {
			this.x += (1 - this.rt/this.hl)*this.dx;
			this.y += (1 - this.rt/this.hl)*this.dy;
			if(this.x > WIDTH || this.x < 0) this.dx *= -1;
			if(this.y > HEIGHT || this.y < 0) this.dy *= -1;
		}
	}
	
	function draw() {
		context.clearRect(0, 0, WIDTH, HEIGHT);
	
		for(var i=pixies.length; i<MAX_PARTICLES; i++) {
			pixies.push(new Circle());
			pixies[i].reset();
		}
	
		for(var i = 0; i < MAX_PARTICLES; i++) {
			pixies[i].fade();
			pixies[i].move();
			pixies[i].draw();
		}
	}
	setInterval(draw, DRAW_INTERVAL);
}
/* e : g-bg-canvas style2 */

window.onload = () => {
	// new Visual(); // style1
	starsParticle (); // style2
	if (!$('.chk-option-item .item2').is(':checked')) {
		$('.g-bg-canvas').hide();
	}
};