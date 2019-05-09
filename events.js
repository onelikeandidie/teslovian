const fs = require('fs');

class specialEvent {
  constructor(special_event_data) {
    this.name = special_event_data.name;
    this.date = special_event_data.date;
    this.function = special_event_data.special_function;
    console.log(`Created event ${this.name} for ${this.date}`);
  }

  static executeSpecialFunctions(special_event_object, client) {
    /* Executes the right function of given event

    To add a new event add it to the end of the config.json file like so
    {
      "id":"Event Id",
      "name": "Event Name",
      "date": "Event Date",
      "special_function": "Event Designated function"
    }

    Note that "Event date" must follow normal date format for Javascript
    Wed Oct 03 2018 21:33:27 GMT+0100 (WEST)

    And then add a case for the function of that event.
    Don't forget the "break;" at the end of the case!
    */
    switch (special_event_object.function) {
      case "spookyween":
        // This function executes every day in october
        client.user.setActivity(`with your fear`);
        client.guilds.map((guild) => {
          guild.members.get(client.user.id).setNickname("Spookyslovian");
        });
        break;
      case "mybirth":
        // This function executes on Mycelium's Birthday
        client.user.setActivity(`with this Birthday Cake`);
        break;
      case "spookday":
        // This function executes on Spookyween
        client.user.setActivity(`GET READY TO BE SPOOKED`);
        client.guilds.map((guild) => {
          guild.members.get(client.user.id).setNickname("BOOOOOOOOOOOOO!!!");
        });
        break;
        case "spookday":
          // This function executes on Spookyween
          client.user.setActivity(`Happy Birthday Tawer`);
          break;
      case "simpleyear":
        // This is a test function
        break;
      default:

    }
  }
}

module.exports = specialEvent;
