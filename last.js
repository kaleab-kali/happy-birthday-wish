let W = window.innerWidth;
let H = window.innerHeight;
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const maxConfettis = 150;
const particles = [];

const possibleColors = [
    "DodgerBlue",
    "OliveDrab",
    "Gold",
    "Pink",
    "SlateBlue",
    "LightBlue",
    "Gold",
    "Violet",
    "PaleGreen",
    "SteelBlue",
    "SandyBrown",
    "Chocolate",
    "Crimson"
];

function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function confettiParticle() {
    this.x = Math.random() * W; // x
    this.y = Math.random() * H - H; // y
    this.r = randomFromTo(11, 33); // radius
    this.d = Math.random() * maxConfettis + 11;
    this.color = possibleColors[Math.floor(Math.random() * possibleColors.length)];
    this.tilt = Math.floor(Math.random() * 33) - 11;
    this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
    this.tiltAngle = 0;

    this.draw = function () {
        context.beginPath();
        context.lineWidth = this.r / 2;
        context.strokeStyle = this.color;
        context.moveTo(this.x + this.tilt + this.r / 3, this.y);
        context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
        return context.stroke();
    };
}

function Draw() {
    const results = [];

    // Magical recursive functional love
    requestAnimationFrame(Draw);

    context.clearRect(0, 0, W, window.innerHeight);

    for (var i = 0; i < maxConfettis; i++) {
        results.push(particles[i].draw());
    }

    let particle = {};
    let remainingFlakes = 0;
    for (var i = 0; i < maxConfettis; i++) {
        particle = particles[i];

        particle.tiltAngle += particle.tiltAngleIncremental;
        particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
        particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

        if (particle.y <= H) remainingFlakes++;

        // If a confetti has fluttered out of view,
        // bring it back to above the viewport and let if re-fall.
        if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
            particle.x = Math.random() * W;
            particle.y = -30;
            particle.tilt = Math.floor(Math.random() * 10) - 20;
        }
    }

    return results;
}

window.addEventListener(
    "resize",
    function () {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    },
    false
);

// Push new confetti objects to `particles[]`
for (var i = 0; i < maxConfettis; i++) {
    particles.push(new confettiParticle());
}

// Initialize
canvas.width = W;
canvas.height = H;
Draw();

var c = document.getElementById("c");
var ctx = c.getContext("2d");

var bc = document.createElement("canvas");
var bCtx = bc.getContext("2d");

var cw = c.width = bc.width = window.innerWidth,
    cx = cw / 2;
var ch = c.height = bc.height = window.innerHeight + 100,
    cy = ch;

var frames = 0;
var requestId = null;
var rad = (Math.PI / 180);
var kappa = 0.5522847498;

var x, y;
bCtx.strokeStyle = "#abcdef";
bCtx.lineWidth = 1;

var balloons = [];

function Balloon() {
    this.r = randomIntFromInterval(20, 70);
    this.R = 1.4 * this.r;
    this.x = randomIntFromInterval(this.r, cw - this.r);
    this.y = ch + 2 * this.r;
    this.a = this.r * 4.5;
    this.pm = Math.random() < 0.5 ? -1 : 1;
    this.speed = randomIntFromInterval(1.5, 4);
    this.k = this.speed / 5;
    this.hue = this.pm > 0 ? "210" : "10";
}

function Draw2() {

    updateBallons(bCtx);

    ctx.clearRect(0, 0, cw, ch);
    var img = bc;
    ctx.drawImage(img, 0, 0);

    requestId = window.requestAnimationFrame(Draw2);
}
//requestId = window.requestAnimationFrame(Draw);

function Init() {
    if (requestId) {
        window.cancelAnimationFrame(requestId);
        requestId = null;
    }
    cw = c.width = bc.width = window.innerWidth, cx = cw / 2;
    ch = c.height = bc.height = window.innerHeight + 100, cy = ch;
    bCtx.strokeStyle = "#abcdef";
    bCtx.lineWidth = 1;
    Draw2();
}

