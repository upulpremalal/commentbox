const http = require('http');
const fs =require('fs');
const con =require("./DBConnection");

const hostname = '127.0.0.1'
const port = '3000'

const server = http.createServer((req,res)=> {
    if(req.method == 'GET' && req.url == '/')
    {
        res.statusCode = 200;
        res.setHeader('content-type', 'text/html');     
        fs.createReadStream('./index.html').pipe(res);         
    }
    else if(req.method == 'GET' && req.url == '/styles/customStyles.css')
    {
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/css');
        fs.createReadStream('./styles/customStyles.css').pipe(res);   
    }
    else if(req.method == "POST" && req.url == "/insert")
    {
        res.statusCode =200;
        res.setHeader('Content-Type', 'text/plain');

        var content = '';
        req.on('data', function(data){
            content += data;
            var obj = JSON.parse(content);

            console.log("The UserName is:"+ obj.name);
            console.log("The comment is: "+ obj.message);
            var conn = con.getconnection();

            conn.query('INSERT INTO comments.comments (comments.userName, comments.comment) VALUES (?,?)',[obj.name,obj.message], function(error, results, fields){
            if(error) throw error;
            console.log("Success!");           
        });

        conn.end();
        res.end("Succes!");
        });
    }
    else if(req.method == "GET" && req.url == '/functions.js')
    {
        res.writeHead(200, {"Content-type":"text/javascript"});
        fs.createReadStream("./functions.js").pipe(res);
    }
    else if(req.method == "GET", req.url == '/home')
    {
        res.statusCode ==200;
        res.setHeader('content-Type', 'application/json');

        var conn = con.getconnection();

        conn.query('SELECT * FROM comments.comments', function(error, results, fields){
            if(error) throw error;
            var comments = JSON.stringify(results);
            res.end(comments);           
        }); 

        conn.end();
    }
});
server.listen(port, hostname, ()=>{
    console.log(`Server running at http://${hostname}:${port}/`)
});