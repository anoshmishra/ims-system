const express = require('express');
const router = express.Router();
const signalController = require('../controllers/signalController');

router.post('/', signalController.ingest);

module.exports = router;