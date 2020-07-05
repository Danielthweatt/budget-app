const router = require('express').Router();
const purchasesRouter = require('./purchases');

router.use('/purchases', purchasesRouter);

module.exports = router;