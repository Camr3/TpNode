var express = require('express');
var router = express.Router();
const Model = require('../model/model');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Budget app' });
});



//Post Method
router.post('/', async (req, res) => {
  const data = new Model({
      montant: req.body.montant,
      categorie: req.body.categorie,
      date: req.body.date,
      type: req.body.type
  })

  try {
      const dataToSave = await data.save();
     //res.status(200).json(dataToSave)
     res.redirect('/')
  }
  catch (error) {
      res.status(400).json({message: error.message})
  }  
})


//Get
router.get('/total', async (req, res) => { 
  try{
    const total =  await Model.aggregate([
      {
        $group: {
          _id: null,
          totalrevenus: {
            $sum: {
              $cond: [{ $eq: ["$type", "Revenu"] }, "$montant", 0]
            }
          },
          totaldepenses: {
            $sum: {
              $cond: [{ $eq: ["$type", "Depense"] }, "$montant", 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          revenus: "$totalrevenus",
          depenses: "$totaldepenses",
          balance: { $subtract: ["$totalrevenus", "$totaldepenses"] }
        }
      }
    ]);
    console.log({ total }); 
    res.render('balance', { total: total[0] || { revenus: 0, depenses: 0, balance: 0 } });
} catch(error) {
  res.status(500).send("Erreur");
}
})

//GetAll
router.get('/getAll', async (req, res) => {
  try{
      const data = await Model.find();
      res.render('getAll', { data });
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
})












module.exports = router;
