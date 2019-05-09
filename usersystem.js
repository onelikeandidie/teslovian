const sql = require('sqlite');

function isValidJSON(text) {
  let completed = null;
  try {
    completed = JSON.parse(text);
    return {
      "data": completed,
      "shouldContinue": true
    };
  } catch (e) {
    return {
      "data": completed,
      "shouldContinue": false
    };
  }
}

function generateKey() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

class userInformation {
  static checkKey(username, key, callback) {
    let result = {};
    sql.get(`SELECT * FROM loginData WHERE username = "${username}"`).then(row => {
      if (!row) { // Can't find the row.
        result = {
          type: "errorUserNotLogged",
          code: 50,
          parsed: null
        };
        callback(result);
      } else { // Can find the row.
        if (row.key === key) {
          result = {
            type: "success",
            code: 0,
            parsed: null
          };
          callback(result);
        } else {
          result = {
            type: "errorKeyWrong",
            code: 51,
            parsed: null
          };
          callback(result);
        }
      }
    }).catch(e => {
      console.error(e);
      result = {
        type: "errorTableInexistent",
        code: 10,
        parsed: null,
      };
      sql.run("CREATE TABLE IF NOT EXISTS loginData (username TEXT, key TEXT)").then(() => {
        sql.run("INSERT INTO loginData (username, key) VALUES (?, ?)", ["none", "nonenoneno"]);
      });
    });
  }
}

class userRegistration {
  constructor() {

  }
}

class userLogin {
  constructor(data) {
    this.username = data.username;
    this.badencryptionkey = generateKey();
    let result = {};
    sql.get(`SELECT * FROM loginData WHERE username = "${this.username}"`).then(row => {
      if (!row) { // Can't find the row.
        sql.run("INSERT INTO loginData (username, key) VALUES (?, ?)", [this.username, this.badencryptionkey]);
        result = {
          type: "success",
          code: 0,
          parsed: this
        };
      } else { // Can find the row.
        sql.run(`UPDATE loginData SET key = (?) WHERE username = (?)`, [this.badencryptionkey, this.username]);
        result = {
          type: "success",
          code: 0,
          parsed: this
        };
      }
    }).catch(e => {
      console.error(e);
      result = {
        type: "errorTableInexistent",
        code: 10,
        parsed: null,
      };
      sql.run("CREATE TABLE IF NOT EXISTS loginData (username TEXT, key TEXT)").then(() => {
        sql.run("INSERT INTO loginData (username, key) VALUES (?, ?)", ["none", "nonenoneno"]);
      });
    });
  }

  static DESTROY(object) {
    let result = {};
    sql.run(`DELETE FROM loginData WHERE username = ${object.username}`).catch(e => {
      console.error(e);
      result = {
        type: "errorUserNotDestroyed",
        code: 20,
        parsed: null,
      };
      sql.run("CREATE TABLE IF NOT EXISTS loginData (username TEXT, key TEXT)").then(() => {
        sql.run("INSERT INTO loginData (username, key) VALUES (?, ?)", ["none", "nonenoneno"]);
      });
    });
    return result;
  }
}

class loginService {

  static checkDetails(data, callback) {
    let parsed = isValidJSON(data);
    let result = {
      nothing: "happened"
    };
    if (parsed.shouldContinue) {
      sql.get(`SELECT * FROM userLoginData WHERE username = "${parsed.data.username}"`).then(row => {
        if (!row) { // Can't find the row.
          result = {
            type: "errorUserNotFound",
            code: 1,
            parsed: parsed.data
          };
          callback(result);
        } else { // Can find the row.
          result = {
            type: "successUserFound",
            code: -1,
            parsed: parsed.data
          };
          if (row.password === parsed.data.password) {
            parsed.data.discordId = row.discordId;
            result = {
              type: "success",
              code: 0,
              parsed: parsed.data
            };
            callback(result);
          } else {
            result = {
              type: "errorPasswordIncorrect",
              code: 2,
              parsed: parsed.data
            };
            callback(result);
          }
        }
      }).catch(e => {
        console.error(e);
        result = {
          type: "errorTableInexistent",
          code: 10,
          parsed: parsed.data
        };
        sql.run("CREATE TABLE IF NOT EXISTS userLoginData (username TEXT, password TEXT, discordId TEXT)").then(() => {
          sql.run("INSERT INTO userLoginData (username, password, discordId) VALUES (?, ?, ?)", ["none", "none", "none"]);
        });
        callback(result);
      });
    } else {
      console.log("error parsing login data");
      result = {
        type: "errorJSONIncomplete",
        code: 11,
        parsed: parsed.data
      };
      callback(result);
    }
    // callback(result);
  }

}

module.exports = {
  userLogin,
  loginService,
  userInformation
};
