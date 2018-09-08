var express = require('express');
var router = express.Router();
var axios = require('axios').default;
var mysql = require('mysql');
var config = require('../config.json')

function conectar(callback) {
  var con = mysql.createConnection(config);

  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    callback(con);
  });
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  const gender = req.query.gender;
  if (!['male', 'female'].includes(gender)) {
    res.statusCode = 401;
    res.json({ success: 'Genero no valido!' });
    return;
  }
  conectar((con) => {
    const sql = `SELECT * FROM users WHERE gender = '${gender}';`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      con.end();
      res.json({
        "status": "ok",
        "content": result
      })
    });
  });
});

router.post('/', function (req, res, next) {
  const gender = req.body.gender;
  if (!['male', 'female'].includes(gender)) {
    res.statusCode = 401;
    res.json({ success: 'Genero no valido!' });
    return;
  }
  const url = 'https://randomuser.me/api?gender=' + gender;
  axios(url)
    .then(({ data: { results: data } }) => {
      const user = {
        gender: data[0].gender,
        firstname: data[0].name.first,
        lastname: data[0].name.last,
        email: data[0].email,
        picture: data[0].picture.large,
      }
      conectar((con) => {
        const fields = Object.keys(user).join(', ');
        const values = Object.keys(user).map((v) => {
          return `'${JSON.stringify(user[v]).replace(/(\"$|^\")/g, '')}'`
        }).join(', ');
        const sql = `INSERT INTO users (${fields}) VALUES (${values});`;
        con.query(sql, function (err, result) {
          if (err) throw err;
          con.end();
        });
      });
    });
  res.send('respond with a resource');
});

module.exports = router;
