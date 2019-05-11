const fs = require("fs");
const jimp = require("jimp");
const sizeOf = require('image-size');
const download = require('image-downloader');

const imagedata = require('./img/data.json');

const config = require("./config.json");

class Teska {
  constructor(client) {
    client.on('message', msg => {
      // Always ignore other bots and DMs from triggering the bot
      if (msg.channel.type === "dm") return;
      if (msg.author.bot) return;
      /* Also important to make the a variable with the msg in uppercase as so to
        check for commands at the start of the message */
      let Message = msg.content.toUpperCase();
      let sender = msg.author;

      let args = Message.split(' ');
      console.log({
        arguments: args,
        size: args.length
      });

      console.log(msg.attachments.size);

      /*
      ██      ██ ██           ██████  ██████  ███    ███ ███    ███  █████  ███    ██ ██████  ███████
      ██      ██ ██          ██      ██    ██ ████  ████ ████  ████ ██   ██ ████   ██ ██   ██ ██
      ██      ██ ██          ██      ██    ██ ██ ████ ██ ██ ████ ██ ███████ ██ ██  ██ ██   ██ ███████
      ██      ██ ██          ██      ██    ██ ██  ██  ██ ██  ██  ██ ██   ██ ██  ██ ██ ██   ██      ██
      ███████ ██ ███████      ██████  ██████  ██      ██ ██      ██ ██   ██ ██   ████ ██████  ███████
      */

      if (msg.isMentioned(client.user)) {
        msg.channel.startTyping();
        let i;
        switch (args[1]) {
          // ██████  ██    ██
          // ██   ██  ██  ██
          // ██████    ████
          // ██   ██    ██
          // ██████     ██
          case "/BY":
            i = Math.floor(Math.random() * imagedata.by.length);
            jimp.read(imagedata.by[i].file)
              .then(image => {
                let colour_of_font = jimp.FONT_SANS_32_BLACK;
                switch (imagedata.by[i].colour) {
                  case "white":
                    colour_of_font = jimp.FONT_SANS_32_WHITE;
                    break;
                  case "black":
                    colour_of_font = jimp.FONT_SANS_32_BLACK;
                    break;
                  default:

                }
                jimp.loadFont(colour_of_font).then(font => {
                  image
                    .print(
                      font,
                      imagedata.by[i].x,
                      imagedata.by[i].y,
                      msg.content.slice(args[0].length + args[1].length + 2),
                      imagedata.by[i].max_width,
                      imagedata.by[i].max_height)
                    .quality(30) // set JPEG quality
                    .write(config.tempImagePath + msg.channel.id + 'temp.png');
                  msg.channel.send("", {
                    files: [config.tempImagePath + msg.channel.id + 'temp.png']
                  });
                  msg.channel.stopTyping();
                }).catch(err => {
                  console.error(err);
                });
              })
              .catch(err => {
                console.error(err);
              });
            break;
            // ██████   █████  ███    ██ ██████   ██████  ███    ███
            // ██   ██ ██   ██ ████   ██ ██   ██ ██    ██ ████  ████
            // ██████  ███████ ██ ██  ██ ██   ██ ██    ██ ██ ████ ██
            // ██   ██ ██   ██ ██  ██ ██ ██   ██ ██    ██ ██  ██  ██
            // ██   ██ ██   ██ ██   ████ ██████   ██████  ██      ██
          case "RANDOM":
            i = Math.floor(Math.random() * imagedata.random.length);
            jimp.read(imagedata.random[i].file)
              .then(image => {
                let colour_of_font = jimp.FONT_SANS_32_BLACK;
                switch (imagedata.random[i].colour) {
                  case "white":
                    colour_of_font = jimp.FONT_SANS_32_WHITE;
                    break;
                  case "black":
                    colour_of_font = jimp.FONT_SANS_32_BLACK;
                    break;
                  default:

                }
                jimp.loadFont(colour_of_font).then(font => {
                  image
                    .print(
                      font,
                      imagedata.random[i].x,
                      imagedata.random[i].y,
                      msg.content.slice(args[0].length + args[1].length + 2),
                      imagedata.random[i].max_width,
                      imagedata.random[i].max_height)
                    .quality(30) // set JPEG quality
                    .write(config.tempImagePath + msg.channel.id + 'temp.png', function() {
                      msg.channel.send("", {
                        files: [config.tempImagePath + msg.channel.id + 'temp.png']
                      });
                      msg.channel.stopTyping();
                    });
                }).catch(err => {
                  console.error(err);
                });
              })
              .catch(err => {
                console.error(err);
              });
            break;
            //  ██ ███    ███
            //  ██ ████  ████
            //  ██ ██ ████ ██
            //  ██ ██  ██  ██
            //  ██ ██      ██
          case "IM":
          case "I'M":
            i = Math.floor(Math.random() * imagedata.im.length);
            jimp.read(imagedata.im[i].file)
              .then(image => {
                let colour_of_font = jimp.FONT_SANS_32_BLACK;
                switch (imagedata.im[i].colour) {
                  case "white":
                    colour_of_font = jimp.FONT_SANS_32_WHITE;
                    break;
                  case "black":
                    colour_of_font = jimp.FONT_SANS_32_BLACK;
                    break;
                  default:

                }
                jimp.loadFont(colour_of_font).then(font => {
                  image
                    .print(
                      font,
                      imagedata.im[i].x,
                      imagedata.im[i].y,
                      msg.content.slice(args[0].length + args[1].length + 2),
                      imagedata.im[i].max_width,
                      imagedata.im[i].max_height)
                    .quality(30) // set JPEG quality
                    .write(config.tempImagePath + msg.channel.id + 'temp.png', function() {
                      msg.channel.send("", {
                        files: [config.tempImagePath + msg.channel.id + 'temp.png']
                      });
                      msg.channel.stopTyping();
                    });
                }).catch(err => {
                  console.error(err);
                });
              })
              .catch(err => {
                console.error(err);
              });
            break;
            // ███████ ██   ██ ██ ██████  ████████
            // ██      ██   ██ ██ ██   ██    ██
            // ███████ ███████ ██ ██████     ██
            //      ██ ██   ██ ██ ██   ██    ██
            // ███████ ██   ██ ██ ██   ██    ██
          case "SHIRT":
            i = Math.floor(Math.random() * imagedata.shirt.length);
            if (msg.attachments.size > 0) {
              msg.attachments.map((attachment) => {
                let text = msg.content.slice(args[0].length + args[1].length + 2);
                let textdimentions = sizeOf(imagedata.shirt[i].file);
                new jimp(textdimentions.width,
                  textdimentions.height - 160,
                  (err, textImage) => {
                    let colour_of_font = jimp.FONT_SANS_64_BLACK;
                    switch (imagedata.shirt[i].colour) {
                      case "white":
                        colour_of_font = jimp.FONT_SANS_64_WHITE;
                        break;
                      case "black":
                        colour_of_font = jimp.FONT_SANS_64_BLACK;
                        break;
                      default:

                    }

                    let attachExtension = attachment.url.split(".");
                    if (attachExtension[attachExtension.length - 1] == "png" || attachExtension[attachExtension.length - 1] == "jpg" || attachExtension[attachExtension.length - 1] == "jpeg") {
                      let options = {
                        url: attachment.url,
                        dest: config.tempImagePath + msg.channel.id + 'tempDownload.png'
                      };
                      jimp.loadFont(colour_of_font).then(font => {
                        textImage.print(
                            font,
                            imagedata.shirt[i].x,
                            imagedata.shirt[i].y + 100, {
                              text: msg.content.slice(args[0].length + args[1].length + 2),
                              alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
                              alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
                            },
                            imagedata.shirt[i].max_width,
                            imagedata.shirt[i].max_height - 100)
                          .contain(
                            textdimentions.width,
                            textdimentions.height,
                            jimp.VERTICAL_ALIGN_BOTTOM)
                          .scaleToFit(
                            516,
                            516);
                        download.image(options)
                          .then(({
                            filename,
                            image
                          }) => {
                            jimp.read(filename).then(discordImage => {
                                discordImage.autocrop().contain(160, 160);
                                jimp.read(imagedata.shirt[i].file)
                                  .then(shirt => {
                                    shirt
                                      .scaleToFit(516, 516)
                                      .composite(textImage, 0, 0)
                                      .composite(discordImage,
                                        140,
                                        80, {
                                          mode: jimp.BLEND_SOURCE_OVER
                                        })
                                      .quality(30) // set JPEG quality
                                      .write(config.tempImagePath + msg.channel.id + 'temp.png', function() {
                                        msg.channel.send("", {
                                          files: [config.tempImagePath + msg.channel.id + 'temp.png']
                                        });
                                        msg.channel.stopTyping();
                                      });
                                  })
                                  .catch(err => {
                                    console.error(err);
                                  });
                              })
                              .catch((err) => {
                                console.error(err);
                              });
                          }).catch((err) => {
                            console.error(err);
                          });

                      }).catch((err) => {
                        console.error(err);
                      });
                    }
                  });
              });
              msg.channel.stopTyping();
              return;
            }
            let text = msg.content.slice(args[0].length + args[1].length + 2);
            let textdimentions = sizeOf(imagedata.shirt[i].file);
            new jimp(textdimentions.width,
              textdimentions.height,
              (err, textImage) => {
                let colour_of_font = jimp.FONT_SANS_64_BLACK;
                switch (imagedata.shirt[i].colour) {
                  case "white":
                    colour_of_font = jimp.FONT_SANS_64_WHITE;
                    break;
                  case "black":
                    colour_of_font = jimp.FONT_SANS_64_BLACK;
                    break;
                  default:

                }
                jimp.loadFont(colour_of_font).then(font => {
                  textImage.print(
                    font,
                    imagedata.shirt[i].x,
                    imagedata.shirt[i].y, {
                      text: msg.content.slice(args[0].length + args[1].length + 2),
                      alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
                      alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
                    },
                    imagedata.shirt[i].max_width,
                    imagedata.shirt[i].max_height
                  ).scaleToFit(516, 516);
                  jimp.read(imagedata.shirt[i].file)
                    .then(image => {
                      jimp.loadFont(colour_of_font).then(font => {
                        image
                          .scaleToFit(516, 516)
                          .composite(textImage,
                            0,
                            0, {
                              mode: jimp.BLEND_SOURCE_OVER
                            })
                          .quality(30) // set JPEG quality
                          .write(config.tempImagePath + msg.channel.id + 'temp.png', function() {
                            msg.channel.send("", {
                              files: [config.tempImagePath + msg.channel.id + 'temp.png']
                            });
                            msg.channel.stopTyping();
                          });
                      }).catch(err => {
                        console.error(err);
                      });
                    })
                    .catch(err => {
                      console.error(err);
                    });
                }).catch(err => {
                  console.error(err);
                });
              });
            break;
            // ██████  ██       █████   ██████ ███████
            // ██   ██ ██      ██   ██ ██      ██
            // ██████  ██      ███████ ██      █████
            // ██      ██      ██   ██ ██      ██
            // ██      ███████ ██   ██  ██████ ███████
          case "PLACE":
            i = Math.floor(Math.random() * imagedata.place.length);
            jimp.read(imagedata.place[i].file)
              .then(image => {
                let colour_of_font = jimp.FONT_SANS_32_BLACK;
                switch (imagedata.place[i].colour) {
                  case "white":
                    colour_of_font = jimp.FONT_SANS_32_WHITE;
                    break;
                  case "black":
                    colour_of_font = jimp.FONT_SANS_32_BLACK;
                    break;
                  default:

                }
                jimp.loadFont(colour_of_font).then(font => {
                  image
                    .print(
                      font,
                      imagedata.place[i].x,
                      imagedata.place[i].y,
                      msg.content.slice(args[0].length + args[1].length + 2),
                      imagedata.place[i].max_width,
                      imagedata.place[i].max_height)
                    .quality(30) // set JPEG quality
                    .write(config.tempImagePath + msg.channel.id + 'temp.png', function() {
                      msg.channel.send("", {
                        files: [config.tempImagePath + msg.channel.id + 'temp.png']
                      });
                      msg.channel.stopTyping();
                    });
                }).catch(err => {
                  console.error(err);
                });
              })
              .catch(err => {
                console.error(err);
              });
            break;
        }
      }
    });
  }
}

module.exports = Teska