setTimeout(function () {
    Init();
    window.addEventListener('resize', Init, false);
}, 15);

function updateBallons(ctx) {
    frames += 1;
    if (frames % 37 == 0 && balloons.length < 37) {
        var balloon = new Balloon();
        balloons.push(balloon);
    }
    ctx.clearRect(0, 0, cw, ch);
    for (var i = 0; i < balloons.length; i++) {
        var b = balloons[i];
        if (b.y > -b.a) {
            b.y -= b.speed
        } else {
            b.y = parseInt(ch + b.r + b.R);
        }

        var p = thread(b, ctx);
        b.cx = p.x;
        b.cy = p.y - b.R;
        ctx.fillStyle = Grd(p.x, p.y, b.r, b.hue)
        drawBalloon(b, ctx);
    }
}

function drawBalloon(b, ctx) {

    var or = b.r * kappa; // offset

    var p1 = {
        x: b.cx - b.r,
        y: b.cy
    }
    var pc11 = {
        x: p1.x,
        y: p1.y + or
    }
    var pc12 = {
        x: p1.x,
        y: p1.y - or
    }

    var p2 = {
        x: b.cx,
        y: b.cy - b.r
    }
    var pc21 = {
        x: b.cx - or,
        y: p2.y
    }
    var pc22 = {
        x: b.cx + or,
        y: p2.y
    }

    var p3 = {
        x: b.cx + b.r,
        y: b.cy
    }
    var pc31 = {
        x: p3.x,
        y: p3.y - or
    }
    var pc32 = {
        x: p3.x,
        y: p3.y + or
    }

    var p4 = {
        x: b.cx,
        y: b.cy + b.R
    };
    var pc41 = {
        x: p4.x + or,
        y: p4.y
    }
    var pc42 = {
        x: p4.x - or,
        y: p4.y
    }

    var t1 = {
        x: p4.x + .2 * b.r * Math.cos(70 * rad),
        y: p4.y + .2 * b.r * Math.sin(70 * rad)
    }
    var t2 = {
        x: p4.x + .2 * b.r * Math.cos(110 * rad),
        y: p4.y + .2 * b.r * Math.sin(110 * rad)
    }

    //balloon
    ctx.beginPath();
    ctx.moveTo(p4.x, p4.y);
    ctx.bezierCurveTo(pc42.x, pc42.y, pc11.x, pc11.y, p1.x, p1.y);
    ctx.bezierCurveTo(pc12.x, pc12.y, pc21.x, pc21.y, p2.x, p2.y);
    ctx.bezierCurveTo(pc22.x, pc22.y, pc31.x, pc31.y, p3.x, p3.y);
    ctx.bezierCurveTo(pc32.x, pc32.y, pc41.x, pc41.y, p4.x, p4.y);
    //knot
    ctx.lineTo(t1.x, t1.y);
    ctx.lineTo(t2.x, t2.y);
    ctx.closePath();
    ctx.fill();
}

function thread(b, ctx) {
    ctx.beginPath();

    for (var i = b.a; i > 0; i -= 1) {
        var t = i * rad;
        x = b.x + b.pm * 50 * Math.cos(b.k * t - frames * rad)
        y = b.y + b.pm * 25 * Math.sin(b.k * t - frames * rad) + 50 * t
        ctx.lineTo(x, y)
    }
    ctx.stroke();
    return p = {
        x: x,
        y: y
    }
}

function Grd(x, y, r, hue) {
    grd = ctx.createRadialGradient(x - .5 * r, y - 1.7 * r, 0, x - .5 * r, y - 1.7 * r, r);
    grd.addColorStop(0, 'hsla(' + hue + ',100%,65%,.95)');
    grd.addColorStop(0.4, 'hsla(' + hue + ',100%,45%,.85)');
    grd.addColorStop(1, 'hsla(' + hue + ',100%,25%,.80)');
    return grd;
}

function randomIntFromInterval(mn, mx) {
    return ~~(Math.random() * (mx - mn + 1) + mn);
}