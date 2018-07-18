/*jshint esversion: 6 */

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const teamsDatabase = require("./teams.json");
const sql = require("sqlite");
sql.open("./userdata.sqlite");

/**
 * Check Team
 *
 * @function
 *
 * Checks the team for among the teams (message, teams)
 *
 * Returns (teamId, teamName, teamMultiplier)
 *
 */
function checkTeam(messageSent, teams) {
  var teamId = null;
  var teamName;
  var teamMultiplier;
  for (var i = 0; i < teams.length; i++) {
    if (messageSent.member.roles.has(teams[i].id)) {
      teamId = teams[i].id;
      teamName = teams[i].name;
      teamMultiplier = config.team_xp_multiplier * teams[i].teamXP_buff;
    }
  }
  return {
    "teamId": teamId,
    "teamName": teamName,
    "teamMultiplier": teamMultiplier
  };
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  client.user.setActivity(`with Teslov's Patreon`);

});

client.on('message', msg => {

  if (msg.channel.type === "dm") return;

  var sender = msg.author;

  var sender_teamid, sender_teamname, team_specific_multiplier;
  var teamCheckResult = checkTeam(msg, teamsDatabase);
  sender_teamid = teamCheckResult.teamId;
  sender_teamname = teamCheckResult.teamName;
  team_specific_multiplier = teamCheckResult.teamMultiplier;

  if (msg.content.length >= 9) {
    if (sender_teamid === null) {
      // console.log("user with no team");
    } else {
      // SQLite shit
      sql.get(`SELECT * FROM teamdata WHERE teamId = "${sender_teamid}"`).then(row => {
        if (!row) { // Can't find the row.
          sql.run("INSERT INTO teamdata (teamId, points) VALUES (?, ?)", [sender_teamid, 1]);
        } else { // Can find the row.
          sql.run(`UPDATE teamdata SET points = ${row.points + team_specific_multiplier} WHERE teamId = ${sender_teamid}`);
        }
      }).catch(() => {
        console.error(e); // Gotta log those errors
        sql.run("CREATE TABLE IF NOT EXISTS teamdata (teamId TEXT, points INTEGER)").then(() => {
          sql.run("INSERT INTO teamdata (teamId, points) VALUES (?, ?)", [sender_teamid, 1]);
        });
      });

      sql.get(`SELECT * FROM userdata WHERE userId = "${sender.id}"`).then(row => {
        if (!row) { // Can't find the row.
          sql.run("INSERT INTO userdata (userId, points) VALUES (?, ?)", [sender.id, 1]);
        } else { // Can find the row.
          sql.run(`UPDATE userdata SET points = ${row.points + team_specific_multiplier} WHERE userId = ${sender.id}`);
        }
      }).catch(() => {
        console.error(e);
        sql.run("CREATE TABLE IF NOT EXISTS userdata (userId TEXT, points INTEGER)").then(() => {
          sql.run("INSERT INTO userdata (userId, points) VALUES (?, ?)", [sender.id, 1]);
        });
      });
    }
  }
  //This boi makes it so it Ignores every other bot and peasents without prefix.
  if (msg.author.bot) return;
  if (msg.content.indexOf(config.prefix) !== 0) return;
  //Commands start here
  if (sender_teamid === null) {
    msg.reply(`You don't have a team assigned to you, use ?team "Team name here" on the <#440762235313455104> chat.`);
  } else {
    if (msg.content === config.prefix + "rank") {
      var userpoints;
      sql.get(`SELECT * FROM teamdata WHERE teamId = "${sender_teamid}"`).then(row => {
        userpoints = row.points;
      });
      var teamrank = 4;

      function callback01() {
        msg.channel.send(`${sender_teamname} is rank ${teamrank}`);
      }

      var i = 1;
      teamsDatabase.forEach(function(ele) {
        var otherteam;
        if (ele.id === sender_teamid) return;
        sql.get(`SELECT * FROM teamdata WHERE teamId = "${ele.id}"`).then(row => {
          otherteam = row.points;
        }).catch(() => {
          console.error(e);
          teamrank--;
          return;
        }).then(() => {
          if (userpoints >= otherteam) {
            teamrank--;
            // console.log("teamrank " + teamrank);
          } else {
            // console.log("teamrank " + teamrank);
          }
          i++;
          if (i == Object.keys(teamsDatabase).length) {
            callback01();
          }
        });
      });
    }

    if (msg.content === config.prefix + "points") {

      var yourpoints = 1;

      sql.get(`SELECT * FROM userdata WHERE userId ="${sender.id}"`).then(row => {
        if (!row) return msg.reply("sadly you haven't contributed to your team!");
        yourpoints = row.points;
      });

      sql.get(`SELECT * FROM teamdata WHERE teamId ="${sender_teamid}"`).then(row => {
        if (!row) return msg.reply("sadly your team does not have any points yet!");
        msg.reply(`${sender_teamname} has ${row.points} points, you have contribuited ${yourpoints} points`);
      });
    }

    if (msg.content === config.prefix + "leaderboard") {

      var ranked = [];

      var team01 = {};
      var team02 = {};

      function callback02() {
        msg.channel.sendCode("css", ` = Leaderboard = \n 1. ${ranked[0].name} is leading with ${ranked[0].points} \n 2. ${ranked[1].name} with ${ranked[1].points} \n 3. ${ranked[2].name} with ${ranked[2].points} \n 4. ${ranked[3].name} with ${ranked[3].points}`);
      }

      var j = 0;
      teamsDatabase.forEach(function(ele) {
        if (j < 1) {
          j++;
          sql.get(`SELECT * FROM teamdata WHERE teamId = "${ele.id}"`).then(row => {
            team01 = {
              "teamid": ele.id,
              "name": ele.name,
              "points": row.points
            };
          }).catch(() => {
            console.error(e);
            return;
          }).then(() => {
            ranked = [team01];
          });
        } else {
          sql.get(`SELECT * FROM teamdata WHERE teamId = "${ele.id}"`).then(row => {
            team02 = {
              "teamid": ele.id,
              "name": ele.name,
              "points": row.points
            };
          }).catch(() => {
            console.errore();
            return;
          }).then(() => {
            if (ranked[0].points <= team02.points) {
              ranked.unshift(team02);
            } else if (ranked[ranked.length - 1].points >= team02.points) {
              ranked.push(team02);
            } else if (ranked[ranked.length - 1].points <= team02.points) {
              if (ranked[1].points <= team02.points) {
                ranked.splice(1, 0, team02);
              } else if (ranked[1].points >= team02.points) {
                ranked.splice(ranked.length - 1, 0, team02);
              }
            } else {
              team02 = {
                "teamid": "errorId",
                "name": "errorName",
                "points": "errorPoints"
              };
              ranked.push(team02);
            }
            if (ranked.length == Object.keys(teamsDatabase).length) {
              callback02();
            }
          });
        }
      });
    }
  }

  if (msg.content === config.prefix + 'hey') {
    msg.channel.send('Hey I am a believer of Teslov');
  }
});

