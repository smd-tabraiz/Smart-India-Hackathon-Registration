const express = require('express');
const router = express.Router();
const { getSpreadsheetData, syncSpreadsheetData } = require('../controllers/spreadsheetController');

router.get('/data', getSpreadsheetData);
router.post('/sync', syncSpreadsheetData);

module.exports = router;
