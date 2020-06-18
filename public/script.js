
var canvas;
var canvasContext;
var ballX = 800 / 2;
var ballY = getRandomArbitrary(100, 500);
var ballSpeedX = -10;
var ballSpeedY = getRandomArbitrary(-2, 5);
var yourScore = 0;
var compScore = 0;
var flag = false;

var player = 1;
var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

function computerMovement() {
  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);
  if (ballX < canvas.width / 2) {
    if (paddle2Y == canvas.height / 2) {
      paddle2Y = paddle2Y;
    }
    // if (paddle2YCenter < canvas.height / 2) {
    //   paddle2Y += 5;
    // }
    // else if (paddle2YCenter > canvas.height / 2) {
    //   paddle2Y -= 5;
    // }
  }

  else if (paddle2YCenter < ballY - 15 && ballX > canvas.width / 3) {
    paddle2Y += 10;
  }
  else if (paddle2YCenter > ballY + 15 && ballX > canvas.width / 3) {
    paddle2Y -= 10;
  }
}

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  }
}

window.onload = function () {
  console.log("heelo world");

  var { name } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
  });
  console.log(name)
  if (name != undefined && sessionStorage.getItem("name")) {
    alert("player 1")
  } else {
    alert("player 2")
    player = 2;
  }

  // const socket = io.connect("http://localhost:5000");
  const socket = io.connect("https://paddlepong.herokuapp.com");

  socket.emit('join', name);

  socket.on('changeMade', (data) => {
    console.log(data)
    if (data.player === 1) {
      paddle1Y = data.paddle1Y;
    } else {
      paddle2Y = data.paddle2Y;
    }
  });

  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  var framesPerSecond = 30;

  setInterval(function () {
    if (flag) { moveEverything(); }
    drawEverything();
  }, 1000 / framesPerSecond);


  canvas.addEventListener('mousemove',
    function (evt) {
      var mousePos = calculateMousePos(evt);
      if (player === 1) {
        paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
        socket.emit('change', { paddle1Y, player, name })
      } else if (player === 2) {
        paddle2Y = mousePos.y - (PADDLE_HEIGHT / 2);
        socket.emit('change', { paddle2Y, player, name })
      }
    });


  window.addEventListener('keyup',
    function (event) {
      if (event.keyCode === 32) {
        flag = true;
        yourScore = compScore = 0;
      }
    });

}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min);
}

function ballReset() {
  flag = false;
  ballSpeedX = -10;
  ballSpeedY = getRandomArbitrary(-2, 5);
  ballX = canvas.width / 2;
  ballY = getRandomArbitrary(100, canvas.height - 100);
}

function moveEverything() {
  // computerMovement();
  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;
  if (ballX < 1) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      if (deltaY != 0) {
        ballSpeedY = deltaY * 0.35;
      }
    }
    else {
      yourScore--;
      ballReset();
    }
  }

  if (ballX > canvas.width - 1) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      if (deltaY != 0) {
        ballSpeedY = deltaY * 0.35;
      }
    }
    else {
      compScore--;
      ballReset();
    }
  }
  if (ballY > canvas.height || ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawNet() {
  for (var i = 0; i < canvas.height; i += 40) {
    colorRect((canvas.width / 2) - 1, i, 2, 20, 'white');
  }
}

function drawEverything() {
  //console.log(ballX);  
  colorRect(0, 0, canvas.width, canvas.height, 'black');
  colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
  colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

  if (flag) {
    colorCircle(ballX, ballY, 8, 'white');
    drawNet();
  }
  else if (yourScore < 0 && !flag) {
    canvasContext.font = "20px Verdana";
    canvasContext.fillText("Retry,Hit space-bar to Play", (canvas.width / 2) - 130, canvas.height / 2);
  }
  else if (compScore < 0 && !flag) {
    canvasContext.font = "20px Verdana";
    var gradient = canvasContext.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", " magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");

    canvasContext.fillStyle = gradient;
    canvasContext.fillText("YOU WIN!!.Hit space-bar to Play", (canvas.width / 2) - 220, canvas.height / 2);
  }
  else {
    canvasContext.font = "20px Verdana";
    canvasContext.fillText("Hit space-bar to Play", (canvas.width / 2) - 120, canvas.height / 2);
  }
}

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
