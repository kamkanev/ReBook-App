  document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');


    var calendar = new FullCalendar.Calendar(calendarEl, {
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
	  buttonText: {
		today: 'днес',
		month: 'месец',
		week: 'седмица',
		day: 'ден',
		list: 'списък'
	  },
	  locale: 'bg',
	  height: '56.35em',
      initialDate: '2020-06-12',
      navLinks: true, // can click day/week names to navigate views
      selectable: true,
      selectMirror: true,
      select: function(arg) {
        var title;
//		Swal.fire({
//			title: 'Добави събитие',
//			type: 'question',
//			showCancelButton: true,
//			confirmButtonText: 'Запази',
//			cancelButtonText: 'Отказ',
//			input: 'text',
//			inputValue: title,
//			inputValidator: (value) => {
//				if(!value)
//				{
//					return 'Полето не може да е празно!'
//				}
//			},
//
//		}).then((result) => {
//			title = result.value;
//			if (title) {
//          calendar.addEvent({
//            title: title,
//            start: arg.start,
//            end: arg.end,
//            allDay: arg.allDay,
//            description: "Something"
//          })
//        }
//        calendar.unselect()
//		});

          const inputOptions = new Promise((resolve) => {
              setTimeout(() => {
                resolve({
                  '#ff0000': 'Червено',
                  '#00ff00': 'Зелено',
                  '#0000ff': 'Синьо'
                })
              }, 500)
            });

          Swal.mixin({
              confirmButtonText: 'Напред &rarr;',
              cancelButtonText: 'Отказ',
              showCancelButton: true,
              progressSteps: ['1', '2', '3']
            }).queue([
              {
                title: 'Въведи заглавие на събитието',
                  input: 'text',
                    inputValidator: (value) => {
                        if(!value)
                        {
                            return 'Полето не може да е празно!'
                        }
			         },
              },
              {
                  title: 'Въведи описание на събитието',
                  text: 'Не е задължително.',
                  input: 'textarea'
              },
              {
                  title: 'Избери цвят за събитието',
                  input: 'radio',
                  inputOptions: inputOptions,
                  inputValidator: (value) => {
                    if (!value) {
                      return 'Полето не може да е празно!'
                    }
                  }
              }
            ]).then((result) => {

                if (result.value != undefined) {
                    title = result.value[0];
                  calendar.addEvent({
                    title: title,
                    start: arg.start,
                    end: arg.end,
                    allDay: arg.allDay,
                    description: result.value[1],
                      color: result.value[2]
                  })
                }
              calendar.unselect();
            })
		
        
      },
      eventClick: function(arg) {
		Swal.fire({
  title: 'Сигурни ли сте, че искате да премахнете събитието?',
  type: 'warning',
  showCancelButton: true,
  cancelButtonText: 'Отказ',
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Изтрий!'
}).then((result) => {
  if (result.value) {
	  arg.event.remove()
    Swal.fire({
		position: 'top-end',
		title: 'Изтрито!',
        type: 'success',
        showConfirmButton: false,
        timer: 700
	})
  }
})
      },
      editable: true,
      dayMaxEvents: true, // allow "more" link when too many events
      events: []
    });
	
    calendar.render();
	
  });
