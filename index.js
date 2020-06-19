const express = require('express')
const app = express();
app.use(express.static('public'));

const port = process.env.PORT || 5000;

var server = app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

var io = require("socket.io")(server);

io.on("connection", socket => {

  socket.on("join", (name) => {
    socket.join(name);
  });

  socket.on("change1", data => {
    io.to(data.name).emit("changeMade1", data)
  });

  socket.on("change2", data => {
    io.to(data.name).emit("changeMade2", data)
  });

  socket.on("change-arb", data => {
    // console.log("arb", data)
    io.to(data.name).emit("change-arb-recieve", data)
  });

  socket.on("change-ball1", data => {
    io.to(data.name).emit("change-ball1-get", data);
  });

});