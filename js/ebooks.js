var isInEditMode = true;

var isInSelectMode = false;

var isInPageSelectMode = false;

var isSelectingPages = false;

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

    var inPId = "iPage"+i;

    // var inputSelect = document.createElement('input');
    //
    // inputSelect.setAttribute('type', 'checkbox');
    // inputSelect.setAttribute('id', inPId);
    // inputSelect.setAttribute('name', inPId);
    // inputSelect.style.display = "none";
    //
    // note.appendChild(inputSelect)

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
  // document.getElementById('selectPage').style.display = "";
  document.getElementById("notebook").style.display = "none"; // edit pages
  isInPageSelectMode = true;
}

function disablePageSelection(){
  document.getElementById("notebooks").style.display = "none";
  document.getElementById('selectPage').style.display = "none";
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
    //document.getElementById('selectPage').style.display = "";
    document.getElementById('deletePage').style.display = "";

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

      addAllWords(words, title, type);
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

function selectAllWords() {

  var selectedWords = document.getElementsByName('sWord');

  for (var i = 0; i < selectedWords.length; i++) {
    selectedWords[i].checked = !selectedWords[i].checked;
  }

}

function deleteSelected() {

  var f = document.createElement("form");
  f.setAttribute('method',"post");
  f.setAttribute('action',"/profile/deleteWord");

  var title = document.getElementById('titleBook').innerText;

  var selectedWords = document.getElementsByName('sWord');

  for (var i = 0; i < selectedWords.length; i++) {
    if(selectedWords[i].checked){

      var ind = document.createElement("input"); //input element, Submit button
      ind.setAttribute('type',"hidden");
      ind.setAttribute('value',i);
      ind.setAttribute('name',"indexDWord");

      f.appendChild(ind);

    }
  }

  var bTypeI = document.createElement("input");

  bTypeI.setAttribute('type', 'hidden');
  bTypeI.setAttribute('name', 'bookTypeD');
  bTypeI.setAttribute('value', "vbook");

  var bTit = document.createElement("input");

  bTit.setAttribute('type', 'hidden');
  bTit.setAttribute('name', 'bookTitleD');
  bTit.setAttribute('value', ""+title);

  f.appendChild(bTypeI);
  f.appendChild(bTit);

  document.body.appendChild(f);

  f.submit();

}

function addAllWords(words, title, type) {

  var tbodyRef = document.getElementById("vkWords").getElementsByTagName('tbody')[0];

  for(var i =0; i < words.length; i++){
    var newRow = tbodyRef.insertRow();
    newRow.id = "word"+i;

	newRow.style = "text-align: center;";

    var selCell = newRow.insertCell();

    var selWord = document.createElement("input");

    selWord.setAttribute('type', 'checkbox');
    selWord.setAttribute('id', 'sWord'+i);
    selWord.setAttribute('name', 'sWord');

    selCell.appendChild(selWord);

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

          var buttsCell = newRow.insertCell();

          console.log(i, title, type);

          var editButt = document.createElement("button");
		  editButt.style = 'margin: 2px;';

          editButt.setAttribute('class', 'btn btn-info');
          editButt.setAttribute('id', 'eWord'+i);
          editButt.setAttribute('onclick', 'editWord("'+title+'", "'+type+'", "'+words[i].name+'", "'+words[i].multiple+'", "'+words[i].translate+'", "'+words[i].transcr+'", "'+words[i].type+'", "'+i+'")');
          editButt.innerHTML = '<i class="fas fa-pen"></i>';

          console.log(editButt.id);

          var currIndex = i;

          // editButt.onclick = function (e) {
          //
          //   var num = (e.target.id.split('eWord')[1] != "") ? (e.target.id.split('eWord')[1]) : currIndex//parentNote.id.split('eWord')[1];
          //   console.log(words, currIndex);
          //   // console.log(num);
            // editWord(words, num);
          // }

          // editButt.setAttribute('onclick')

          var delButt = document.createElement("button");

          delButt.setAttribute('class', 'btn btn-danger');
          delButt.setAttribute('id', 'dWord'+i);
          delButt.setAttribute('onclick', 'deleteWord("'+title+'", "'+type+'", "'+i+'")');
          delButt.innerHTML = '<i class="fas fa-trash"></i>';

          buttsCell.appendChild(editButt);
          buttsCell.appendChild(delButt);
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

async function editWord(title, bType, name, multiple, translate, transcr, type, index) {

  // console.log(words);
  console.log(index, title, bType);

    const inputOptionsIcons = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          'ajective': "Прилагателно",
          'noun': 'Съществително',
          'verb': 'Глагол',
          'otherW': 'Друго'
        })
      }, 1000)
    })

    Swal.mixin({
    input: 'text',
    confirmButtonText: 'Next &rarr;',
    showCancelButton: true,
    progressSteps: ['1', '2', '3', '4', '5']
  }).queue([
    {
      title: 'Въпрос 1',
      text: 'Думата на чужд език:',
      input: "text",
      inputValue: name,
      inputValidator: (value) => {
        if(!value){

          return "Не може полето да е празно!"

        }
      }
    },
    {
      title: 'Въпрос 2',
      input: 'text',
      text: "Мн. число:",
      inputValue: multiple,
      //inputOptions: inputOptions,
      // inputValidator: (value) => {
      //   if (!value) {
      //     return 'Трябва да изберете опция!'
      //   }
      //}
    },
    {
      title: 'Въпрос 3',
      text: 'Думата на български:',
      input: "text",
      inputValue: translate,
      inputValidator: (value) => {
        if(!value){

          return "Не може полето да е празно!"

        }
      }
    },
    {
      title: 'Въпрос 4',
      input: 'text',
      text: "Доп. инфо. за думата:",
      inputValue: transcr,
    },
    {
      title: 'Въпрос 5',
      input: 'select',
      inputPlaceholder: 'Изберете вид на думата',
      text: 'Вид на думата:',
      inputOptions: inputOptionsIcons,
      inputValue: type,
      inputValidator: (value) => {
        if(! value || value == 'Изберете вид на думата'){
          return 'Трябва да изберете опция!'
        }
      }
    }
  ]).then((result) => {
    if (result.value) {
      const answers = JSON.stringify(result.value)
      // console.log(result.value);
      console.log(answers, index);


      var f = document.createElement("form");
      f.setAttribute('method',"post");
      f.setAttribute('action',"/profile/editWord");

      var name = document.createElement("input"); //input element, text
      name.setAttribute('type',"hidden");
      name.setAttribute('value',result.value[0]);
      name.setAttribute('name',"wordE");

      var mul = document.createElement("input"); //input element, Submit button
      mul.setAttribute('type',"hidden");
      mul.setAttribute('value',result.value[1]);
      mul.setAttribute('name',"MwordE");

      var translateI = document.createElement("input"); //input element, Submit button
      translateI.setAttribute('type',"hidden");
      translateI.setAttribute('value',result.value[2]);
      translateI.setAttribute('name',"trWordE");

      var transcrI = document.createElement("input"); //input element, Submit button
      transcrI.setAttribute('type',"hidden");
      transcrI.setAttribute('value',result.value[3]);
      transcrI.setAttribute('name',"transcrE");

      var typ = document.createElement("input"); //input element, Submit button
      typ.setAttribute('type',"hidden");
      typ.setAttribute('value',result.value[4]);
      typ.setAttribute('name',"wTypeE");

      var ind = document.createElement("input"); //input element, Submit button
      ind.setAttribute('type',"hidden");
      ind.setAttribute('value',index);
      ind.setAttribute('name',"indexEWord");

      var bTypeI = document.createElement("input");

      bTypeI.setAttribute('type', 'hidden');
      bTypeI.setAttribute('name', 'bookTypeE');
      bTypeI.setAttribute('value', ""+bType);

      var bTit = document.createElement("input");

      bTit.setAttribute('type', 'hidden');
      bTit.setAttribute('name', 'bookTitleE');
      bTit.setAttribute('value', ""+title);

      f.appendChild(bTypeI);
      f.appendChild(bTit);

      f.appendChild(translateI);
      f.appendChild(name);
      f.appendChild(typ);
      f.appendChild(mul);
      f.appendChild(ind);
      f.appendChild(transcrI);

      document.body.appendChild(f);

      console.log(f);

      f.submit();

      Swal.fire({
        title: 'All done!',
        html: `
          Твоите отговори:
          <pre><code>${answers}</code></pre>
        `,
        confirmButtonText: 'Lovely!'
      })
    }
  });

}

