var isInEditMode = true;

var isInSelectMode = false;

var isInPageSelectMode = false;

var bookTitles = [];

function enableEditMode() {
  textEditor.document.designMode = 'On';
}

function execCmd( command ) {

  textEditor.document.execCommand(command, false, null);

}

function execCommandWithArg(command, arg) {
  if(arg == 0){

  }else{
    textEditor.document.execCommand(command, false, arg);
  }
}

function toggleEdit() {
  if(isInEditMode){
    textEditor.document.designMode = 'Off';
    isInEditMode = false;
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Файла не може да се редактира сега!',
      showConfirmButton: false,
      timer: 2000
    })
  }else{
    textEditor.document.designMode = 'On';
    isInEditMode = true;
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Файла вече може да се редактира сега!',
      showConfirmButton: false,
      timer: 2000
    })
  }

}

function changeBackground(val) {

  console.log(val);

  changeBackgroundById(val, 'textEditor');

}

async function createNewBook(){

  const inputOptions = new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        'nbook': 'Тетрадка за писане',
        'vbook': 'Тетрадка речник'
      })
    }, 1000)
  })

  const inputOptionsIcons = new Promise((resolve) => {
    setTimeout(() => {
      resolve({
      'Тетрадка за писане': {
        'en.png': "Английски",
        'bg.png': 'Български',
        'sp.png': 'Испански',
        'de.png': 'Немски',
        'ru.png': 'Руски',
        'fr.png': 'Френски',
        'ot.png': "Други езици",
        'ma.png': "Матеметика",
        'ph.png': 'Физика',
        'ch.png': 'Химия',
        'bi.png': 'Биология',

      },
      'Тетрадка речник': {
        'en-bg.png': 'Българо-английска',
        'ne-bg.png': 'Българо-немска',
        'ru-bg.png': 'Българо-руска'
      }
      })
    }, 1000)
  })

  Swal.mixin({
  input: 'text',
  confirmButtonText: 'Next &rarr;',
  showCancelButton: true,
  progressSteps: ['1', '2', '3']
}).queue([
  {
    title: 'Въпрос 1',
    text: 'Заглавие на тетрадката:',
    input: "text",
    inputValidator: (value) => {
      if(!value){

        return "Не може полето да е празно!"

      }else if(value.length > 25){

    		return "Заглавието трябва да е до 25 символа!"

      }else if(bookTitles.includes(value)){

        return "Вече съществува тетрадка с това заглавие!"

      }
    }
  },
  {
    title: 'Въпрос 2',
    input: 'radio',
    text: "Вид на тетрадката:",
    inputOptions: inputOptions,
    inputValidator: (value) => {
      if (!value) {
        return 'Трябва да изберете опция!'
      }
    }
  },
  {
    title: 'Въпрос 3',
    input: 'select',
    inputPlaceholder: 'Изберете икона',
    text: 'Икона за тетрадката:',
    inputOptions: inputOptionsIcons,
    inputValidator: (value) => {
      if(! value || value == 'Изберете икона'){
        return 'Трябва да изберете опция!'
      }
    }
  }
]).then((result) => {
  if (result.value) {
    const answers = JSON.stringify(result.value)
    // console.log(result.value);
    //console.log(answers);

    var f = document.createElement("form");
    f.setAttribute('method',"post");
    f.setAttribute('action',"/profile/createBook");

    var tit = document.createElement("input"); //input element, text
    tit.setAttribute('type',"hidden");
    tit.setAttribute('value',result.value[0]);
    tit.setAttribute('name',"title");

    var typ = document.createElement("input"); //input element, Submit button
    typ.setAttribute('type',"hidden");
    typ.setAttribute('value',result.value[1]);
    typ.setAttribute('name',"type");

    var ico = document.createElement("input"); //input element, Submit button
    ico.setAttribute('type',"hidden");
    ico.setAttribute('value',result.value[2]);
    ico.setAttribute('name',"icon");

    var ope = document.createElement("input"); //input element, Submit button
    ope.setAttribute('type',"hidden");
    ope.setAttribute('value',false);
    ope.setAttribute('name',"opened");

    f.appendChild(ico);
    f.appendChild(tit);
    f.appendChild(typ);
    f.appendChild(ope);

    document.body.appendChild(f);

    console.log(f);

    f.submit();

    // Swal.fire({
    //   title: 'All done!',
    //   html: `
    //     Your answers:
    //     <pre><code>${answers}</code></pre>
    //   `,
    //   confirmButtonText: 'Lovely!'
    // })
  }
})
}

