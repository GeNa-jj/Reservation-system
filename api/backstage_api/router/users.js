const db = require('../db');
const apiResult = require('../utils/apiResult');

const jwt = require('jsonwebtoken');

//过滤，filter.js 写好，那里需要就调用，按需加载
const filter = require('../utils/filter');

module.exports = {
    register(app){
        app.post('/login',(req,res)=>{
            let username = req.body.username;
            let password = req.body.password;
            var sql = `select * from users where username='${username}'`;
            db.mysql.select(sql).then(result=>{
                if(result.length>0){
                    sql += ` and password='${password}';`;
                    db.mysql.select(sql).then((data)=>{
                        if(data.length>0){
                            res.send(apiResult(true,username));  
                        }else{
                            res.send(apiResult(false,null,'登录信息错误'));
                        }
                    }).catch((error)=>{
                        res.send(apiResult(false,null,null,error));
                    });
                }else{
                    res.send(apiResult(false,null,'此用户未注册'));
                }
            }).catch(error=>{
                res.send(apiResult(false,null,null,error));
            });
        });

        app.post('/register',(req,res)=>{
            let username = req.body.username;
            let password = req.body.password;
            var sql = `select * from users where username='${username}'`;
            db.mysql.select(sql).then(result=>{
                if(result.length>0){
                    res.send(apiResult(false,null,'此用户已注册'));
                }else{
                    sql = `INSERT INTO users (username, password)
                            VALUES ('${username}', '${password}');`;
                    db.mysql.insert(sql).then(data=>{
                        res.send(apiResult(true,data))
                    }).catch(error=>{
                        res.send(apiResult(false,null,null,error));
                    });
                }
            }).catch(error=>{
                res.send(apiResult(false,null,null,error));
            });
        }); 
    }
}