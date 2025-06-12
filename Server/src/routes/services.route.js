const router = require("express").Router()

const servicesController = require("../controllers/servicesController")

// Enhance text with OpenAI /api/services/enhance-text [POST]
router.post("/enhance-text", servicesController.enhanceText)

module.exports = router
