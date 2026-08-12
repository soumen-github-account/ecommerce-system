import express from "express"
import cors from "cors"
import "dotenv/config"

const port = 3000 | process.env.PORT
const app = express()
app.use(express.json())

app.use("/", (req, res)=>{
    res.send("api is working successfully...")
})



app.listen(port, () => {
    console.log("app is started on : ", port)
})