function showAllPages(link, page, len, backs){

  var notebook = document.getElementById("notebooks");



  var selPId = "page"+page;

  for(var i = 0; i < len; i++){

    var note = document.createElement("div");

    var fr = document.createElement("iframe");

    fr.id = "page"+i;
    fr.width = 300;
    fr.height = 450;
    fr.src = "." + link + "/seite"+i+".html";

    if(i == page){
      fr.style.border = "thick solid #00FF00";
    }else{
      fr.style.border = "solid #000000";
    }
    //console.log(fr.id, backs[i]);
    fr.addEventListener("load",function(event) {

      var val = backs[parseInt(event.target.id.split("page")[1])];
      console.log(val);
      if(val == 0){
        event.target.style = "";
      }else if(val == 1){
       event.target.style.cssText = "background: url('../img/books/backgrounds/bgBook1.png') repeat-y;"+
        "line-height: 25px;"+
        "padding: 2px 10px;"+
        "display: block;"+
        "resize: none;"+
        //"margin: 2% auto;"+
        "-webkit-background-size:  100% 50px;"+
        "background-size: 100% 50px;"+
        "border: solid 1px #ddd;";
     }else if(val == 2){
       event.target.style.cssText = "background: url('../img/books/backgrounds/bgBook2.png') repeat-y;"+
        "line-height: 25px;"+
        "padding: 2px 10px;"+
        "display: block;"+
        "resize: none;"+
        //"margin: 2% auto;"+
        "-webkit-background-size:  100% 50px;"+
        "background-size: 100% 50px;"+
        "border: solid 1px #ddd;";
     }else if(val == 3){
       event.target.style.cssText = "background: url('../img/books/backgrounds/bgBook3.png') repeat-y;"+
        "line-height: 25px;"+
        "padding: 2px 10px;"+
        "display: block;"+
        "resize: none;"+
        //"margin: 2% auto;"+
        "-webkit-background-size:  100% 50px;"+
        "background-size: 100% 50px;"+
        "border: solid 1px #ddd;";
     }else if(val == 4){
       event.target.style = "border: 1px solid #EEEEEE;"+
           "box-shadow: 1px 1px 0 #DDDDDD;"+
           "display: block;"+
           "font-family: 'Marck Script',cursive;"+
           "font-size: 22px;"+
           "line-height: 50px;"+
           /*"margin: 2% auto;"+*/
           "padding: 11px 20px 0 70px;"+
           "resize: none;"+
           "background-image: -moz-linear-gradient(top , transparent, transparent 49px,#E7EFF8 0px), -moz-radial-gradient(4% 50%, circle closest-corner, #f5f5f5, #f5f5f5 39%, transparent 0%), -moz-radial-gradient(3.9% 46% , circle closest-corner, #CCCCCC, #CCCCCC 43.5%, transparent 0%);"+
           "background-image: -webkit-linear-gradient(top , transparent, transparent 49px,#E7EFF8 0), -webkit-radial-gradient(4% 50%, circle closest-corner, #f5f5f5, #f5f5f5 39%, transparent 0%), -webkit-radial-gradient(3.9% 46%, circle closest-corner, #cccccc, #cccccc 43.5%, transparent 0%);"+
           "-webkit-background-size:  100% 50px;"+
           "background-size: 100% 50px;";
     }
	 event.target.style.border = "solid #000000";
      if(event.target.id == selPId){
        event.target.style.border = "thick solid #00FF00";
      }
     });

    fr.addEventListener("mouseenter", function(event){

        event.target.style.border = "thick solid #00FFFF";

    });

    fr.addEventListener("mouseout", function(event){
        event.target.style.border = "solid #000000";
      if(event.target.id == selPId){
        event.target.style.border = "thick solid #00FF00";
      }

    });



    note.addEventListener("click", function() {

      //console.log(a);
      console.log("uvhkjl");

    });

    note.appendChild(fr);

    note.style.margin = "20px 10px 20px 30px";

    notebook.appendChild(note);
  }

}

function enablePageSelection(){
  document.getElementById("notebooks").style.display = "";
  document.getElementById("notebook").style.display = "none"; // edit pages
  isInPageSelectMode = true;
}

