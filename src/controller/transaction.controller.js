const { default: mongoose } = require("mongoose");
const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const emailService = require("../services/email.service")

const createTransaction = async(req,res) => {

    const {fromAccount,toAccount,amount,idempotencyKey} = req.body;

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"fromAccount, toAccount, amount and idempotency key are required."
        })
    }

    const fromUserAccount = await accountModel.findOne({_id:fromAccount})

    if (!fromUserAccount) {
        return res.status(400).json({
            message: "Invalid fromAccount."
        })
    }

    const toUserAccount = await accountModel.findOne({_id:toAccount})

    if(!toUserAccount){
        return res.status(400).json({
            message:"Invalid toAccount."
        })
    }

    //Checking tranction for same idempotency key
    const isTransactionAlreadyExists = await transactionModel.findOne({idempotencyKey})

    if(isTransactionAlreadyExists){

        if(isTransactionAlreadyExists.status === "COMPLETED"){
            return res.status(200).json({
                message:"Transaction is already processed.",
                transaction:isTransactionAlreadyExists
            })
        }

        if (isTransactionAlreadyExists.status === "PENDING") {
            return res.status(200).json({
                message: "Transaction is still in process.",
            })
        }

        if (isTransactionAlreadyExists.status === "FAILED") {
            return res.status(500).json({
                message: "Transaction is failed, please retry.",
            })
        }

        if (isTransactionAlreadyExists.status === "REVERSED") {
            return res.status(500).json({
                message: "Transaction was reversed, please retry.",
            })
        }
    }

    //Checking account status
    if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
        return res.status(400).json({
            message:"Both fromAccount and toAccount must be active to process a transaction."
        })
    }

    //Calculating sender's balance using ledger entries
    const balance = await fromUserAccount.getBalance();

    if(balance < amount){
        return res.status(400).json({
            message:"Insufficient balance."
        })
    }

    let transaction;
    try {
        //Creating transaction 
        const session = await mongoose.startSession();
        session.startTransaction();
        
        transaction = (await transactionModel.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status:"PENDING"
        }],{ session }))[0]

        const debitLedgerEntry = await ledgerModel.create([{
            account:fromAccount,
            amount,
            transaction:transaction._id,
            type:"DEBIT"
        }],{ session })

        await(()=>{
            return new Promise((resolve) => setTimeout(resolve,5*1000))
        })()

        const creditLedgerEntry = await ledgerModel.create([{
            account:toAccount,
            amount,
            transaction:transaction._id,
            type:"CREDIT"
        }],{ session })

        await transactionModel.findOneAndUpdate(
            { _id:transaction._id },
            { status : "COMPLETED" },
            { session }
        )

        await session.commitTransaction()
        session.endSession()

    } catch (error) {
        return res.status(400).json({
            message:"Transaction is pending due to some issues, please retry after sometime."
        })
    }
    
    // Sending email notification 

    await emailService.sendTransactionEmail(req.user.email,req.user.name,amount,toAccount);
    return res.status(201).json({
        message:"Transaction completed successfully.",
        transaction
    })
    
}

const createInitialFundsTransaction = async (req,res) => {

    const {toAccount,amount,idempotencyKey} = req.body;

    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"toAccount, amount and idempotency key are required."
        })
    }

    const toUserAccount = await accountModel.findOne({ _id: toAccount })

    if (!toUserAccount) {
        return res.status(400).json({
            message: "Invalid toAccount."
        })
    }
    
    const fromUserAccount = await accountModel.findOne({ user: req.user._id })

    if (!fromUserAccount) {
        return res.status(400).json({
            message: "Invalid fromAccount."
        })
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = new transactionModel({
        fromAccount : fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    })

    const debitLedgerEntry = await ledgerModel.create([{
        account : fromUserAccount._id,
        amount,
        transaction : transaction._id,
        type:"DEBIT"
    }],{ session })

    const creditLedgerEntry = await ledgerModel.create([{
        account : toAccount,
        amount,
        transaction : transaction._id,
        type:"CREDIT"
    }],{ session })

    transaction.status = "COMPLETED";
    await transaction.save({ session })

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
        message:"Initial funds transaction completed successfully.",
        transaction
    })

}

module.exports = {
    createTransaction,
    createInitialFundsTransaction
}