const authMiddleware = require("../middleware/auth.middleware");
const transactionContoller = require("../controller/transaction.controller")

const router = require("express").Router();

/**
 * - POST /api/transactions/
 * - Create a new transaction
 */
router.post("/", authMiddleware.authMiddleware,transactionContoller.createTransaction)

/**
 * - POST /api/transactions/system/initial-funds
 * - Create initial funds transaction from system user
 */
router.post("/system/initial-funds", authMiddleware.authMiddleware,transactionContoller.createInitialFundsTransaction)

module.exports = router