async function leaveRoom(roomId) {

  const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})

swalWithBootstrapButtons.fire({
  title: 'Сигурни ли сте?',
  icon: 'warning',

  confirmButtonText: 'Да!',
  showCancelButton: true,
  cancelButtonText: 'Не, отмени!',
  reverseButtons: true
}).then((result) => {
  if (result.isConfirmed) {

    var f = document.createElement("form");
    f.setAttribute('method',"get");
    f.setAttribute('action',"/class/"+roomId+"/leave");
    document.body.appendChild(f);
    //
    // console.log(f);
    //
    f.submit();

  } else if (
    /* Read more about handling dismissals below */
    result.dismiss === Swal.DismissReason.cancel
  ) {
    swalWithBootstrapButtons.fire(
      'Отменено',
      '',
      'error'
    )
  }
})

}

const socket = io();

const chatBox = document.getElementsByClassName('chat')[0];
  const username = document.getElementById('uname').value;

socket.on('message', msg => {
  outputMessage(msg);
  console.log(msg);
  // console.log(chatBox);
  window.scrollTo(0,document.body.scrollHeight);
});

var sendMsgIn = document.getElementById("sendMsg");

// Execute a function when the user releases a key on the keyboard
sendMsgIn.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();

    const text = event.target.value;

    if(text.length > 0){
      var msg = {
        text: text,
        user: username
      }

      socket.emit('chatMessage', msg);
    }

    event.target.value = '';
    event.target.focus();
  }
});

function outputMessage(msg) {

  var li = document.createElement('li');

  console.log(createMutipleRows(msg.text));

  if(msg.sender.username == username){
    li.classList.add('self');
  }else{
    li.classList.add('other');
  }
  li.innerHTML = `<div class="avatar"><img src="${msg.sender.pic}" draggable="false"/></div>
<div class="msg">
    ${createMutipleRows(msg.text)}
  <time>${msg.time}</time>
</div>`

  document.querySelector('.chat').appendChild(li);
}

function createMutipleRows(text) {

  var str = "";

  var num = Math.ceil(text.length/100);

  for(var i = 0; i < num; i++){
    var from = i * (text.length/num);
    var to = from + text.length/num;

    str += `<p>${text.substring(from, to)}</p>`

  }

  return str;

}

function sendEmoji() {

  const text = "<emoji class='happy'>";

  if(text.length > 0){
    var msg = {
      text: text,
      user: username
    }

    socket.emit('chatMessage', msg);
  }

  sendMsgIn.focus();

}
