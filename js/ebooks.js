var isInEditMode = true;

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

   if(val == 0){
     document.getElementById('textEditor').style = "";
   }else if(val == 1){
    document.getElementById('textEditor').style.cssText = "background: url('../img/books/backgrounds/bgBook1.png') repeat-y;"+
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
    document.getElementById('textEditor').style.cssText = "background: url('../img/books/backgrounds/bgBook2.png') repeat-y;"+
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
    document.getElementById('textEditor').style.cssText = "background: url('../img/books/backgrounds/bgBook3.png') repeat-y;"+
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
    document.getElementById('textEditor').style = "border: 1px solid #EEEEEE;"+
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
      }
	  else if(value.length > 25){
		return "Заглавието трябва да е до 25 символа!"
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

function goToBook(link, title, type, icon, length, page) {
  console.log(title, type, icon, length, page);
  if(type == "nbook"){
    document.getElementById("booksLoader").style.display = "none";
    document.getElementById("createBooks").style.display = "none";
    document.getElementById('titleBook').style.display = "";
    document.getElementById('titleBook').innerHTML = title;
    document.getElementById('backToAll').style.display = "";

    document.getElementById('savePage').style.display = "";

    document.getElementById("notebook").style.display = "";

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
        document.getElementById("textEditor").src = "." + link + "/seite"+page+".html"
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

  f.appendChild(tit);
  f.appendChild(typ);
  f.appendChild(ope);
  f.appendChild(pag);

  document.body.appendChild(f);

}

function openBook(title, type, icon, length, open, page) {

  open = type == "nbook";

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
