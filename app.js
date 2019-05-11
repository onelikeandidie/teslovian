// Discord.js
const Discord = require('discord.js');
const client = new Discord.Client();
// http server for Post requests and others
const http = require("http");
// gitLab that Teslov made for me owo
const gitLab = require("./gitlab.js");
// Teska so cute
const teska = require("./teska/teska.js");
// startup the cutest thing ever
const cutie = new teska(client);
// fs to write logs
const fs = require('fs');
// node-schedule for executing functions on specific dates and times
const schedule = require('node-schedule');
// startDate is for calculating uptime of the bot
const startDate = new Date();
// just how many milliseconds per day are
const msPerDay = 24 * 60 * 60 * 1000;
/* config file for multiple bot tokens and different channels for webhooks, also
  for events that change how the bot works
*/
const config = require("./config.json");
/* messages config file allows different answers from the default ones, this
  file is needed for the bot to start
*/
const messagesConfig = require("./messages/messages.json");
// specialEvents execute functions on a certain date like spookyween
const specialEvent = require("./events.js");
/* userPoints simplifies the point system API so it's easier to access and adds
  getting, setting and adding points to user ids
*/
const userPoints = require('./pointsystem.js');
/* "new userPoints" uses the directory to open a sqlite file for storing points
  in a database so other classes can access them and other programs
*/
const userPointsDatabase = new userPoints('./data/userdata.sqlite');

var envConfig;
// Try to import the config environment variables from envConfig.json
try {
  var envConfig = require('./envConfig.json');
} catch (e) {
  // Try to import the config environment variables
  var envConfig = {
    "token": process.env.BOT_TOKEN || "TOKEN_HERE",
    "gitLabPushChannel": process.env.GITLABPUSHCHANNEL || "PUSH_CHANNEL_HERE",
    "gitLabMergeChannel": process.env.GITLABMERGECHANNEL || "MERGER_CHANNEL_HERE",
    "port": process.env.PORT || "PORT_HERE"
  };
  console.error("no envConfig.json found!");
}

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

var todays_events = [];

function checkEventsForToday() {
  todays_events = [];
  let now = new Date();
  for (let i = 0; i < config.events.length; i++) {
    if (now.toString().includes(config.events[i].date)) {
      todays_events.push(config.events[i]);
    }
  }
  if (todays_events != []) {
    for (let i = 0; i < todays_events.length; i++) {
      let this_event = new specialEvent(todays_events[i]);
      specialEvent.executeSpecialFunctions(this_event, client);
    }
    console.log("There is(are) " + todays_events.length + " ongoing event(s) today");
  }
}

/* The variable j contains a simple function using node-schedule to check
  for events every midnight so the bot never misses a thing.
*/
var checkEventSchedule = schedule.scheduleJob('0 0 * * *', function() {
  checkEventsForToday();
});

client.on('ready', () => {
  console.log(`    Time started: ${startDate}`);
  console.log(`Logged in as ${client.user.tag}!`);

  client.user.setActivity(`with Teslov's Conscience`);
  // Should allways check for ongoing events when the bot starts
  checkEventsForToday();
});

