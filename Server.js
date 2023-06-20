const express = require("express")
const app = express()
const routes = require("./Routes/Routes")
const dotenv = require("dotenv")
const db = require("./Config/Connect")
dotenv.config()

app.use(express.json())
// database connection is here
db()
app.use("/api",routes)

app.listen(process.env.PORT,()=>{
    console.log("server is running on the port ",process.env.PORT);
})