function disablePageSelection(){
  document.getElementById("notebooks").style.display = "none";
  document.getElementById("notebook").style.display = ""; // edit pages

  isInPageSelectMode = false;
}

function pageSelctor() {
  document.getElementById("notebook").style.display == "" ? enablePageSelection() :disablePageSelection();

}

function goToBook(link, title, type, icon, length, page, backgrounds = "", data) {
  console.log(title, type, icon, length, page);

  document.getElementById("booksLoader").style.display = "none";
  document.getElementById("createBooks").style.display = "none";
  document.getElementById("deleteBooks").style.display = "none";
  document.getElementById("editBooks").style.display = "none";
  document.getElementById("selectBooks").style.display = "none";
  document.getElementById('titleBook').style.display = "";
  document.getElementById('titleBook').innerHTML = title;
  document.getElementById('backToAll').style.display = "";

  var backs = backgrounds.split(' ');

  if(type == "nbook"){



    showAllPages(link, page, length, backs);

    for(var i = 0; i <= length; i++){
      changeBackgroundById(("page"+i), backs[i]);
    }

    document.getElementById('savePage').style.display = "";

    document.getElementById("notebook").style.display = ""; // edit pages

    // document.getElementById("pageNum").innerHTML = page;

    // document.getElementById("nextPage").onclick = function(){ createPage() };

    if(page == (length-1)){
      document.getElementById("nextPage").innerHTML = '<i class="fas fa-plus"></i>';
      document.getElementById("nextPage").onclick = function(){ createPage() };
    }else{
      document.getElementById("nextPage").onclick = function(){ goToPage(1) };
    }

    if(page <= 0){
      document.getElementById("prevPage").classList.add("disabled");
    }

    document.getElementById("prevPage").onclick = function(){ goToPage(-1) };


    if(length <= 0){
    }else{
        document.getElementById("textEditor").src = "." + link + "/seite"+page+".html";
        changeBackground(backs[page]);
        document.getElementById('listChange').selectedIndex = backs[page];
    }
  }else{

    document.getElementById("vocabulary").style.display = "";

    var cform = document.getElementById('addWord');

    var bType = document.createElement("input");

    bType.setAttribute('type', 'hidden');
    bType.setAttribute('name', 'bookType');
    bType.setAttribute('value', type);

    var bTit = document.createElement("input");

    bTit.setAttribute('type', 'hidden');
    bTit.setAttribute('name', 'bookTitle');
    bTit.setAttribute('value', title);

    cform.appendChild(bType);
    cform.appendChild(bTit);

    //document.body.appendChild(cform);

    console.log(typeof data != 'undefined');

    if(length > 0){
      let words = JSON.parse(data);
      console.log(words);

      addAllWords(words);
    }

  }

  document.getElementById("pageNum").innerHTML = page+1;


  var f = document.createElement("form");
  f.setAttribute('method',"post");
  f.setAttribute('action',"/profile/openBook");
  f.setAttribute('id',"exitForm");

  var tit = document.createElement("input"); //input element, text
  tit.setAttribute('type',"hidden");
  tit.setAttribute('value',title);
  tit.setAttribute('name',"title");

  var typ = document.createElement("input"); //input element, Submit button
  typ.setAttribute('type',"hidden");
  typ.setAttribute('value',type);
  typ.setAttribute('name',"type");

  var ope = document.createElement("input"); //input element, Submit button
  ope.setAttribute('type',"hidden");
  ope.setAttribute('value',false);
  ope.setAttribute('name',"opened");

  var pag = document.createElement("input"); //input element, Submit button
  pag.setAttribute('type',"hidden");
  pag.setAttribute('value',page);
  pag.setAttribute('name',"page");

  var backgr = document.createElement("input"); //input element, Submit button
  backgr.setAttribute('type',"hidden");
  backgr.setAttribute('value', backs[page]);
  backgr.setAttribute('name',"backgr");

  f.appendChild(tit);
  f.appendChild(typ);
  f.appendChild(ope);
  f.appendChild(pag);
  f.appendChild(backgr);

  document.body.appendChild(f);

}

