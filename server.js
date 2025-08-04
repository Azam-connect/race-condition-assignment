const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes");

const app = express();
const httpServer = require('http').createServer(app);

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", router);

httpServer.listen(process.env.PORT, () => {
    console.log(`Server is running at Port : ${process.env.PORT}`);
});


