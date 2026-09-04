const express = require('express');
const router = express.Router();
const { 
  getSpreadsheetData, 
  syncSpreadsheetData,
  getLiveCsv,
  dumpToGoogleSheet,
} = require('../controllers/spreadsheetController');

router.get('/data', getSpreadsheetData);
router.get('/live-csv', getLiveCsv);
router.get('/csv', getLiveCsv);
router.post('/sync', syncSpreadsheetData);
router.post('/dump-to-google-sheet', dumpToGoogleSheet);

module.exports = router;
