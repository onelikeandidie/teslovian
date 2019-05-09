const sql = require('sqlite');

class userPoints {
  constructor(dir) {
    this.dir = dir;
    sql.open(this.dir);
    console.log("Module Launched: Database Points with " + this.dir);
  }

  static addPointsToUserMultiplied(user_id, added_points, multiplier) {
    sql.get(`SELECT * FROM userdata WHERE userId = "${user_id}"`).then(row => {
      if (!row) { // Can't find the row.
        sql.run("INSERT INTO userdata (userId, points) VALUES (?, ?)", [user_id, 1]);
      } else { // Can find the row.
        sql.run(`UPDATE userdata SET points = ${row.points + (added_points * multiplier)} WHERE userId = ${user_id}`);
      }
    }).catch(e => {
      console.error(e);
      sql.run("CREATE TABLE IF NOT EXISTS userdata (userId TEXT, points INTEGER)").then(() => {
        sql.run("INSERT INTO userdata (userId, points) VALUES (?, ?)", [user_id, 1]);
      });
    });
  }

  static useUserPoints(user_id, used_points, multiplier) {
    sql.get(`SELECT * FROM userdata WHERE userId = "${user_id}"`).then(row => {
      if (!row) { // Can't find the row.
        sql.run("INSERT INTO userdata (userId, points) VALUES (?, ?)", [user_id, 1]);
      } else { // Can find the row.
        sql.run(`UPDATE userdata SET points = ${row.points - (used_points * multiplier)} WHERE userId = ${user_id}`);
      }
    }).catch(e => {
      console.error(e);
      sql.run("CREATE TABLE IF NOT EXISTS userdata (userId TEXT, points INTEGER)").then(() => {
        sql.run("INSERT INTO userdata (userId, points) VALUES (?, ?)", [user_id, 1]);
      });
    });
  }

  static setPointsToUser(user_id, set_points) {
    sql.get(`SELECT * FROM userdata WHERE teamId = "${user_id}"`).then(row => {
      if (!row) { // Can't find the row.
        sql.run("INSERT INTO userdata (teamId, points) VALUES (?, ?)", [user_id, 1]);
      } else { // Can find the row.
        sql.run(`UPDATE userdata SET points = ${set_points} WHERE teamId = ${user_id}`);
      }
    }).catch(e => {
      console.error(e);
      sql.run("CREATE TABLE IF NOT EXISTS teamdata (teamId TEXT, points INTEGER)").then(() => {
        sql.run("INSERT INTO teamdata (teamId, points) VALUES (?, ?)", [user_id, 1]);
      });
    });
  }

  static getUserPoints(user_id, /*function*/ callback) {
    let points;
    sql.get(`SELECT * FROM userdata WHERE userId = "${user_id}"`).then(row => {
      if (!row) { // Can't find the row.
        sql.run("INSERT INTO userdata (userId, points) VALUES (?, ?)", [user_id, 0]);
        console.log("userPointsCreated");
        points = 0;
        callback(points);
      } else { // Can find the row.
        console.log("userPointsFound");
        points = row.points;
        callback(points);
      }
    }).catch(e => {
      console.error(e);
      console.log("userPointsTableCreated");
      sql.run("CREATE TABLE IF NOT EXISTS userdata (userId TEXT, points INTEGER)").then(() => {
        sql.run("INSERT INTO userdata (userId, points) VALUES (?, ?)", [user_id, 0]);
      });
      points = 0;
      callback(points);
    });
  }

  static tradeUserPoints(sender, reciever, amount, callback) {
    let result = {};
    if (amount < 0) {
      result = {
        type: "errorPointsNegative",
        code: 102,
        parsed: null
      };
      callback(result);
      return;
    }
    let callback01 = function(senderPoints) {
      if (senderPoints >= amount) {
        userPoints.addPointsToUserMultiplied(sender, -amount, 1);
        userPoints.addPointsToUserMultiplied(reciever, amount, 1);
        result = {
          type: "success",
          code: 0,
          parsed: {
            newPoints: (senderPoints - amount)
          }
        };
      } else {
        result = {
          type: "errorPointsInsufficient",
          code: 100,
          parsed: null
        };
      }
      callback(result);
    };
    userPoints.getUserPoints(reciever, function() {
      userPoints.getUserPoints(sender, callback01);
    });
  }

  static getBestUser(/*function*/ callback) {
    let result = {
      type: "error",
      code: -1,
      parsed: []
    };
    sql.all(`SELECT * FROM userdata ORDER BY points DESC LIMIT 5`).then((rows) => {
      for (var i = 0; i < rows.length; i++) {
        result.parsed.push(rows[i]);
      }
      result.type = "success";
      result.code = 0;
      callback(result);
    }).catch(e => {
      console.error(e);
      console.log("userPointsTableCreated");
      sql.run("CREATE TABLE IF NOT EXISTS userdata (userId TEXT, points INTEGER)").then(() => {
        sql.run("INSERT INTO userdata (userId, points) VALUES (?, ?)", ["462629540771135488", 0]);
      });
    });
  }
}

module.exports = userPoints;
