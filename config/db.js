import mongoose from "mongoose";

const { connection } = mongoose;
connection.on("error", console.error.bind(console, "connection error:"));
connection.once("open", async () => {
  console.log("Database connected");
});

export default {
  connect: () => {
    mongoose.set("strictQuery", true);
    mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },
};
