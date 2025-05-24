const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");

rulesBtn.addEventListener("click", () => rules.classList.add("show"));
closeBtn.addEventListener("click", () => rules.classList.remove("show"));

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 2,
  dx: 2,
  dy: -2
};

const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0
};

const brickInfo = {
  w: 30,
  h: 15,
  padding: 5,
  offsetX: 60,
  offsetY: 40,
  visible: false
};

const brickRowCount = 15;
const brickColumnCount = 15;

const bricks = [];
for (let row = 0; row < brickRowCount; row++) {
  bricks[row] = [];
  for (let col = 0; col < brickColumnCount; col++) {
    const x = col * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = row * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;

    // Ромбоподібне розташування
    const center = Math.floor(brickRowCount / 2);
    const isDiamond = Math.abs(row - center) + Math.abs(col - center) <= center;

    bricks[row][col] = {
      x,
      y,
      ...brickInfo,
      visible: isDiamond
    };
  }
}

let score = 0;

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#000";
  if (score >= 25) {
    ctx.fillText("ІПЗ найкращі!!!", canvas.width / 2 - 80, 30);
  } else {
    ctx.fillText(`Score: ${score}`, canvas.width - 120, 30);
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  bricks.forEach(row => {
    row.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
      ctx.fill();
      ctx.closePath();
    });
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawScore();
  drawBall();
  drawPaddle();
  drawBricks();
}

function movePaddle() {
  paddle.x += paddle.dx;

  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }

  if (ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  bricks.forEach(row => {
    row.forEach(brick => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.h
        ) {
          ball.dy *= -1;
          brick.visible = false;
          increaseScore();
        }
      }
    });
  });

  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
    ball.speed = 2;
    ball.dx = 2;
    ball.dy = -2;
  }
}

function showAllBricks() {
  const center = Math.floor(brickRowCount / 2);
  bricks.forEach((row, r) => {
    row.forEach((brick, c) => {
      brick.visible = Math.abs(r - center) + Math.abs(c - center) <= center;
    });
  });
}

function increaseScore() {
  score++;

  if (score % 10 === 0) {
    ball.speed += 1;
    ball.dx = ball.dx > 0 ? ball.speed : -ball.speed;
    ball.dy = ball.dy > 0 ? ball.speed : -ball.speed;
  }

  const totalVisible = bricks.flat().filter(b => b.visible === false).length;
  const allDestroyed = bricks.flat().filter(b => b.visible).length === 0;

  if (allDestroyed) {
    showAllBricks();
  }
}

function update() {
  movePaddle();
  moveBall();
  draw();
  requestAnimationFrame(update);
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}

function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

update();