async function deleteWord(title, bType, index) {

  console.log(index);

  Swal.fire({
  title: 'Сигурнили сте?',
  text: "Няма да можете да възтоновите данните!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Да, изтрий го!'
}).then((result) => {
  if (result.isConfirmed) {

    var f = document.createElement("form");
    f.setAttribute('method',"post");
    f.setAttribute('action',"/profile/deleteWord");

    var ind = document.createElement("input"); //input element, Submit button
    ind.setAttribute('type',"hidden");
    ind.setAttribute('value',index);
    ind.setAttribute('name',"indexDWord");

    var bTypeI = document.createElement("input");

    bTypeI.setAttribute('type', 'hidden');
    bTypeI.setAttribute('name', 'bookTypeD');
    bTypeI.setAttribute('value', ""+bType);

    var bTit = document.createElement("input");

    bTit.setAttribute('type', 'hidden');
    bTit.setAttribute('name', 'bookTitleD');
    bTit.setAttribute('value', ""+title);

    f.appendChild(bTypeI);
    f.appendChild(bTit);
    f.appendChild(ind);

    document.body.appendChild(f);

    f.submit();

    Swal.fire(
      'Изтрито!',
      'Файлът е изтрит!',
      'success'
    )
  }
});

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

  if(document.getElementById("booksLoader").style.display != "none"){
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
  }else if(document.getElementById("notebook").style.display == "" || document.getElementById("notebooks").style.display == ""){

    enablePageSelection();

      const notebook = document.getElementById("notebooks");
      for (let i = 0; i < notebook.children.length; i++) {

        if(notebook.children[i].children[0].tagName === "IFRAME"){
          console.log(notebook.children[i].children[0]);

            var text = notebook.children[i].children[0].contentWindow.document.body.innerText;

            // console.log();

            if(!text.toLowerCase().includes(nameS)){
              //console.log(nameBook);
              notebook.children[i].children[0].style.display = "none";
            }else{
                notebook.children[i].children[0].style.display = "";
            }

        }
      }
  }else if(document.getElementById("vocabulary").style.display != "none"){

    const table = document.getElementById("vkWords").getElementsByTagName('tbody')[0];

    for (let i = 0; i < table.children.length; i++) {

      if(table.children[i].tagName === "TR"){

        var text = table.children[i].innerText;

        if(!text.toLowerCase().includes(nameS)){
          //console.log(nameBook);
          table.children[i].style.display = "none";
        }else{
            table.children[i].style.display = "";
        }

      }
    }

  }

}

