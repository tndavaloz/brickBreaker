// canvas setup
let canvas = document.querySelector('canvas');
let c = canvas.getContext('2d');

function Ball(x, y, dx, dy, radius) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;

  this.draw = () => {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    c.fillStyle = '#0095DD';
    c.fill();
    c.closePath();
  }

  this.updateDirection = (paddle) => {
    if (this.x + this.dx > canvas.width - this.radius || this.x + this.dx < this.radius) {
      this.dx = -this.dx;
    }

    if (this.y + this.dy < this.radius) {
      this.dy = -this.dy;
    } else if (this.y + this.dy > canvas.height - this.radius) {
      if (this.x > paddle.x && this.x < paddle.x + paddle.w) {
        this.dy = -this.dy;
      } else {
        document.location.reload();
      }
    }

    this.x += this.dx;
    this.y += this.dy;
  }
}

function Paddle(h, w, x) {
  this.h = h;
  this.w = w;
  this.x = x;
  this.rightPressed = false;
  this.leftPressed = false;

  this.draw = () => {
      c.beginPath();
      c.rect(this.x, canvas.height - this.h, this.w, this.h);
      c.fillStyle = '#0095DD';
      c.fill();
      c.closePath();
  }

  this.update = () => {
    if (this.rightPressed && this.x < canvas.width - this.w) {
      this.x += 7;
    } else if (this.leftPressed && this.x > 0) {
      this.x -= 7;
    }
  }

  this.keyDownHandler = (e) => {
    if (e.keyCode == 39) {
      this.rightPressed = true;
    } else if (e.keyCode == 37) {
      this.leftPressed = true;
    }
  }

  this.keyUpHandler = (e) => {
    if (e.keyCode == 39) {
      this.rightPressed = false;
    } else if (e.keyCode == 37) {
      this.leftPressed = false;
    }
  }

  document.addEventListener('keydown', this.keyDownHandler, false);
  document.addEventListener('keyup', this.keyUpHandler, false);
}

function Bricks(rowCount, columnCount, width, height, padding, offsetTop, offsetLeft) {
  this.rowCount = rowCount;
  this.columnCount = columnCount;
  this.width = width;
  this.height = height;
  this.padding = padding;
  this.offsetTop = offsetTop;
  this.offsetLeft = offsetLeft;
  this.bricks = [];

  this.build = () => {
    for (let c = 0; c < this.columnCount; c++) {
      this.bricks[c] = [];
      for (let r = 0; r < this.rowCount; r++) {
        this.bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
  }

  this.collisionDetention = (ball) => {
    for (let col = 0; col < this.columnCount; col++) {
      for ( let r = 0; r < this.rowCount; r++) {
        let b = this.bricks[col][r];
        if (b.status == 1) {
          if (ball.x > b.x && ball.x < b.x + this.width && ball.y > b.y && ball.y < b.y + this.height) {
            ball.dy = -ball.dy;
            b.status = 0;
            score++;
            if (score == this.rowCount * this.columnCount) {
              alert("You win, congrats!");
              document.location.reload();
            }
          }
        }
      }
    }
  }

  this.update = () => {
    for (let col = 0; col < this.columnCount; col++) {
      for (let r = 0; r < this.rowCount; r++) {
        if (this.bricks[col][r].status == 1) {
          let brickX = (col*(this.width + this.padding)) + this.offsetLeft;
          let brickY = (r*(this.height + this.padding)) + this.offsetTop;
          this.bricks[col][r].x = brickX;
          this.bricks[col][r].y = brickY;
          c.beginPath();
          c.rect(brickX, brickY, this.width, this.height);
          c.fillStyle = "#0095DD";
          c.fill();
          c.closePath();
        }
      }
    }
  }

}

// score information
let score = 0;

function drawScore() {
  c.font = '16px Ariel';
  c.fillStyle = '#0095DD';
  c.fillText('Score: ' + score, 8, 20);
}

// ball information
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let ballRadius = 10;

// brick information
let brickRowCount = 3;
let brickColumnCount = 5
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

// paddle information
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let ball = new Ball(x, y, dx, dy, ballRadius);
let paddle = new Paddle(paddleHeight, paddleWidth, paddleX);
let bricks = new Bricks(3, 5, 75, 20, 10, 30, 30);

bricks.build();

function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  ball.draw();
  paddle.draw();
  drawScore();
  bricks.collisionDetention(ball);
  bricks.update();

  ball.updateDirection(paddle);
  paddle.update();
  requestAnimationFrame(animate);
}

animate();
