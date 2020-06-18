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
    // console.log(name)
    socket.join(name);
  })

  socket.on("change", data => {
    // console.log(data)
    io.to(data.name).emit("changeMade", data)
  })
});