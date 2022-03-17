//모듈 추출
var fs = require('fs');
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var socketio = require('socket.io');
var ejs = require('ejs');
var db_config  = require('./config.json');


var client = mysql.createConnection({
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database
});

//생성자 함수 선언
var counter = 0;
function Product(name, image, price, count) {
    this.index = counter++;
    this.name = name;
    this.image = image;
    this.price = price;
    this.count = count;
}

//변수 선언
var products = [
    new Product('헤어롤', 'aaa.jpg', 12000, 30),
    new Product('헤어스프레이', 'aaa.jpg', 28000, 30),
    new Product('헤어핀', 'aaa.jpg', 5000, 30),
    new Product('두피케어샴푸', 'aaa.jpg', 17000, 30),
    new Product('두피케어린스', 'aaa.jpg', 17000, 30),
    new Product('탈모방지샴푸', 'aaa.jpg', 17000, 30),
    new Product('탈모방지트린트먼트', 'aaa.jpg', 17000, 30),
    new Product('탈모방지린스', 'aaa.jpg', 17000, 30),
    new Product('보색샴푸-핑크', 'aaa.jpg', 22000, 30),
    new Product('보색샴푸-그레이', 'aaa.jpg', 22000, 30),
    new Product('트린트먼트', 'aaa.jpg', 17000, 30),
    new Product('헤어토닉', 'aaa.jpg', 22000, 30),
    new Product('헤어오일', 'aaa.jpg', 15000, 30),
    new Product('헤어팩', 'aaa.jpg', 7000, 30),
    new Product('헤어브러쉬', 'aaa.jpg', 18000, 30),
    new Product('앰플', 'aaa.jpg', 35000, 30)
];

//웹서버 생성
var app = express();
var server = http.createServer(app);

//웹서버를 설정
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
  extended: false
}));

//웹서버 실행
server.listen(52273, function () {
    console.log('Server Running at http://127.0.0.1:52273');
});

//라우트 수행
app.get('/', function (request, response) {
  fs.readFile('term.html', 'utf8', function (error, data) {
    response.send(data);
  });
});

//회원가입 페이지
app.get('/join', function (request, response){
  fs.readFile('join.html', 'utf8', function(error,data){
    response.send(data);
  });
});

app.post('/join', function (request, response){
  var body = request.body;
  client.query('INSERT INTO sign (id, password, name, phone, email) VALUES(?, ?, ?, ?, ?)', [
    body.id, body.password, body.name, body.phone, body.email
  ], function(){
    response.redirect('/');
  });
});

//디자인 페이지
app.get('/design', function (request, response){
  fs.readFile('design.html', 'utf8', function(error,data){
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    response.end(data);
  });
});

//가격표 페이지
app.get('/price', function (request, response){
  fs.readFile('price.html', 'utf8', function(error,data){
    client.query('select * from price', function(error, results){
      response.send(ejs.render(data, {
        data:results
      }));
    });
  });
});

app.post('/price', function (request, response){
    response.redirect('/reservation');
});

//예약 페이지
app.get('/reservation', function (request, response) {
  fs.readFile('reservation.html', 'utf8', function (error, data) {
    response.send(data);
  });
});

app.post('/reservation', function (request, response){
  var body = request.body;
  client.query('INSERT INTO reservation (name, phone, date, time) VALUES(?, ?, ?, ?)', [
    body.name, body.phone, body.date, body.time
  ], function(){
    response.redirect('/reservation2');
  });
});

app.get('/reservation2', function (request, response) {
  fs.readFile('reservation2.html', 'utf8', function (error, data) {
    response.send(data);
  });
});

app.post('/reservation2', function (request, response){
    response.redirect('/');
});

//지점 페이지
app.get('/branch', function (request, response){
  fs.readFile('branch.html', 'utf8', function(error,data){
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    response.end(data);
  });
});

//강남점 페이지
app.get('/gang', function (request, response) {
  fs.readFile('gang.html', 'utf8', function (error, data) {
    response.send(data);
  });
});

app.post('/gang', function (request, response){
    response.redirect('/reservation');
});

//신논현점 페이지
app.get('/sin', function (request, response) {
  fs.readFile('sin.html', 'utf8', function (error, data) {
    response.send(data);
  });
});

app.post('/sin', function (request, response){
    response.redirect('/reservation');
});

//가로수길점 페이지
app.get('/ga', function (request, response) {
  fs.readFile('ga.html', 'utf8', function (error, data) {
    response.send(data);
  });
});

app.post('/ga', function (request, response){
    response.redirect('/reservation');
});

//shop페이지
app.get('/shop', function (request, response) {
    var htmlPage = fs.readFileSync('shop.html', 'utf8');
    response.send(ejs.render(htmlPage, {
        products: products
    }));
});

app.get('/chat', function (request, response){
  fs.readFile('chat.html', 'utf8', function(error,data){
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    response.end(data);
  });
});

app.get('/notice', function (request, response){
  fs.readFile('notice.html', 'utf8', function(error,data){
    client.query('select * from notice', function(error, results){
      response.send(ejs.render(data, {
        data:results
      }));
    });
  });
});

app.post('/notice', function (request, response){
    response.redirect('/');
});

app.get('/delete/:id', function (request, response) {
  client.query('DELETE FROM notice WHERE id=?', [request.params.id], function () {
   response.redirect('/notice');
  });
});

app.get('/insert', function (request, response) {
  fs.readFile('insert.html', 'utf8', function (error, data) {
    response.send(data);
  });
});

app.post('/insert', function (request, response) {
  var body = request.body;
  client.query('INSERT INTO notice (nicname, title, content) VALUES (?, ?, ?)', [
      body.nicname, body.title, body.content
  ], function () {
    response.redirect('/notice');
  });
});

//소켓 서버 생성 및 실행
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    function onReturn(index) {
        products[index].count++;
        clearTimeout(cart[index].timerID);
        delete cart[index];
        io.sockets.emit('count', {
            index: index,
            count: products[index].count
        });
    };

    socket.on( 'join', function(data){
      socket.join(data);
      socket.room = data;
    });

    socket.on( 'message', function(data){
      io.sockets.in( socket.room ).emit('message', data);
    });

    var cart = {};

    //cart 이벤트
    socket.on('cart', function (index) {
        products[index].count--;
        cart[index] = {};
        cart[index].index = index;
        cart[index].timerID = setTimeout(function () {
            onReturn(index);
        }, 1000 * 60 * 10);
        io.sockets.emit('count', {
            index: index,
            count: products[index].count
        });
    });
    //buy 이벤트
    socket.on('buy', function (index) {
        clearTimeout(cart[index].timerID);
        delete cart[index];
        io.sockets.emit('count', {
            index: index,
            count: products[index].count
        });
    });
    //return 이벤트
    socket.on('return', function (index) {
        onReturn(index);
    });
});
