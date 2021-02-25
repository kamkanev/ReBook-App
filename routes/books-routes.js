const router = require("express").Router();
const User = require("../models/user");
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const rimraf = require("rimraf");

router.get("/ebooks", (req, res) => {
    if(req.user){

      var books = []

      const directoryPathNBooks = './users/'+req.user.id+'/nbook'
      const directoryPathVBooks = './users/'+req.user.id+'/vbook'

      var files1 = fs.readdirSync(directoryPathNBooks);
      var files2 = fs.readdirSync(directoryPathVBooks);

      for(var i =0; i < files1.length; i++){
        var file = files1[i];
        var fileDir = directoryPathNBooks + '/' + file + "/info.txt";
        var filesInNbook = fs.readdirSync(directoryPathNBooks + '/' + file);
        var data = fs.readFileSync(fileDir,
                                    {encoding:'utf8', flag:'r'}).split('\n');

        books.push({
          title: data[0],
          type: data[1],
          icon: data[2],
          len: (filesInNbook.length-1),
          opened: JSON.parse(data[3].toLowerCase()),
          openPage: parseInt(data[4]),
          fullLink: ( directoryPathNBooks + '/' + file),
          backgrounds: data[5]
        });

      }

      for(var i =0; i < files2.length; i++){
        var file = files2[i];
        var fileDir = directoryPathVBooks + '/' + file + "/info.txt";
        var filebookDir = directoryPathVBooks + '/' + file + "/data.json";
        var filesInVbook = fs.readdirSync(directoryPathVBooks + '/' + file);
        var data = fs.readFileSync(fileDir,{encoding:'utf8', flag:'r'}).split('\n');

        var bookData = fs.readFileSync(filebookDir,{encoding:'utf8', flag:'r'});

        console.log("bookData: "+bookData);

                                    books.push({
                                      title: data[0],
                                      type: data[1],
                                      icon: data[2],
                                      len: (bookData.length <= 0)? 0 : (filesInVbook.length-1),
                                      opened: JSON.parse(data[3].toLowerCase()),
                                      openPage: parseInt(data[4]),
                                      fullLink: ( directoryPathVBooks + '/' + file),
                                      data: bookData
                                    });

      }

      console.log(books);

        res.render("ebooks", {
            user: req.user,
            books: books
        });

    }else{
        res.redirect('/');
    }
});

router.post("/createNewWord", (req, res) => {
  if(req.user){

    const directoryPath = './users/'+req.user.id+'/'+req.body.bookType + '/' + req.body.bookTitle;

    var readDir1 = fs.readdirSync(directoryPath);

    var word = {
      name: req.body.word,
      multiple: req.body.Mword,
      translate: req.body.trWord,
      transcr: req.body.transcr,
      type: "" + req.body.wType
    }

    if(readDir1.length - 1 <= 0){
      console.log("create FIle");

      //console.log(req.body.wType);

      var words = [];
      words.push(word);

      let data = JSON.stringify(words);

      fs.writeFileSync(directoryPath+"/data.json", data);

    }else{

      var fileData = fs.readFileSync(directoryPath+"/data.json",{encoding:'utf8', flag:'r'});

      var words = (fileData.length<=0) ? [] : JSON.parse(fileData);

      //console.log(word);

      if(words.findIndex(x => x.name === word.name) < 0){

        words.push(word);

      }

      console.log(words);

      console.log("updateFIle");

      let data = JSON.stringify(words);

      fs.writeFileSync(directoryPath+"/data.json", data);
    }

    res.redirect('/profile/ebooks');
  }
});

router.post('/editWord', (req, res) => {

  if(req.user){

    console.log("edit words ---------", req.body);

    const directoryPath = './users/'+req.user.id+'/'+req.body.bookTypeE + '/' + req.body.bookTitleE;

    var word = {
      name: req.body.wordE,
      multiple: req.body.MwordE,
      translate: req.body.trWordE,
      transcr: req.body.transcrE,
      type: "" + req.body.wTypeE
    }

    var ind = parseInt(req.body.indexEWord)

    var fileData = fs.readFileSync(directoryPath+"/data.json",{encoding:'utf8', flag:'r'});

    var words = JSON.parse(fileData);

    //console.log(word);

    words[ind] = word;

    console.log(words);

    console.log("updateEditFIle");

    let data = JSON.stringify(words);

    fs.writeFileSync(directoryPath+"/data.json", data);

  }

  res.redirect('/profile/ebooks');

});

router.post('/deleteWord', (req, res) => {

  if(req.user){

    const directoryPath = './users/'+req.user.id+'/'+req.body.bookTypeD + '/' + req.body.bookTitleD;

    var fileData = fs.readFileSync(directoryPath+"/data.json",{encoding:'utf8', flag:'r'});

    var words = JSON.parse(fileData);

    var indecies = [];

    if(req.body.indexDWord instanceof Array){

      for(var i = 0; i < req.body.indexDWord.length; i++){

        var index = parseInt(req.body.indexDWord[i]);

        indecies.push(index);

      }

      for (var j = 0; j < indecies.length-1; j++) {

        words.splice(indecies[j], 1);

        for (var i = j+1; i < indecies.length; i++) {
          indecies[i]--;
        }

      }

      words.splice(indecies[indecies.length-1], 1);

    }else{

      var ind = parseInt(req.body.indexDWord)
      //console.log(word);

      words.splice(ind, 1);

      // console.log(words);

      console.log("updateDeleteFIle");

    }

    let data = JSON.stringify(words);

    fs.writeFileSync(directoryPath+"/data.json", data);

  }

  res.redirect('/profile/ebooks');

});

