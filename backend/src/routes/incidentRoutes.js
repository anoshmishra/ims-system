const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');

router.get('/', incidentController.getAll);
router.patch('/:id/status', incidentController.updateStatus);
router.post('/:id/rca', incidentController.submitRca);
router.post('/:id/analyze', incidentController.analyze);

module.exports = router;