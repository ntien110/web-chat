const router = require('express').Router();

router.route('/find')
      .post(function(req, res ){
          var userId = req.body.userId;
      })