client.on('guildMemberUpdate', (oldUser, newUser) => {});

client.on('messageDelete', deletmsg => {
  var sender = deletmsg.author;
  var sender_teamid, sender_teamname, team_specific_multiplier;
  var teamCheckResult = checkTeam(deletmsg, teamsDatabase);
  sender_teamid = teamCheckResult.teamId;
  sender_teamname = teamCheckResult.teamName;
  team_specific_multiplier = teamCheckResult.teamMultiplier;

  if (sender_teamid === null) {
    // console.log("user with no team");
  } else {
    // SQLite shit
    sql.get(`SELECT * FROM teamdata WHERE teamId = "${sender_teamid}"`).then(row => {
      if (!row) { // Can't find the row.
        sql.run("INSERT INTO teamdata (teamId, points) VALUES (?, ?)", [sender_teamid, 1]);
      } else { // Can find the row.
        sql.run(`UPDATE teamdata SET points = ${row.points - team_specific_multiplier} WHERE teamId = ${sender_teamid}`);
      }
    }).catch(() => {
      console.error; // Gotta log those errors
      sql.run("CREATE TABLE IF NOT EXISTS teamdata (teamId TEXT, points INTEGER)").then(() => {
        sql.run("INSERT INTO teamdata (teamId, points) VALUES (?, ?)", [sender_teamid, 1]);
      });
    });

    sql.get(`SELECT * FROM userdata WHERE userId = "${sender.id}"`).then(row => {
      if (!row) { // Can't find the row.
        sql.run("INSERT INTO userdata (userId, points) VALUES (?, ?)", [sender.id, 1]);
      } else { // Can find the row.
        sql.run(`UPDATE userdata SET points = ${row.points - team_specific_multiplier} WHERE userId = ${sender.id}`);
      }
    }).catch(() => {
      console.error;
      sql.run("CREATE TABLE IF NOT EXISTS userdata (userId TEXT, points INTEGER)").then(() => {
        sql.run("INSERT INTO userdata (userId, points) VALUES (?, ?)", [sender.id, 1]);
      });
    });
  }
});


client.on('error', e => {
  console.error(e);
});

client.login(config.token);
