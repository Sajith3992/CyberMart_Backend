const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 8000;


app.use(express.json());
app.use(cors());


const router = require("./routes/router.js");
const sellerrouter  = require("./routes/sellerRoutes.js");
const product = require("./routes/product.js");
const brand = require("./routes/brand.js");

app.use("/api", router);
app.use('/api',sellerrouter);
app.use('/api',product);
app.use('/api',brand);

app.get('/signup', (req, res) => {
    res.send('Please sign up to access this page.'); // You can render an HTML signup page here
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
