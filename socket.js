import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: function (origin, callback) {
        callback(null, true);
      },
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("authenticate", (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.role === "admin") {
          socket.join("admin");
          console.log(`Socket ${socket.id} joined admin room`);
        } 
        
        socket.join(decoded.id);
        console.log(`Socket ${socket.id} joined user room ${decoded.id}`);
        
        socket.emit("authenticated", { success: true });
      } catch (error) {
        console.error("Socket authentication failed", error);
        socket.emit("unauthorized", { message: "Invalid token" });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
