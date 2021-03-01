function getColor() {
    var color = document.getElementById("colorP").value;

    return color;
}

function getSize() {

    var size = JSON.parse(document.getElementById('sizeP').value);

    if(size <= 0){
        size = 1;
        document.getElementById('sizeP').value = "1";
    }
    if(size >= 20){
        size = 20;
        document.getElementById('sizeP').value = "20";
    }

    return size;

}

function getType() {

  var typeButts = document.getElementsByName('brushType');

  var type = [];

  for(var i = 0; i < typeButts.length; i++){

    if(typeButts[i].checked){
      type = JSON.parse(typeButts[i].value);
      break;
    }

  }

  if(type < 0){
    return 0;
  }else{
    return 1;
  }

}

function getForm() {

  var typeButts = document.getElementsByName('brushType');

  var type = [];

  for(var i = 0; i < typeButts.length; i++){

    if(typeButts[i].checked){
      type = JSON.parse(typeButts[i].value);
      break;
    }

  }

  if(type < 0){
    return 0;
  }else{
    return type;
  }

}
