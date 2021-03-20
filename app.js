require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const mysql = require('mysql');
const { connect } = require('tls');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : process.env.SQL_PW,
  database : 'postdb'
});
connection.connect(); //이거 중복되면안되서 초기에 한번만 해주기


app.use(express.static(__dirname));

app.get('/',(req,res)=>{
    res.sendFile('./index.html',{root:__dirname});
});

io.on('connection',(socket)=>{
    console.log('user in');
    // console.log(socket);
    

    connection.query('SELECT * FROM post',(err,results)=>{
        // console.log(results);
        io.emit('/loadTweets',JSON.stringify(results));
    })

    socket.on('/post',(data)=>{
        console.log(data);
        connection.query(`INSERT INTO post (title,name,content,date,\`like\`,\`hate\`) VALUES('${data.title}','${data.name}','${data.content}',NOW(),0,0)`, function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            // console.log(results);
            io.emit('/newTweet',JSON.stringify(data));
        });
        // connection.end();
    })

    socket.on('disconnect',()=>{
        console.log('user out');
    })
})


http.listen(8080,()=>console.log('server is on..'));