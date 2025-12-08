import { Request, Response } from "express";

import config from "./config";
import initDB from "./config/db";
import app from "./app";

//initialized DB
initDB();


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "This is the root routes of vehicle rental system backend",

  });
});

app.listen(config.port, () => {
  console.log("The server running on port 5000");
});
