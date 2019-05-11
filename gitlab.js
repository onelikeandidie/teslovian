class GitLab {
  static createMessage(data, callback) {
    console.log("Recieving Commit");
    let parsed = null;
    let kind = null;
    try {
      parsed = JSON.parse(data);
    } catch (e) {
      console.log("Error parsing JSON data");
      console.error(e);
      return;
    } finally {
      console.log("Parsed JSON data");
      let message;
      kind = parsed.object_kind;
      switch (kind) {
        case "push":
          console.log("Push Recieved");
          message = {
            author: {
              name: parsed.user_username,
              icon_url: parsed.user_avatar
            },
            title: "Pushed " + parsed.total_commits_count + " commits to **" + parsed.ref.split("/")[2] + "** branch in **" + parsed.project.name + "** repository.",
            description: "Commits:",
            fields: [],
            timestamp: new Date()
          };
          console.log("Parsing Commits");
          for (let commit of parsed.commits) {
            message.fields.push({
              name: commit.id.substr(0, 8),
              value: commit.message
            })
          }
          break;
        case "merge_request":
          console.log("Merge Request Recieved");
          message = {
            author: {
              name: parsed.user.name,
              icon_url: parsed.user.avatar_url
            },
            title: "Merge Request from **" + parsed.object_attributes.source_branch + "** to **" + parsed.object_attributes.target_branch + "**",
            description: "",
            fields: [],
            timestamp: new Date()
          };
          message.fields.push({
            name: parsed.object_attributes.title,
            value: parsed.object_attributes.description
          })
          break;
        case "message":
          console.log("Message Recieved");
          message = {
            author: {
              name: parsed.username,
            },
            title: parsed.message.title,
            description: parsed.message.text,
            fields: [],
            timestamp: new Date()
          };
          break;
        default:

      }
      console.log(message.title);
      callback({
        embed: message,
      }, kind);
    }
  }
}

module.exports = GitLab;
