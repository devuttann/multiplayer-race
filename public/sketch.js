let socket;
let players = {};
let myId;

function setup() {
  createCanvas(800, 500);

  socket = io();

  socket.on("connect", () => {
    myId = socket.id;
  });

  socket.on("state", (data) => {
    players = data;
  });
}

function draw() {
  background(30);

  // Finish line
  stroke(255);
  line(width - 100, 0, width - 100, height);

  for (let id in players) {
    let p = players[id];

    if (id === myId) fill(0, 255, 0);
    else fill(255);

    circle(p.x, p.y, 20);

    // Win condition
    if (p.x > width - 100) {
      fill(255);
      textSize(32);
      textAlign(CENTER);
      text(id === myId ? "YOU WIN!" : "Someone won!", width/2, height/2);
      noLoop();
    }
  }
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) socket.emit("move", "RIGHT");
  if (keyCode === LEFT_ARROW) socket.emit("move", "LEFT");
  if (keyCode === UP_ARROW) socket.emit("move", "UP");
  if (keyCode === DOWN_ARROW) socket.emit("move", "DOWN");
}
