// Initial caps function
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var form = document.createElement('form');
form.id = 'form-1';
form.className = 'dropdown-form';

var inputDrop = document.createElement('select');
inputDrop.className = "dropdowns";
form.appendChild(inputDrop); // append initial inputDrop to form

var opt1 = document.createElement('option');
var opt2 = document.createElement('option');
opt1.value = 'option1';
opt2.value = 'option2';
opt1.innerHTML = "Option 1";
opt2.innerHTML = "Option 2";
inputDrop.appendChild(opt1);
inputDrop.appendChild(opt2);

form.appendChild(inputDrop); // append updated inputDrop to form
document.body.appendChild(form); // add form to the document

var inputDrop2 = document.createElement('select');
inputDrop2.className = "dropdowns";
form.appendChild(inputDrop2);

/* array of length 7 to hold drop down <option> tags.
* one for blank initial and 6 for shape sides.
*/
var inputOpts = new Array(7);
inputOpts[0] = document.createElement('option');
inputOpts[0].value = 'blank-initial';
inputOpts[0].innerHTML = ""; // initialize first option to be blank
inputDrop2.appendChild(inputOpts[0]);

/*inputOpts[1] = document.createElement('option');
inputOpts[1].value = 'option1drop2';
inputOpts[1].innerHTML = "Test this shit";
inputDrop2.appendChild(inputOpts[1]);*/

for(i = 1; i < 7; i++){
  //var converter = require('number-to-words');

  //var numWord = converter.toWords(i+2);
  inputOpts[i] = document.createElement('option');
  inputOpts[i].value = "test" + "_sides";
  inputOpts[i].innerHTML = "Test" + " Sides";
  inputDrop2.appendChild(inputOpts[i]);
}

inputDrop.addEventListener('change', function() {
  alert("nice");
});
