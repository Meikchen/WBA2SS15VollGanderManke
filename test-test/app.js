var express = require('express');
var bodyParser = require('body-parser');
var redis = require('redis');

var db = redis.createClient();
var app = express();
app.use(bodyParser.json());





app.post('/users', function(req, res){
        
        var newUser = req.body;
    
        db.incr('id:users', function(err, rep){
            newUser.id = rep;
            db.set('user:'+newUser.id, JSON.stringify(newUser), function(err, rep){
                res.json(newUser); 
            });
        });
    });

app.get('/users/:id', function(req, res){
        db.get('user:'+req.params.id, function(err, rep){
           if(rep){
               res.type('json').send(rep);
           }
            else {
                res.status(404).type('text').send("Der User wurde nicht gefunden");
            }
        });
    });

app.put('/users/:id', function(req, res){
    db.exists('user:'+req.params.id, function(err, rep){
        if (rep == 1){
            var updatedUser = req.body;
            updatedUser.id = req.params.id;
            db.set('user:'+req.params.id, JSON.stringify(updatedUser), function(err, rep){
                res.json(updatedUser);
            });
        }
        else {
            res.status(404).type('text').send('Der User mit der ID ' + req.params.id + ' wurde nicht gefunden');
        }
    });  
});

app.delete('/users/:id', function(req, res){
    db.del('user:'+req.params.id, function(err, rep){
        if(rep == 1){
            res.status(200).type('text').send('OK');
        }
        else{
            res.status(404).type('text').send('Der User mit der ID ' + req.params.id + ' wurde nicht gefunden');
        }
    }); 
});

app.get("/users", function(req, res){
    db.keys('user:*', function(err, rep){
        var users = []; 
        
        if(rep.length == 0) {
            res.json(users);
            return;
        }
        
        db.mget(rep, function(err, rep){
           rep.forEach(function(val){
               users.push(JSON.parse(val));
           });
        
            users = users.map(function(user){
                return {id: user.id, name: user.name};
            });
            res.json(users);
        });
    }); 
});


app.post('/equipment/kamera', function(req, res){
        var newCam = req.body;
    
        db.incr('id:kamera', function(err, rep){
            newCam.id = rep;
            db.set('kamera:' + newCam.id, JSON.stringify(newCam), function(err, rep){
                res.json(newCam); 
            });
        });
    });


app.listen(3000);