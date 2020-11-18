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
        '#ff0000': 'Тетрадка за писане',
        '#0000ff': 'Тетрадка речник'
      })
    }, 1000)
  })

  const inputOptionsIcons = new Promise((resolve) => {
    setTimeout(() => {
      resolve({
      'Fruits': {
        apples: 'Apples',
        bananas: 'Bananas',
        grapes: 'Grapes',
        oranges: 'Oranges'
      },
      'Vegetables': {
        potato: 'Potato',
        broccoli: 'Broccoli',
        carrot: 'Carrot'
      },
      'icecream': 'Ice cream'
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
    Swal.fire({
      title: 'All done!',
      html: `
        Your answers:
        <pre><code>${answers}</code></pre>
      `,
      confirmButtonText: 'Lovely!'
    })
  }
})
}
