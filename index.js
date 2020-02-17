const args = process.argv.slice(2);    
let lang;

if (args === undefined || args.length == 0) {
  lang = "en";
} else {
  lang = args[0];
}
const fs = require('fs');
let obj = require(getFileNameByLang(lang, ['./questions','json']));

const categoryMap = {};
for (const item of obj) {
  if (categoryMap[item.category]) {
    categoryMap[item.category].push(item);
  }
  else {
    categoryMap[item.category] = [item];
  }
}

let content = [];
let headers = {
  "en": ['# 1 on 1 Questions\nUltimate list compiled from a variety to sources'],
  "ja": ['# 1 on 1 Questions\nUltimate list compiled from a variety to sources']
}
content.push(headers[lang]);
for (const [key, items] of Object.entries(categoryMap)) {
  content.push(`\n\n## ${key}`)

  const sorted = items.sort(function(a, b) {
    var qA = a.question.toUpperCase(); // ignore upper and lowercase
    var qB = b.question.toUpperCase(); // ignore upper and lowercase
    if (qA < qB) {
      return -1;
    }
    if (qA > qB) {
      return 1;
    }

    return 0;
  });

  for (const item of sorted) {
    content.push(
      `* ${item.question}`
    )
  }
}

// create contributing instructions
let contributingInstructions = {
  "en": ['\n\n## Contributing \n' +
  '1. Fork it\n' +
  '2. Add your resource to `README.md` and `questions.json`\n' + 
  '3. Create new Pull Request\n'],
  "ja": ['\n\n## Contributing \n' +
  '1. フォークします\n' +
  '2. 1on1の質問を`README.md` と `questions.json` に追加します\n' + 
  '3. 新しいプルリクエストを作成します\n']
}

content.push(contributingInstructions[lang]);

// create README file
let readMe = getFileNameByLang(lang, ['README','md']);
fs.writeFile('./' + readMe, content.join('\n'), function (err) {
  if (err) throw err;
  console.log('Updated ' + readMe);
});

function getFileNameByLang(lang, fileNameParts) {
  if(lang == "en") {
    return fileNameParts.join('.');
  } 
  fileNameParts.splice(1, 0, lang);
  return fileNameParts.join('.');
}