function addAllWords(words) {


  var tbodyRef = document.getElementById("vkWords").getElementsByTagName('tbody')[0];

  for(var i =0; i < words.length; i++){
    var newRow = tbodyRef.insertRow();

	newRow.style = "text-align: center;";

    var numCell = newRow.insertCell();

    var num = document.createTextNode(i+1);

    numCell.appendChild(num);

    var nameCell = newRow.insertCell();


    var newWord = document.createTextNode(words[i].name);

    nameCell.appendChild(newWord);

      var multCell = newRow.insertCell();

      var multWord = document.createTextNode(words[i].multiple);

      multCell.appendChild(multWord);

        var bgCell = newRow.insertCell();

        var bgWord = document.createTextNode(words[i].translate);

        bgCell.appendChild(bgWord);

          var transCell = newRow.insertCell();

          var transWord = document.createTextNode(words[i].transcr);

          transCell.appendChild(transWord);

          var typeCell = newRow.insertCell();

          var typeWord;

          switch (words[i].type) {
            case 'ajective':
              newRow.setAttribute("class", "table-success");
              typeWord = document.createTextNode("прилагателно");
              break;
            case 'verb':
              newRow.setAttribute("class", "table-danger");
              typeWord = document.createTextNode("глагол");
              break;
            case 'otherW':
              newRow.setAttribute("class", "table-secondary");
              typeWord = document.createTextNode("други");
              break;
            default:
              newRow.setAttribute("class", "table-primary");
              typeWord = document.createTextNode("съществително");
          }

          typeCell.appendChild(typeWord);
  }



}

function openBook(title, type, icon, length, open, page) {

  //open = type == "nbook";

  var f = document.createElement("form");
  f.setAttribute('method',"post");
  f.setAttribute('action',"/profile/openBook");
  f.setAttribute('id',"openForm");

  var tit = document.createElement("input"); //input element, text
  tit.setAttribute('type',"hidden");
  tit.setAttribute('value',title);
  tit.setAttribute('name',"title");

  var typ = document.createElement("input"); //input element, Submit button
  typ.setAttribute('type',"hidden");
  typ.setAttribute('value',type);
  typ.setAttribute('name',"type");

  var ope = document.createElement("input"); //input element, Submit button
  ope.setAttribute('type',"hidden");
  ope.setAttribute('value',open);
  ope.setAttribute('name',"opened");

  var pag = document.createElement("input"); //input element, Submit button
  pag.setAttribute('type',"hidden");
  pag.setAttribute('value',page);
  pag.setAttribute('name',"page");

  f.appendChild(tit);
  f.appendChild(typ);
  f.appendChild(ope);
  f.appendChild(pag);

  document.body.appendChild(f);

  f.submit();

}

function animateBgOut(x){

  x.style.backgroundColor = "#7bb2ed";

}

function animateBgIn(x){

  x.style.backgroundColor = "#5299ff";
  x.style.cursor = "pointer";

}

function exitBook() {
  var form = document.getElementById('exitForm');

  form.submit();
}

function backButt() {
  if(isInPageSelectMode){
    disablePageSelection();
  }else{
    exitBook();
  }
}

function savePage() {

  var form = document.getElementById('exitForm');
  form.setAttribute('action',"/profile/savePage");

  var info = document.getElementById("textEditor").contentWindow.document.body.innerHTML;

  var text = document.createElement("input"); //input element, Submit button
  text.setAttribute('type',"hidden");
  text.setAttribute('value', info);
  text.setAttribute('name',"text");

  form.appendChild(text);
  // console.log(form);

  document.getElementsByName('backgr')[0].setAttribute('value', document.getElementById("listChange").value);

  form.submit();

}

function createPage() {

  var form = document.getElementById('exitForm');
  form.setAttribute('action',"/profile/createPage");

  var info = document.getElementById("textEditor").contentWindow.document.body.innerHTML;

  var text = document.createElement("input"); //input element, Submit button
  text.setAttribute('type',"hidden");
  text.setAttribute('value', info);
  text.setAttribute('name',"text");

  form.appendChild(text);

  // console.log(form);
  document.getElementsByName('backgr')[0].setAttribute('value', document.getElementById("listChange").value);

  form.submit();

}

function goToPage(num) {

  var form = document.getElementById('exitForm');
  form.setAttribute('action',"/profile/goToPage");

  var info = document.getElementById("textEditor").contentWindow.document.body.innerHTML;

  var text = document.createElement("input"); //input element, Submit button
  text.setAttribute('type',"hidden");
  text.setAttribute('value', num);
  text.setAttribute('name',"where");

  form.appendChild(text);

  // console.log(form);

  form.submit();

}

