const express = require('express'); 
const router = express.Router();
const DataBase = require('../Db/fakeDb');
const { Queue, Worker } = require('bull');
const userQueue = new Queue('usersQueue');


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
            res.json(User);
            res.statusCode = 200;
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

router.post('/addNaFila/:id', async (req, res) => {
    let id = parseInt(req.params.id);
    let User = DataBase.users.find(Users => Users.id == id);

    if (User !== undefined && !User.inQueue) {
        await userQueue.add({ id: id });
        User.inQueue = true;
        res.send("Usuário adicionado à fila").sendStatus(200);
    } else {
        res.sendStatus(404); 
    }
});



module.exports = router;





