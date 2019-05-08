const path = require("path")
const express = require("express");
const session = require("express-session");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const SlackStrategy = require('passport-slack').Strategy;
const dotenv = require("dotenv");

const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");
const compiler = webpack(webpackConfig);

const router = require("./routes");

dotenv.config();

// SERVER
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  })
);

app.use(require("webpack-hot-middleware")(compiler));

// static assets
app.use(express.static("public"));

// main route
app.get("/", (req, res) =>
  res.sendFile(path.resolve(__dirname, "./public/index.html"))
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

passport.use(new SlackStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
}, (accessToken, refreshToken, profile, done) => {
  // optionally persist profile data
  done(null, profile);
}
));

app.use(passport.initialize());
app.use(passport.session());

app.use(router);

const PORT = parseInt(process.env.PORT, 10) || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
