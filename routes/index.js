const express = require('express');
const passport = require('passport');

const router = express.Router()

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