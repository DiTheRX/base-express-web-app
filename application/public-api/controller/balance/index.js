const trimRequest = require('trim-request');
const balanceValidate = require('./validators/balance.validate')

const {
    Router,
} = require('express');
const router = Router();

// Решение говно, но ничего улчше не придумал(пока что)
// const BalanceWrite = new BalanceWriteManager(new UserGateway(req.app.get("orm")));

router.post('/subtract', trimRequest.all,async (req, res,next)=> {
   try {
       const { error, value } = balanceValidate.validate(req.body);
       if (error) {
           return res.status(422).json({error:error.details[0].message});
       }

       const BalanceWrite = req.app.get("BalanceWriteManager")
       const result = await BalanceWrite.seqBalance(value);

       return res.status(200).json({message:result});

   }catch (e) {
       next(e)
   }
});
router.post('/add', trimRequest.all,async (req, res,next)=> {
    try {
        const { error, value } = balanceValidate.validate(req.body);
        if (error) {
            return res.status(422).json({error:error.details[0].message});
        }

        const BalanceWrite = req.app.get("BalanceWriteManager");
        const result = await BalanceWrite.addBalance(value);

        return res.status(200).json({message:result});

    }catch (e) {
        next(e)
    }
});

router.use(`/api/balance`,router);
module.exports = router;