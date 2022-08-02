/* s : header canvas */
// const canvas = document.querySelector('.g-head-canvas');
// const context = canvas.getContext('2d');
// const drops = [];
// let selectedBox; // 클릭된 box를 넣어놓은 변수

// context.font = 'bold 30px sans-serif';

// class Drop {
// 	constructor(index, x, y, speed, length) {
// 		this.index = index;
// 		this.x = x;
// 		this.y = y;
// 		this.speed = speed;
// 		this.length = length;
// 		this.draw();
// 	}

// 	draw() {
// 		context.beginPath();
// 		context.strokeStyle = '#dfdfdf';
// 		context.moveTo(this.x, this.y);
// 		context.lineTo(this.x, this.y + this.length);
// 		context.stroke();
// 		context.closePath();
// 	}
// }

// function render() {
// 	context.clearRect(0, 0, canvas.width, canvas.height);

// 	drops.forEach((drop) => {
// 		drop.y += drop.speed;
// 		if (drop.y > canvas.height) {
// 			drop.y = 0;
// 			drop.x = Math.random() * canvas.width;
// 			drop.speed = Math.random() * 4 + 1 + 2; // d : 3 + 1
// 			drop.length = Math.random() * 2 + 2 + 2; // d : 5 + 2
// 		}

// 		drop.draw();
// 	});

// 	requestAnimationFrame(render); //반복
// }

// let tempX, tempY, tempSpeed, tempLength;
// for (let i = 0; i < 30; i++) { // d : 200
// 	tempX = Math.random() * canvas.width;
// 	tempY = Math.random() * canvas.height;
// 	tempSpeed = Math.random() * 3 + 1;
// 	tempLength = Math.random() * 5 + 2;

// 	drops.push(new Drop(i, tempX, tempY, tempSpeed, tempLength));
// }
// render();
/* e : header canvas */

/* s : body canvas */
function random(low, high) {
  return Math.random() * (high - low) + low;
}

class Visual {
  constructor() {
    this.canvas = document.querySelector('.g-bg-canvas');
    this.context = this.canvas.getContext('2d');
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.particleLength = 777; // d : 150
    this.particles = [];
    this.particleMaxRadius = 1; // d : 8

    this.handleMouseMoveBind = this.handleMouseMove.bind(this);
    this.handleClickBind = this.handleClick.bind(this);
    this.handleResizeBind = this.handleResize.bind(this);

    this.initialize();
    this.render();
  }

  initialize() {
    this.resizeCanvas();
    for (let i = 0; i < this.particleLength; i++) {
      this.particles.push(this.createParticle(i));
    }
    this.bind();
  }

  bind() {
    document.body.addEventListener('mousemove', this.handleMouseMoveBind, false);
    document.body.addEventListener('click', this.handleClickBind, false);
    window.addEventListener('resize', this.handleResizeBind, false);
  }
  
  unbind() {
    document.body.removeEventListener('mousemove', this.handleMouseMoveBind, false);
    document.body.removeEventListener('click', this.handleClickBind, false);
    window.removeEventListener('resize', this.handleResizeBind, false);
  }

  handleMouseMove(e) {
    this.enlargeParticle(e.clientX, e.clientY);
  }

  handleClick(e) {
    this.burstParticle(e.clientX, e.clientY);
  }

  handleResize() {
    this.resizeCanvas();
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
    let y = random(this.canvasHeight / 2 - 350, this.canvasHeight / 2 + 350); // d : -150, 150
    y += random(-200, 100); // d : -100, 100
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
      color: { r: random(0, 100), g: random(0, 200), b: 255 },
      speed: alpha - 0.5, // d : 1
      amplitude: random(50, 200),
      isBurst: false
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

  enlargeParticle(clientX, clientY) {
    this.particles.forEach(particle => {
      if (particle.isBurst) return;

      const distance = Math.hypot(particle.x - clientX, particle.y - clientY);

      // if (distance <= 100) {
      //   const scaling = (100 - distance) / 1.5;
      //   TweenMax.to(particle, 0.5, {
      //     radius: particle.defaultRadius + scaling,
      //     ease: Power2.easeOut
      //   });
      // } else {
      //   TweenMax.to(particle, 0.5, {
      //     radius: particle.defaultRadius,
      //     ease: Power2.easeOut
      //   });
      // }
    });
  }

  burstParticle(clientX, clientY) {
    this.particles.forEach(particle => {
      const distance = Math.hypot(particle.x - clientX, particle.y - clientY);

      // if (distance <= 100) {
      //   particle.isBurst = true;
      //   TweenMax.to(particle, 0.5, {
      //     radius: particle.defaultRadius + 200,
      //     alpha: 0,
      //     ease: Power2.easeOut,
      //     onComplete: () => {
      //       this.particles[particle.id] = this.createParticle(particle.id, true);
      //     }
      //   });
      // }
    });
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

new Visual();
/* e : body canvas */


// 참고사이트
/* https://cloud-library.tistory.com/87 */
/* http://rwdb.kr/interestedeffects/ */
/* https://wsss.tistory.com/1283 */
/* https://wsss.tistory.com/1070?category=701824 */