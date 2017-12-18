// canvas setup
let canvas = document.querySelector('canvas');
let c = canvas.getContext('2d');

// ball information
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let ballRadius = 10;

// paddle information
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

// bricks information
let brickRowCount = 3;
let brickColumnCount = 5
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// score information
let score = 0;

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

function collisionDetention() {
  for (let col = 0; col < brickColumnCount; col++) {
    for ( let r = 0; r < brickRowCount; r++) {
      let b = bricks[col][r];
      if (b.status == 1) {
        if (x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score == brickRowCount*brickColumnCount) {
            alert("You win, congrats!");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  c.font = '16px Ariel';
  c.fillStyle = '#0095DD';
  c.fillText('Score: ' + score, 8, 20);
}

function drawBall() {
  c.beginPath();
  c.arc(x, y, ballRadius, 0, Math.PI*2);
  c.fillStyle = '#0095DD';
  c.fill();
  c.closePath();
}

function drawPaddle() {
  c.beginPath();
  c.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  c.fillStyle = '#0095DD';
  c.fill();
  c.closePath();
}

function drawBricks() {
  for (let col = 0; col < brickColumnCount; col++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[col][r].status == 1) {
        let brickX = (col*(brickWidth+brickPadding))+brickOffsetLeft;
        let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[col][r].x = brickX;
        bricks[col][r].y = brickY;
        c.beginPath();
        c.rect(brickX, brickY, brickWidth, brickHeight);
        c.fillStyle = "#0095DD";
        c.fill();
        c.closePath();
      }
    }
  }
}

function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  collisionDetention();
  drawBricks();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      document.location.reload();
    }
  }

  x += dx;
  y += dy;

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
  requestAnimationFrame(animate);
}

animate();