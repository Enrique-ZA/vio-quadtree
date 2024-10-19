let ctx;
let particles = [];

function uyvStart() {
  const sW = 1000;
  const sH = 667;
  const canvasObjMap = uyvCreateScreen(sW, sH);
  ctx = canvasObjMap.canvas;
  if (ctx === null) {
    throw new Error("ctx cannot be null");
  }

  for (let i = 0; i < 5000; i++) {
    particles[i] = new Particle(
      uyvRandom(0, ctx.canvas.width),
      uyvRandom(0, ctx.canvas.height),
    );
  }
}

function uyvUpdate() { }

function uyvDraw() {
  uyvBackground(52, 52, 52, ctx);

  const boundary = new uyvRectangle(1000 / 2, 667 / 2, 1000, 667);
  const qt = new uyvQuadTree(boundary, 4);

  for (let particle of particles) {
    const p = new uyvVector2D(particle.pos.x, particle.pos.y, particle);
    qt.insert(p);
  }
  qt.draw();

  for (let i = 0; i < particles.length; i++) {
    particles[i].move();
    particles[i].show();
    particles[i].setHighlight(false);

    let rect = new uyvRectangle(
      particles[i].pos.x,
      particles[i].pos.y,
      particles[i].r * 2,
      particles[i].r * 2,
    );

    let rects = qt.queryRectangle(rect);
    for (let rect of rects) {
      const other = rect.data;
      if (other instanceof Particle && particles[i] !== other) {
        if (particles[i].intersects(other)) {
          particles[i].setHighlight(true);
        }
      }
    }
  }
}

class Particle {
  constructor(x, y) {
    this.r = 1.5;
    this.highlightB = false;
    this.pos = new uyvVector2D(x, y);
  }
  move() {
    this.pos.x += uyvRandom(-1, 1);
    this.pos.y += uyvRandom(-1, 1);
  }
  show() {
    uyvPush(ctx);
    uyvNoStroke();
    if (this.highlightB) {
      uyvFill(ctx, 255, 0, 255);
    } else {
      uyvFill(ctx, 0, 255, 0);
    }
    uyvCircle(ctx, this.pos.x, this.pos.y, this.r * 2);
    uyvPop(ctx);
  }
  intersects(particle) {
    let d = uyvDist2D(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y);
    return d < this.r + particle.r;
  }
  setHighlight(value) {
    this.highlightB = value;
  }
}
