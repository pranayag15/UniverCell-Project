var myVar, b;

function myFunction() {
  console.log("dcddd");
  
    myVar = setTimeout(showPage, 1000);
    b = setTimeout(bgcolor, 1000)
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("myDiv").style.display = "block";
}

// function change() {
//   setTimeout(bgcolor, 1000)
// }

function bgcolor(){
  document.body.style.backgroundColor = "white";
}

// function myAss(){
//   console.log("chal na");
  
// }