     var table = document.getElementById("task-table");

async function createTask(){

    Swal.fire({
        input: 'text',
        showCancelButton: true,
        icon: 'question',
        title: 'Въведи задача'
    }).then((res) => {
        if(res.value){
//                  var table = document.getElementById("task-table");
//            var nid = generateNextId(table.rows[0].id);
                var num = table.rows.length;
            var nid = 'task-1';//'task-'+(num+1);
            if(num > 0){
                nid = generateNextId(table.rows[0].id);
            }
//            console.log(table.rows[0].id);
              var row = table.insertRow(0);

                table.rows[0].id = nid;

            console.log(table.rows[0].id);
              var cell1 = row.insertCell(0);
              var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
              cell1.innerHTML = '<div class="form-check"><label class="form-check-label"><input onclick="createForm(`'+ nid +'`, `update`)" id="'+nid+'-id" class="form-check-input" type="checkbox"><span class="form-check-sign"></span></label></div>';
              cell2.innerHTML = res.value;

            cell3.innerHTML = '<td class="td-actions text-right"><button onclick="editTask(`'+nid+'`)" type="button" rel="tooltip" title="" class="btn btn-info btn-round btn-icon btn-icon-mini btn-neutral" data-original-title="Edit Task"><i class="now-ui-icons ui-2_settings-90"></i></button><button onclick="deleteTask(`'+nid+'`)" type="button" rel="tooltip" title="" class="btn btn-danger btn-round btn-icon btn-icon-mini btn-neutral" data-original-title="Remove"><i class="now-ui-icons ui-1_simple-remove"></i></button></td>';

            //make form and
            createForm(nid, 'create');
        }
    });

}

function createForm(Tid, type){

  var id = Tid;
  var name = getRowById(Tid).cells[1].innerHTML;
  var isItChecked = document.getElementById( Tid+'-id' ).checked;

  console.log(id, name, isItChecked);

  var form = document.createElement('form');

  form.method = 'POST';
  if(type == 'create'){
    form.action = '/profile/addTask';
  }else if(type == 'update'){
    form.action = '/profile/updateTask';
  }else if(type == 'edit'){
    form.action = '/profile/editTask';
  }else if(type == 'delete'){
    form.action = '/profile/deleteTask';
  }

  var el1 = document.createElement('input');

  el1.value = id;
  el1.type = 'hidden';
  el1.name = 'id';
  form.appendChild(el1);

  var el2 = document.createElement('input');

  el2.value = name;
  el2.type = 'hidden';
  el2.name = 'name';
  form.appendChild(el2);

  var el3 = document.createElement('input');

  el3.value = isItChecked ? '+' : '-';
  // el3.value = '-';
  el3.type = 'hidden';
  el3.name = 'checked';
  form.appendChild(el3);

  document.body.appendChild(form);

  form.submit();

}

function generateNextId(Tid){
    var cId = Tid.split('-')[1];
    var nId = parseInt(cId);

    return 'task-'+(nId+1);
}

function getRowById(Tid){
    for(var i = 0; i < table.rows.length; i++){
        if(table.rows[i].id == Tid){
            return table.rows[i];
        }
    }
}

async function deleteTask(Tid){

    console.log(Tid);

    createForm(Tid, 'delete');

    var index = -1;

    // for(var i = 0; i<table.rows.length; i++){
    //     if(table.rows[i].id == Tid){
    //         index = i;
    //         console.log(index);
    //         break;
    //     }
    // }
    //
    // if(index != -1){
    //     table.deleteRow(index);
    // }

}

async function editTask(Tid){
    console.log(Tid);

    Swal.fire({
        input: 'text',
        showCancelButton: true,
        icon: 'question',
        title: 'Въведи задача',
        inputValue: getRowById(Tid).cells[1].innerHTML

    }).then((res) => {
        if(res.value){
            getRowById(Tid).cells[1].innerHTML = res.value;
            createForm(Tid, 'edit');
        }
    });
}
