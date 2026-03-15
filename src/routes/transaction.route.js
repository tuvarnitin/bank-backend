const authMiddleware = require("../middleware/auth.middleware");
const transactionContoller = require("../controller/transaction.controller")

const router = require("express").Router();

console.log(transactionContoller.createTransaction)

router.post("/", authMiddleware.authMiddleware,transactionContoller.createTransaction)

module.exports = router