function selectPage() {

  //isSelectingPages = !isSelectingPages;

}

function onElementFocused(e)
{
    if (e && e.target){

        document.activeElement = e.target == document ? null : e.target;
        console.log(document.activeElement);
      }
}

function onElementClick(e) {

  console.log(e.target);

}

function deletePage() {

  var number = parseInt(document.getElementById('pageNum').innerHTML)-1;

  var f = document.getElementById('exitForm');

    f.setAttribute('action',"/profile/deletePage");

    f.submit();

}

var monitor = setInterval(function(){

  var elem = document.activeElement;
  //console.log(elem.parentElement);
  var parent = document.activeElement.parentElement;

  if(elem && elem.tagName == 'IFRAME' && elem.id != "textEditor"){

    var num = parseInt(elem.id.split("page")[1]) - (parseInt(document.getElementById('pageNum').innerHTML)-1);


      if(!isSelectingPages){
        clearInterval(monitor);
        goToPage(num);
      }else{
        // for(var i = 0; i < parent.children.length; i++){
        //
        //   if(parent.children[i].tagName === "INPUT"){
        //       parent.children[i].checked = true;
        //       parent.children[i].style.display = "none"
        //       //  elem.addEventListener("focus", onElementFocused, true);
        //       break;
        //   }
        //
        // }
      }
  }

}, 100);
