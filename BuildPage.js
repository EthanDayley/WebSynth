let input = document.createElement("simple-input");
let instrument = document.createElement("simple-instrument");
document.body.appendChild(input);
input.outputs.push(instrument);
document.body.appendChild(instrument);
