const React = require('react');
const ReactDOM = require('react-dom');
const MyPets = require('./components/MyPets');

function main(){
	const petRequest = new XMLHttpRequest();
	petRequest.open('GET', `/displayPets`);
	petRequest.addEventListener('load', function(evt){
		if (petRequest.status >= 200 && petRequest.status < 300){
			const pets = JSON.parse(petRequest.responseText);
			ReactDOM.render(<MyPets pets={pets}/>, document.querySelector('#pets'));
		}
	});

	petRequest.send();
}


document.addEventListener("DOMContentLoaded", main);
