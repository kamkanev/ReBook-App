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
