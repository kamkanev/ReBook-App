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
//            console.log(table.rows[0].id);
              var row = table.insertRow(0);
            var nid = table.rows[0].id = generateNextId(table.rows[1].id);//'task-'+(num+1);


            console.log(table.rows[0].id);
              var cell1 = row.insertCell(0);
              var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
              cell1.innerHTML = '<div class="form-check"><label class="form-check-label"><input class="form-check-input" type="checkbox"><span class="form-check-sign"></span></label></div>';
              cell2.innerHTML = res.value;

            cell3.innerHTML = '<td class="td-actions text-right"><button onclick="editTask(`'+nid+'`)" type="button" rel="tooltip" title="" class="btn btn-info btn-round btn-icon btn-icon-mini btn-neutral" data-original-title="Edit Task"><i class="now-ui-icons ui-2_settings-90"></i></button><button onclick="deleteTask(`'+nid+'`)" type="button" rel="tooltip" title="" class="btn btn-danger btn-round btn-icon btn-icon-mini btn-neutral" data-original-title="Remove"><i class="now-ui-icons ui-1_simple-remove"></i></button></td>';
        }
    });

}

function generateNextId(Tid){
    var cId = Tid.split('-')[1];
    var nId = parseInt(cId);

    return 'task-'+(nId+1);
}

async function deleteTask(Tid){

    console.log(Tid);

    var index = -1;

    for(var i = 0; i<table.rows.length; i++){
        if(table.rows[i].id == Tid){
            index = i;
            console.log(index);
            break;
        }
    }

    if(index != -1){
        table.deleteRow(index);
    }

}

async function editTask(Tid){
    console.log(Tid);
}