function selectBook(title) {

  var input = document.getElementById("ch"+title);

  if(input.style.display != "none"){
    input.checked = !input.checked;
    document.getElementById("b"+title).style.border = input.checked ?"thick solid #00FFFF":"none";
    // console.log("select book "+title);
    // console.log(input.style.display);
  }

}

function enableSelectModeBooks(){
  document.getElementsByName('ch').forEach((input) => {
      input.style.display = input.style.display != "none"?"none":"inline";

  });

  isInSelectMode = !isInSelectMode;
      document.getElementById("deleteBooks").style.display = !isInSelectMode? "none":"inline";
      document.getElementById("editBooks").style.display = !isInSelectMode? "none":"inline";
      document.getElementById("createBooks").style.display = isInSelectMode? "none":"inline";
  if(!isInSelectMode){

    location.reload();

  }
}

function makeBookAction(title, type, icon, length, open, page) {

  if(isInSelectMode){
      selectBook(title);
  }else{
    openBook(title, type, icon, length, open, page);
  }

}

function deleteBooks() {
  if(isInSelectMode){

     // document.getElementById('deleteForm').remove();
     var len = 0;

    var form = document.createElement('form');

    form.setAttribute('method',"post");
    form.setAttribute('action',"/profile/deleteBooks");
    // f.setAttribute('id',"deleteForm");

    document.getElementsByName('ch').forEach((input) => {

      if(input.checked){
        var title = document.createElement("input"); //input element, Submit button
        title.setAttribute('type',"hidden");
        title.setAttribute('value', input.value);
        title.setAttribute('name',"titles");

        form.appendChild(title);
        len++;
      }

    });

    // console.log(form);

    document.body.appendChild(form);

    if(len > 0){
      form.submit();
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Грешка',
        text: 'Избери тетрадка първо!'
      })
    }

  }
}

async function editBooks() {

  if(isInSelectMode){
    var len = 0;
    var index = 0;

    var form = document.createElement('form');

    form.setAttribute('method',"post");
    form.setAttribute('action',"/profile/editBooks");

    var inputs = document.getElementsByName('ch');

    for (var i = 0; i < inputs.length; i++) {
      if(inputs[i].checked){
        len++;
        index = i;
      }
    }

    if(len == 1){

      var chinput = document.getElementsByName('ch')[index];
      var title = document.getElementsByName('ch')[index].value.split("|")[0];
      var type = document.getElementsByName('ch')[index].value.split("|")[1];
      var icon = document.getElementsByName('ch')[index].value.split("|")[2].split("/")[4];

      console.log(icon);

      const inputOptionsIcons = new Promise((resolve) => {
        setTimeout(() => {
          resolve({
          'Тетрадка за писане': {
            'en.png': "Английски",
            'bg.png': 'Български',
            'sp.png': 'Испански',
            'de.png': 'Немски',
            'ru.png': 'Руски',
            'fr.png': 'Френски',
            'ot.png': "Други езици",
            'ma.png': "Матеметика",
            'ph.png': 'Физика',
            'ch.png': 'Химия',
            'bi.png': 'Биология',

          },
          'Тетрадка речник': {
            'en-bg.png': 'Българо-английска',
            'ne-bg.png': 'Българо-немска',
            'ru-bg.png': 'Българо-руска'
          }
          })
        }, 1000)
      })

      Swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2']
    }).queue([
      {
        title: 'Въпрос 1',
        text: 'Заглавие на тетрадката:',
        input: "text",
        inputValue: title,
        inputValidator: (value) => {
          if(!value){

            return "Не може полето да е празно!"

          }else if(value.length > 25){

        		return "Заглавието трябва да е до 25 символа!"

          }else if(value != title && bookTitles.includes(value)){

            return "Вече съществува тетрадка с това заглавие!"

          }
        }
      },
      {
        title: 'Въпрос 2',
        input: 'select',
        inputPlaceholder: 'Изберете икона',
        text: 'Икона за тетрадката:',
        inputValue: icon,
        inputOptions: inputOptionsIcons,
        inputValidator: (value) => {
          if(! value || value == 'Изберете икона'){
            return 'Трябва да изберете опция!'
          }
        }
      }
    ]).then((result) => {
      if (result.value) {
        if(result.value[0] != title || result.value[1] != icon){

          var newInput = result.value[0]+"|"+type+"|"+result.value[1];

          var title = document.createElement("input"); //input element, Submit button
          title.setAttribute('type',"hidden");
          title.setAttribute('value', chinput.value);
          title.setAttribute('name',"titles");

          var newtitle = document.createElement("input"); //input element, Submit button
          newtitle.setAttribute('type',"hidden");
          newtitle.setAttribute('value', newInput);
          newtitle.setAttribute('name',"newtitles");

          form.appendChild(title);
          form.appendChild(newtitle);
          document.body.appendChild(form);
          form.submit();

        }
      }
    });

    }else{
      Swal.fire({
        icon: 'error',
        title: "Грешка",
        text: 'Може да се редактира по една тетрадка!'
      });
    }

  }

}

