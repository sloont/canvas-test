
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 500;

canvas.style.background = "#232a2e"

const gravity = [0, -0.05];

const mouse = {
    x: undefined,
    y: undefined,
};

canvas.addEventListener("mousedown", (event) => {
    mouse.x = event.x - 50;
    mouse.y = event.y - 50;
    orbCollection.forEach(ballA => {
        checkMouseClick(ballA, mouse);
        if (checkMouseClick(ballA, mouse)) {
            applyForceWithClick(ballA, mouse);
        }
    })
    
});

class Orb {
    constructor(xpos, ypos, radius, speed) {
        this.xpos = xpos;
        this.ypos = ypos;
        this.radius = radius;
        this.speed = speed;
        this.radiusMagnitude = Math.sqrt(2 * (this.radius * this.radius));
        
        //set deltas
        this.dx = 1.5 * this.speed;
        this.dy = 1 * this.speed;
    }

    draw(context) {
        context.fillStyle = "coral"
        context.beginPath();
        /*test*/context.strokeStyle = "white";
        /*test*/context.lineWidth = 5;
        context.arc(this.xpos, this.ypos, this.radius, 0, Math.PI * 2, false);
        /*test*/context.stroke();
        context.fill();
    }

    update() {
        const xBound = canvas.width;
        const yBound = canvas.height;

        this.xpos += this.dx;
        this.ypos += this.dy;

        this.dx += gravity[0];
        this.dy -= gravity[1];

        if (this.xpos > xBound - this.radius) {
            this.xpos = xBound - this.radius - 5;
            this.dx *= -0.9;
        }

        else if (this.xpos < this.radius) {
            this.xpos = this.radius + 5;
            this.dx *= -0.9;
        }

        if (this.ypos > yBound - this.radius) {
            this.ypos = yBound - this.radius - 5;
            this.dy *= -0.7;
        }

        else if (this.ypos < this.radius) {
            this.ypos = this.radius + 6
            this.dy *= -0.7;
        }

        

        this.draw(context);
    }
            
}

const orbCollection = [];

//for not spawning balls inside the walls
const randomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
}

for (let i = 0; i < 2; i++) {
    let randomx = randomNumber(32, (canvas.width - 32));
    let randomy = randomNumber(32, (canvas.height - 32));
    orbCollection.push(new Orb(randomx, randomy, 32, 1));
    
}

const animate = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    orbCollection.forEach(ballA => {
        ballA.update();

        orbCollection.forEach(ballB => {
            if (ballA !== ballB) {
                const collision = checkCollision(ballA, ballB);
                if (collision[0]) {
                    adjustPositions(ballA, ballB, collision[1]);
                    resolveCollision(ballA, ballB);
                }
            }
        });
        
    });
    requestAnimationFrame(animate);
}

animate();
// orbCollection[0].draw(context);
