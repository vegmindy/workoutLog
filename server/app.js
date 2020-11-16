require("dotenv").config();

const express = require("express")

const db = require("./db");

const app = express();

const controllers = require("./controllers");

const validateSession = require("./middleware/validateSession");

app.use(express.json());

app.use("/user", controllers.usercontroller);

app.use("/log", validateSession, controllers.logcontroller)

db.authenticate()
.then(() => db.sync()) // => {force: true}
.then(() => {
    app.listen(process.env.PORT, () => console.log(`[Server: ] App is listening on Port ${process.env.PORT}`));
    })
    .catch((err) => {
        console.log("[Server: ] Server Crashed");
        console.error(err);
    })