router.post("/createBook", (req, res) => {
  if(req.user){

    var data = req.body;

    var length = 0;

    const directoryPathNBooks = './users/'+req.user.id+'/nbook';
    const directoryPathVBooks = './users/'+req.user.id+'/vbook';
    //joining path of directory
    const directoryPath = './users/'+req.user.id+'/'+req.body.type;

        //console.log(length);
        var dir = directoryPath + "/" + req.body.title;
        var infoPath = dir + "/" + "info.txt";
        var seitePath = dir + "/" + "seite0.html";
        var dataPath = dir + "/" + "data.json";

        let info = req.body.title+"\n"+req.body.type+"\n"+"../img/books/covers/"+req.body.icon+"\n"+req.body.opened+"\n"+0+'\n'+0;

        if(!fs.existsSync(directoryPathNBooks + "/" + req.body.title)){
          if(!fs.existsSync(directoryPathVBooks + "/" + req.body.title)){
            fs.mkdirSync(dir);
            fs.writeFileSync(infoPath, info);
            if(req.body.type == 'nbook'){
              fs.writeFileSync(seitePath, "");
            }else{
              fs.writeFileSync(dataPath, "");
            }
          }
        }


    res.redirect('/profile/ebooks');

  }

});

router.post("/deleteBooks", (req, res) => {
  if(req.user){

    var data = req.body;

    // console.log("delete data - ");

    const directoryPath = './users/'+req.user.id+'/';

    if(data.titles instanceof Array){
      for(var i = 0; i < data.titles.length; i++){

        var books = data.titles[i];

        console.log(books);

        var tit = books.split("|")[0];
        var typ = books.split("|")[1];

        console.log(tit, typ);

        console.log(directoryPath+typ+"/"+tit);
        rimraf.sync(directoryPath+typ+"/"+tit);
      }
    }else{

      var books = data.titles;

      console.log(books);

      var tit = books.split("|")[0];
      var typ = books.split("|")[1];

      console.log(tit, typ);

      console.log(directoryPath+typ+"/"+tit);
      rimraf.sync(directoryPath+typ+"/"+tit);

    }
        console.log("data delete - ", data);

  }

  res.redirect('/profile/ebooks');
});

router.post("/editBooks", (req, res) => {
  if(req.user){

    var data = req.body;

    // console.log("delete data - ");

    const directoryPath = './users/'+req.user.id+'/';

      var books = data.titles;
      var newbooks = data.newtitles;

      console.log(books);

      var tit = books.split("|")[0];
      var typ = books.split("|")[1];
      var icon = books.split("|")[2];

      var newtit = newbooks.split("|")[0];
      var newtyp = newbooks.split("|")[1];
      var newicon = newbooks.split("|")[2];

      console.log(tit, typ, icon);

      console.log(directoryPath+typ+"/"+tit);
      fs.renameSync(directoryPath+typ+"/"+tit, directoryPath+typ+"/"+newtit);

      const directoryPath2 = directoryPath+typ;

      var fileDir = directoryPath2 +"/"+newtit+"/info.txt";

      var fileData = fs.readFileSync(fileDir,
                                  {encoding:'utf8', flag:'r'}).split('\n');

      var fullIconLink = "../img/books/covers/"+newicon;

      var newInfo = newtit+"\n"+fileData[1]+"\n"+fullIconLink+"\n"+fileData[3]+"\n"+fileData[4]+"\n"+fileData[5];

      fs.writeFileSync(fileDir, newInfo);

  }

  res.redirect('/profile/ebooks');
});

router.post("/savePage", (req, res) => {

  if(req.user){

    // var data = req.body;

    const directoryPath = './users/'+req.user.id+'/'+req.body.type;

    var fileDir = directoryPath +"/"+req.body.title+"/info.txt";
    var filePage = directoryPath +"/"+req.body.title+"/seite"+req.body.page+".html";

    var fileData = fs.readFileSync(fileDir,
                                {encoding:'utf8', flag:'r'}).split('\n');

    var bags = fileData[5].split(" ");
    bags[parseInt(fileData[4])] = req.body.backgr;

    var str = "";
    for(var i = 0; i < bags.length; i++){
      str+= bags[i];
      if(i < bags.length - 1){
        str+= " ";
      }
    }

    fileData[5] = str;

    fs.writeFileSync(filePage, req.body.text);
    fs.writeFileSync(fileDir, fileData[0]+"\n"+fileData[1]+"\n"+fileData[2]+"\n"+fileData[3]+"\n"+fileData[4]+"\n"+fileData[5]);

  }

  res.redirect('/profile/ebooks');

});

