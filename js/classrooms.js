async function createClassRoom() {

  var valueType = "";

  const inputOptions = new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        'private': 'Частна стая',
        'public': 'Публична стая'
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
    text: 'Име на стаята:',
    input: "text",
    inputValidator: (value) => {
      if(!value){

        return "Не може полето да е празно!"

      }else if(value.length > 50){

        return "Заглавието трябва да е до 50 символа!"

      }
    }
  },
  {
    title: 'Въпрос 2',
    input: 'radio',
    text: "Вид на стаята:",
    inputOptions: inputOptions,
    html: '<input id="swal-pass" placeholder="Парола (ако стаята е частна)" class="swal2-input">',
    preConfirm: () => {
      //return document.getElementById('swal-pass').value
    },
    inputValidator: (value) => {
      if (!value) {
        return 'Трябва да изберете опция!'
      }else if(value == "private"){
        //Swal.showValidationMessage('Трябва да въведете парола, ако искате стаята да е частна!');
        // console.log(document.getElementById('swal-pass').value);
        if(document.getElementById('swal-pass').value.length <=0){
          return 'Трябва да въведете парола, ако искате стаята да е частна!';
        }else{
          valueType = document.getElementById('swal-pass').value;
          // console.log(value+=" "+document.getElementById('swal-pass').value);
          console.log(valueType);
        }
      }else if(value == "public"){

        if(document.getElementById('swal-pass').value.length >0){

          valueType = document.getElementById('swal-pass').value;

        }

      }
    }
  },
  {
    title: 'Въпрос 3',
    input: 'text',
    text: 'Описание на стаята:',
    // inputOptions: inputOptionsIcons,
    // inputValidator: (value) => {
    //   if(! value || value == 'Изберете икона'){
    //     return 'Трябва да изберете опция!'
    //   }
    // }
  }
]).then((result) => {
  if (result.value) {
    console.log(result.value);
    result.value.push(valueType);
    const answers = JSON.stringify(result.value)
    // console.log(result.value);
    console.log(answers);

    var f = document.createElement("form");
    f.setAttribute('method',"post");
    f.setAttribute('action',"/profile/createClassRoom");
    //
    var tit = document.createElement("input"); //input element, text
    tit.setAttribute('type',"hidden");
    tit.setAttribute('value',result.value[0]);
    tit.setAttribute('name',"name");

    var typ = document.createElement("input"); //input element, Submit button
    typ.setAttribute('type',"hidden");
    typ.setAttribute('value',result.value[1]);
    typ.setAttribute('name',"type");

    var desc = document.createElement("input"); //input element, Submit button
    desc.setAttribute('type',"hidden");
    desc.setAttribute('value',result.value[2]);
    desc.setAttribute('name',"desc");

    var pass = document.createElement("input"); //input element, Submit button
    pass.setAttribute('type',"hidden");
    pass.setAttribute('value',result.value[3]);
    pass.setAttribute('name',"password");
    //
    f.appendChild(desc);
    f.appendChild(tit);
    f.appendChild(typ);
    f.appendChild(pass);
    //
    document.body.appendChild(f);
    //
    // console.log(f);
    //
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
