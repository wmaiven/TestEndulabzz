const express = require('express'); 
const router = express.Router();
const DataBase = require('../Db/fakeDb');
const { Worker, Queue, QueueScheduler } = require('node-resque');

const connectionDetails = {
  pkg: 'ioredis',
  host: '127.0.0.1',
  password: '',
  port: 6380,
  database: 0,
};

const jobs = {
  processNextUser: {
    perform: async (job) => {
      const userId = job.data.id;
      let User = DataBase.users.find(Users => Users.id == userId);

      if (User !== undefined) {
        return User;
      } else {
        throw new Error('Usuário não encontrado');
      }
    }
  }
};

const worker = new Worker({ connection: connectionDetails, queues: ['usersQueue'] }, jobs);
const queueScheduler = new QueueScheduler({ connection: connectionDetails });

const userQueue = new Queue('usersQueue', { connection: connectionDetails });

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
        await userQueue.enqueue('usersQueue', 'processNextUser', { id });
        User.inQueue = true;
        res.send("Usuário adicionado à fila").sendStatus(200);
    } else {
        res.sendStatus(404); 
    }
});

router.get('/processarProximo', async (req, res) => {
    const job = await userQueue.queued('usersQueue');
    if (job) {
        const result = await job.perform();
        res.json(result);
    } else {
        res.sendStatus(404); // Nenhum usuário na fila
    }
});

module.exports = router;
