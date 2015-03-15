var fs = require("fs")
var diary = require("diary")
var argv = require("minimist")(process.argv.slice(2))

function diary_template() {
  var weeks = [];
  for (var i = 0; i < 39; i++) {
    weeks.push({
      type: "A",
      quotes: [
        {
          "text": "---",
          "author": "_"
        },
        {
          "text": "---",
          "author": "_"
        }

      ],
      "days": [
        {
          "name": "Monday 25 August",
          "info": null
        },
        {
          "name": "Tuesday 26 August",
          "info": null
        },
        {
          "name": "Wednesday 27 August",
          "info": null
        },
        {
          "name": "Thursday 28 August",
          "info": null
        },
        {
          "name": "Friday 29 August",
          "info": null
        }
      ]
    });
  }

  return weeks
}


if (argv._[0] === "init") {
  console.log("setting up diary.")

  fs.writeFileSync("weeks.json", JSON.stringify(diary_template(), null, 2))

  try {
    fs.mkdirSync("css")
    fs.mkdirSync("templates")
  }
  catch (err) {
    console.log(err)
    process.exit(1)
  }

  fs.readdirSync(__dirname + "/css").forEach(function(file) {
    fs.writeFileSync("css/" + file, fs.readFileSync(__dirname + "/css/" + file))
  })

  fs.readdirSync(__dirname + "/templates").forEach(function(file) {
    fs.writeFileSync("templates/" + file, fs.readFileSync(__dirname + "/templates/" + file))
  })  

}
else if (argv._[0] === "build") {
  console.log("building diary...")

  var weeks = JSON.parse(fs.readFileSync("./weeks.json").toString())

  var templates = {
     "days": fs.readFileSync("./templates/days.hbs").toString(),
     "notes": fs.readFileSync("./templates/notes.hbs").toString()
  }

  var css = {
      "days": fs.readFileSync("./css/days.css").toString(),
      "notes": fs.readFileSync("./css/notes.css").toString()
  }

  diary.generate({
    weeks: weeks,
    templates: templates,
    css: css
  }, function(err, result) {
    if (err) {
      console.log("error", err)
      process.exit(1)
    }

    fs.createReadStream(result).pipe(fs.createWriteStream("./diary.pdf"))
  })
}
else {
  console.log("usage:\tdiary {init|build}")
}
