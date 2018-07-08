// framework
const express = require('express');

// padrao
const path = require('path');
const app = express();

//informando a porta que sera acessada pelo websocket
const server = require('http').createServer(app);
// definir protocolo wss para o websocket
const io = require('socket.io')(server);


// pasta de arquivos publicos
app.use(express.static(path.join(__dirname , "public")));

// informando onde estao as views
app.set('views', path.join(__dirname , "public"));

// node utliza ejs para views, então para informar para poder utilizar view como html
app.engine("html" , require('ejs').renderFile);
app.set('view engine', 'html');


app.use('/', (req , res) =>{
    res.render('index.html');
});

let mensagens = [];

io.on('connection', socket => {
    console.log( 'socket conectado :' , socket.id)

    socket.emit('previusMessage', mensagens);

    socket.on('sendMessage', data => {
        mensagens.push(data);
        // dispara o data para todos conectados no websocket que escutam o receivedMessage
        socket.broadcast.emit('receivedMessage', data);
    });


});

server.listen(3000);

