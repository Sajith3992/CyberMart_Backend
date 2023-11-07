const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 8000;


app.use(express.json());
app.use(cors());


const router = require("./routes/router.js");
const sellerrouter  = require("./routes/sellerRoutes.js");


app.use("/api", router);
app.use('/api',sellerrouter);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