router.post("/createPage", (req, res) => {

  if(req.user){

    // var data = req.body;

    const directoryPath = './users/'+req.user.id+'/'+req.body.type;

    var nextPageNum = (parseInt(req.body.page)+1);

    var fileDir = directoryPath +"/"+req.body.title+"/info.txt";

    var data = fs.readFileSync(fileDir,{encoding:'utf8', flag:'r'}).split('\n');


        var bags = data[5].split(" ");
        bags[parseInt(data[4])] = req.body.backgr;

        var str = "";
        for(var i = 0; i < bags.length; i++){
          str+= bags[i];
            str+= " ";
        }

        str+="0";

        data[5] = str;

        data[4] = parseInt(data[4])+1;

    var filePage = directoryPath +"/"+req.body.title+"/seite"+req.body.page+".html";
    var fileNextPage = directoryPath +"/"+req.body.title+"/seite"+nextPageNum+".html";

    // var fileData = fs.readFileSync(fileDir,
    //                             {encoding:'utf8', flag:'r'}).split('\n');
    //
    // var newInfo = fileData[0]+"\n"+fileData[1]+"\n"+fileData[2]+"\n"+req.body.opened+"\n"+(req.body.page);

    fs.writeFileSync(filePage, req.body.text);
    fs.writeFileSync(fileNextPage, "");
    fs.writeFileSync(fileDir, data[0]+"\n"+data[1]+"\n"+data[2]+"\n"+data[3]+"\n"+data[4]+"\n"+data[5]);

  }

  res.redirect('/profile/ebooks');

});

router.post("/goToPage", (req, res) => {

  if(req.user){

    const directoryPath = './users/'+req.user.id+'/'+req.body.type;

    var number = parseInt(req.body.where);

    var len = fs.readdirSync(directoryPath +"/"+req.body.title+"/").length - 1;

    var fileDir = directoryPath +"/"+req.body.title+"/info.txt";

    var data = fs.readFileSync(fileDir,
                                {encoding:'utf8', flag:'r'}).split('\n');

        data[4] = parseInt(data[4])+number;

        if(data[4] >= len){
          data[4] = len-1;
        }else if(data[4] <= 0){
          data[4] = 0;
        }

      fs.writeFileSync(fileDir, data[0]+"\n"+data[1]+"\n"+data[2]+"\n"+data[3]+"\n"+data[4]+"\n"+data[5]);
  }

  res.redirect('/profile/ebooks');

});

router.post('/deletePage', (req, res) =>{

  if(req.user){

    console.log("Delete page: ", req.body);

      const dir = './users/'+req.user.id+'/'+req.body.type+"/"+req.body.title+"";

      deletePageByNumber(req.body.page, dir);

  }

  res.redirect('/profile/ebooks');

});

router.post('/openBook', (req, res) =>{

if(req.user){

  var data = req.body;

  const directoryPath = './users/'+req.user.id+'/'+req.body.type;

  var fileDir = directoryPath +"/"+req.body.title+"/info.txt";

  var fileData = fs.readFileSync(fileDir,
                              {encoding:'utf8', flag:'r'}).split('\n');

  var newInfo = fileData[0]+"\n"+fileData[1]+"\n"+fileData[2]+"\n"+req.body.opened+"\n"+req.body.page+"\n"+fileData[5];

  fs.writeFileSync(fileDir, newInfo);

}

  res.redirect('/profile/ebooks');

});

function deletePageByNumber(number, dir) {

  var data = fs.readFileSync(dir+"/info.txt",
                              {encoding:'utf8', flag:'r'}).split('\n');

  var filesInbook = fs.readdirSync(dir);

  var backs = data[5].split(" ");
  var newBacks = [];
  var backStr = "0";

  if(filesInbook.length-1 > 1){
    //fs.writeFileSync(dir+"/seite0.html", "");
    rimraf.sync(dir+"/seite"+number+".html");

    for(var i = 0; i < filesInbook.length-1; i++){
      console.log(dir+'/seite'+i+'.html', dir+'/seite'+(i-1)+'.html');
      if(i > parseInt(number)){
        fs.renameSync(dir+'/seite'+i+'.html', dir+'/seite'+((i-1) < 0 ? (0) : (i-1))+'.html');
        newBacks[i-1] = backs[i];
      }else if(i < parseInt(number)){
        newBacks[i] = backs[i];
      }
    }

    backStr = ""

    for(var i = 0; i < newBacks.length; i++){
      backStr += newBacks[i];
      if(i != newBacks.length-1){
        backStr+=" ";
      }
    }

    if(data[4] >= filesInbook.length-2){
      data[4] = filesInbook.length-2-1;
    }else if(data[4] <= 0){
      data[4] = 0;
    }

  }else{
    fs.writeFileSync(dir+"/seite0.html", "");
    data[4] = 0;
  }

  //data[4] = (parseInt(req.body.page)>=0 && parseInt(req.body.page)<filesInbook.length-1) ? parseInt(req.body.page)



  fs.writeFileSync(dir+"/info.txt", data[0]+"\n"+data[1]+"\n"+data[2]+"\n"+data[3]+"\n"+data[4]+"\n"+backStr);

}

module.exports = router;
