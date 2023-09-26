const express = require('express'); 
const router = express.Router();
const DataBase = require('../Db/fakeDb');
const cron = require('node-cron');

const processNextUser = () => {
    const job = DataBase.users.find(user => !user.inQueue);
    if (job) {
        job.inQueue = true;
        return job;
    } else {
        return null;
    }
};

cron.schedule('* * * * *', () => {
    const user = processNextUser();
    if (user) {
        console.log(`Processando usuário: ${user.id}`);
    } else {
        console.log('Nenhum usuário na fila');
    }
});

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
            res.status(200).json(User);          
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
        res.status(500).send("Dados incorretos");
    } else {
        DataBase.users.push({id:id, email: email, password: password, inQueue: false});
        res.sendStatus(200).send("Dados cadastrados");
    }
});

router.post('/addNaFila/:id', async (req, res) => {
    let id = parseInt(req.params.id);
    let User = DataBase.users.find(Users => Users.id == id);
    if (User !== undefined && !User.inQueue) {
        User.inQueue = true;
        res.send("Usuário adicionado à fila").sendStatus(200);
    } else {
        res.sendStatus(404); 
    }
});
router.get('/processarProximo', (req, res) => {
    const user = processNextUser();
    if (user) {
        res.json(user);
    } else {
        res.sendStatus(404); // Nenhum usuário na fila
    }
});

module.exports = router;
