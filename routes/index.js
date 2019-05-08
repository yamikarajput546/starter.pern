const Router = require("express-promise-router");

const passport = require('passport');

const router = new Router();

router.get("/secret", (req, res) => {
  res.send("You found my secret!")
})

/** Authentication */
router.get('/auth/slack', passport.authorize('slack'));

// OAuth callback url
router.get('/auth/slack/callback',
  passport.authorize('slack', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.save(() => {
      res.redirect('/')
    })
  }
);

module.exports = router