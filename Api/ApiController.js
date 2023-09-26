const express = require('express'); 
const router = express.Router();
const DataBase = require('../Db/fakeDb');


router.get('/', (req, res) => {
    res.json(DataBase);
});

router.post('/CriarUser', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let id = req.body.id;
    if(email === undefined || password === undefined || id === undefined || isNaN(id) || isNaN(password)){
        res.send("dados incorretos").sendStatus(500);
    }else{
        res.send("Dados cadastrados").sendStatus(200);
        console.log(DataBase.users);
        DataBase.users.push({id:id, email: email, password: password});
    }
});


module.exports = router;





