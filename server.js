const app       = require('./app');
const mongoose  = require('mongoose');
const defaultAdmin = require('./utils/createAdmin');
const init = require('./utils/init');
const chat = require('./chat/chat');

const server = require('http').createServer(app);
chat(server);

const port  = process.env.PORT || 3000;
const DB = process.env.DB_STRING; 

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('DB conntection establish');
    defaultAdmin();
    init();
}).catch(err=>console.log(err));

server.listen(port,()=>{
    console.log(`Server started at port ${port}`)
});

module.exports = server;