function changeBackgroundById(val = 0, id) {
  if(val == 0){
    document.getElementById(id).style = "";
  }else if(val == 1){
   document.getElementById(id).style.cssText = "background: url('../img/books/backgrounds/bgBook1.png') repeat-y;"+
    "line-height: 25px;"+
    "padding: 2px 10px;"+
    "display: block;"+
    "resize: none;"+
    "height: 800px;"+
    "width: 630px;"+
    "margin: 2% auto;"+
    "-webkit-background-size:  100% 50px;"+
    "background-size: 100% 50px;"+
    "border: solid 1px #ddd;";
 }else if(val == 2){
   document.getElementById(id).style.cssText = "background: url('../img/books/backgrounds/bgBook2.png') repeat-y;"+
    "line-height: 25px;"+
    "padding: 2px 10px;"+
    "display: block;"+
    "resize: none;"+
    "height: 800px;"+
    "width: 630px;"+
    "margin: 2% auto;"+
    "-webkit-background-size:  100% 50px;"+
    "background-size: 100% 50px;"+
    "border: solid 1px #ddd;";
 }else if(val == 3){
   document.getElementById(id).style.cssText = "background: url('../img/books/backgrounds/bgBook3.png') repeat-y;"+
    "line-height: 25px;"+
    "padding: 2px 10px;"+
    "display: block;"+
    "resize: none;"+
    "height: 800px;"+
    "width: 630px;"+
    "margin: 2% auto;"+
    "-webkit-background-size:  100% 50px;"+
    "background-size: 100% 50px;"+
    "border: solid 1px #ddd;";
 }else if(val == 4){
   document.getElementById(id).style = "border: 1px solid #EEEEEE;"+
       "box-shadow: 1px 1px 0 #DDDDDD;"+
       "display: block;"+
       "font-family: 'Marck Script',cursive;"+
       "font-size: 22px;"+
       "line-height: 50px;"+
       "margin: 2% auto;"+
       "padding: 11px 20px 0 70px;"+
       "resize: none;"+
       "height: 800px;"+
       "width: 630px;"+
       "background-image: -moz-linear-gradient(top , transparent, transparent 49px,#E7EFF8 0px), -moz-radial-gradient(4% 50%, circle closest-corner, #f5f5f5, #f5f5f5 39%, transparent 0%), -moz-radial-gradient(3.9% 46% , circle closest-corner, #CCCCCC, #CCCCCC 43.5%, transparent 0%);"+
       "background-image: -webkit-linear-gradient(top , transparent, transparent 49px,#E7EFF8 0), -webkit-radial-gradient(4% 50%, circle closest-corner, #f5f5f5, #f5f5f5 39%, transparent 0%), -webkit-radial-gradient(3.9% 46%, circle closest-corner, #cccccc, #cccccc 43.5%, transparent 0%);"+
       "-webkit-background-size:  100% 50px;"+
       "background-size: 100% 50px;";
 }
}

function findBookByName() {

  var nameS = document.getElementById('sBookName').value;

  var bnames = [];

  const bookContainer = document.getElementById('booksLoader');
  for (let i = 0; i < bookContainer.children.length; i++) {
    if(bookContainer.children[i].tagName === "DIV"){
      var nameBook = bookContainer.children[i].id.substring(1);
      if(!nameBook.toLowerCase().includes(nameS)){
        //console.log(nameBook);
        bookContainer.children[i].style.display = "none";
      }else{
          bookContainer.children[i].style.display = "";
      }
    }
  }

}

var monitor = setInterval(function(){
    var elem = document.activeElement;
    if(elem && elem.tagName == 'IFRAME' && elem.id != "textEditor"){

      var num = parseInt(elem.id.split("page")[1]) - (parseInt(document.getElementById('pageNum').innerHTML)-1);
        clearInterval(monitor);

        goToPage(num);
    }
}, 100);
