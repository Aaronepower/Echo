var router    = require('express').Router()  

// Render Index from jade
router.get('/', function (req, res) {
  res.render('index') 
})

// Render Partial from the ':name' parameter
router.get('/partials/:name', function (req, res) {
  res.render('partials/'+req.params.name)
})

router.get('/', function (req, res) {
	res.sendFile('./docs/index.html')
})

module.exports = router