client.on('message', msg => {
  // Always ignore other bots and DMs from triggering the bot
  if (msg.channel.type === "dm") return;
  if (msg.author.bot) return;
  /* Also important to make the a variable with the msg in uppercase as so to
    check for commands at the start of the message
  */
  let Message = msg.content.toUpperCase();
  let sender = msg.author;

  let multiplier = Math.round(Message.length / 10);
  if (Message.length >= 8 && Message.length < 16) {
    userPoints.addPointsToUserMultiplied(sender.id, 1, multiplier);
  } else if (Message.length >= 16 && Message.length < 32) {
    userPoints.addPointsToUserMultiplied(sender.id, 1, multiplier);
  } else if (Message.length >= 32) {
    userPoints.addPointsToUserMultiplied(sender.id, 1, multiplier);
  }

  if (Message.includes("TEAM") && msg.isMentioned(client.user.id)) {
    let finalAnswer = "";
    let lll = 0;
    let teammessage = Message;
    while (teammessage.includes("TEAM")) {
      teammessage = teammessage.replace("TEAM", "");
      lll++;
    }
    for (var i = 0; i < lll; i++) {
      finalAnswer += "https://i.imgur.com/ufWSW8y.png";
    }
    finalAnswer += " this is team";
    msg.reply(finalAnswer);
  }

  if (Message.includes("HEY") && msg.isMentioned(client.user.id)) {
    // this variable is the final response of this command
    let finalAnswer = null;
    /* If the Sender is Teslov the bot should say it believes him instead of a
      classic phrase
    */
    switch (sender.id) {
      case "180407296705167360":
        finalAnswer = 'I hope you can forgive my Existence father.';
        break;
      case "180407675681505281":
        finalAnswer = "I know you don't want me";
        break;
      case "313399015691649024":
        finalAnswer = "Fuck you, you shouldn't have created me"
        break;
      default:
        /* Special Events change the classic response of the bot with a switch

        This uses the todays_events variable and the id of the event in config
        {
          "id":"Event Id",
          "name": "Event Name",
          "date": "Event Date",
          "special_function": "Event Designated function"
        }
        */
        switch (todays_events[0].id) {
          case "halloween":
            finalAnswer = "BOOOOOOOOOOOOO!!! Did I spook you human?";
            break;
          case "october":
            finalAnswer = "Get ready for a spooky month human!";
            break;
          case "myceliumbirthday":
            finalAnswer = "Happy Birthday Mycelium! 🎉 🎂 🎉";
            break;
          case "test":
            finalAnswer = "Meh";
            break;
          default:
            finalAnswer = "Hey, I'm a believer of teslov!";
        }
    }
    // Stop typing
    msg.channel.stopTyping();
    // Send the final message to the chat after all the processing is done
    msg.channel.send(finalAnswer);
  }

  if (Message.startsWith(config.prefix)) {
    let args = Message.slice(3).split(' ');
    console.log({
      arguments: args,
      size: args.length
    });
    if (args.length >= 1) {
      if (args[0] == "KARMA" || args[0] == "K") {
        let finalMessage = "";
        if (args.length >= 2) {
          switch (args[1]) {
            case "TRADE":
            case "TRADING":
            case "T":
              console.log("trade service");
              if (args.length == 4) {
                console.log("exchange started");
                let callback01 = function(result) {
                  if (result.code == 0) {
                    msg.reply("Trade Successful");
                  } else {
                    switch (result.code) {
                      case 100:
                        msg.reply("you don't have enough points to trade with <@" + msg.mentions.users.first().id + ">");
                        break;
                      case 102:
                        msg.reply("you can't trade negative currency, don't try and steal points like that human");
                        break;
                      default:
                        msg.reply("Trade unsuccessful");
                    }
                  }
                };
                if (msg.mentions.users.first().bot) {
                  msg.channel.send("Unfortunately, bots don't have karma. They only have good bot points");
                  return;
                }
                if (msg.mentions.users.first().id == sender.id) {
                  msg.channel.send("Trading with yourself is impossible, but you can pat yourself on the back");
                  return;
                }
                try {
                  userPoints.tradeUserPoints(sender.id, msg.mentions.users.first().id, args[3], callback01);
                } catch (e) {
                  msg.reply("I wasn't able to find the user mentioned, be sure to use the correct arguments ``!t karma trade @mention amount``");
                }
              }
              break;
            case "CHECK":
            case "CHECKING":
            case "C":
              console.log("checking service");
              let callback01 = function(points) {
                msg.reply("" + msg.mentions.users.first().username + " has " + points + " karma");
              };
              if (args.length == 3) {
                if (msg.mentions.users.first().bot) {
                  msg.channel.send("Unfortunately, bots don't have karma. They only have good bot points");
                  return;
                }
                if (msg.mentions.users.first().id == sender.id) {
                  msg.channel.send("Trading with yourself is impossible, but you can pat yourself on the back");
                  return;
                }
                try {
                  userPoints.getUserPoints(msg.mentions.users.first().id, callback01);
                } catch (e) {
                  msg.reply("I wasn't able to find the user mentioned, be sure to use the correct arguments ``!t karma check @mention``");
                }
              }
              break;
            case "LEADERBOARD":
            case "LB":
            case "GOD":
            case "BOARD":
              let messageFinal;
              userPoints.getBestUser(function(result) {
                let members = "";
                for (let member of result.parsed) {
                  let tag = client.users.get(member.userId).tag;
                  members += "\n**" + tag + "** with **" + member.points + "** karma";
                }
                messageFinal = "\n___**LEADERBOARD**___" + members + "";
                msg.channel.send(messageFinal);
              });
              break;
          }
        }

        if (args.length == 1) {
          let callback01 = function(points) {
            msg.reply("you have " + points + " useable karma");
          };
          userPoints.getUserPoints(sender.id, callback01);
        }
      }
    }

    if (Message.startsWith(config.prefix + "DATA")) {
      switch (Message) {
        case config.prefix + "DATA" + " " + "UPTIME":
          let timePassed = (new Date()) - startDate;
          timePassed = Math.ceil(timePassed / msPerDay * 100) / 100;
          msg.reply(timePassed + " days of uptime!");
          break;
        case config.prefix + "DATA" + " " + "VERSION":
          break;
        default:
          msg.reply("Use !T help to know what commands you can use");
      }
    }

    if (Message.startsWith(config.prefix + "HELP") || Message.startsWith(config.prefix + "H") || Message.startsWith(config.prefix + "?")) {
      let embedMessage;
      let callback01 = function(m) {
        console.log(m);
        sender.send(m);
        msg.reply("check your dms");
      };
      embedMessage = {
        author: {
          name: client.username,
          icon_url: client.displayAvatarURL
        },
        title: "HELP LIST",
        fields: [],
        timestamp: new Date()
      };
      for (let command of messagesConfig.help) {
        let alias = "";
        if (command.alias.length > 0) {
          alias = "\nAliases:";
          for (let a of command.alias) {
            alias = alias + " \"" + a.command + "\"";
          }
        }
        let uses = "";
        if (command.extensions.length > 0) {
          uses = "\nUses:";
          for (let a of command.extensions) {
            uses = uses + "\n**-" + a.title + "-**\n" + a.description + "\n" + "Initiator command: \"" + a.initiator + "\"";
            if (a.alias.length > 0) {
              uses = uses + "\nAliases:";
              for (let b of a.alias) {
                uses = uses + " \"" + b.command + "\"";
              }
            }
          }
        }
        embedMessage.fields.push({
          name: "**___ " + command.title + " ___**",
          value: command.description + "\n" + "Initiator command: \"" + command.initiator + "\"" + alias + uses
        });
      }
      let helpMessage = {
        embed: embedMessage
      };
      callback01(helpMessage);
    }
  }
});

client.on('error', e => {
  fs.writeFile("./logs/error.log", JSON.stringify(e), function(err) {
    if (err) throw err;
    console.log("Error was logged in ./logs");
  });
});

client.login(envConfig.token);

const server = http.createServer((req, res) => {
  let body = "";
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    console.log("Downloading info on port:" + process.env.PORT || "Downloading info on port:" + 3000);
    gitLab.createMessage(body, (msg, kind) => {
      try {
        console.log(kind);
        switch (kind) {
          case "push":
            client.channels.get(envConfig.gitLabPushChannel).send(msg);

            break;
          case "merge_request":
            client.channels.get(envConfig.gitLabMergeChannel).send(msg);

            break;
          default:

        }

      } catch (e) {
        console.log("Error processing object kind");
        console.error(e);
      } finally {
        console.log("Sent Message to Discord \n");

      }
      // client.channels.get("484656210751258645").send(msg);
    });
    res.end("Got it.");
  });
});

server.listen(envConfig.port || 3000);