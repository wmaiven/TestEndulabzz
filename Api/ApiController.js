const express = require('express'); 
const router = express.Router();
const DataBase = require('../Db/fakeDb');


router.get('/', (req, res) => {
    res.json(DataBase);
});

router.get("/user/:id",  (req, res) => {
    if (isNaN(req.params.id)) {
        res.sendStatus(400);
    } else {
        let id = parseInt(req.params.id);
        let User = DataBase.users.find(Users => Users.id == id);
        if (User != undefined) {
            res.statusCode = 200;
            res.json(User);
        } else {
            res.sendStatus(404);
        }
    }
});




router.post('/CriarUser', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let id = req.body.id;
    if(email === undefined || password === undefined || id === undefined || isNaN(id) || isNaN(password)){
        res.send("dados incorretos").sendStatus(500);
    }else{
        DataBase.users.push({id:id, email: email, password: password});
        res.send("Dados cadastrados").sendStatus(200);   
    }
});


module.exports = router;





