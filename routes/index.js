var router    = require('express').Router()  

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index') 
})

router.get('/partials/:name', function (req, res) {
  res.render('partials/'+req.params.name)
})
module.exports = router
