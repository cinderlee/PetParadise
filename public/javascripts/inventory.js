const React = require('react');
const ReactDOM = require('react-dom');
const MyInventory = require('./components/MyInventory');

function main(){
	const inventoryRequest = new XMLHttpRequest();
	inventoryRequest.open('GET', '/inventory');
	inventoryRequest.addEventListener('load', function(evt){
		if (inventoryRequest.status >= 200 && inventoryRequest.status < 300){
			const items = JSON.parse(inventoryRequest.responseText);
            console.log(items, 'herro');
            ReactDOM.render(<MyInventory inventory={items} />, document.querySelector('#inventoryList'));
		}
	});

	inventoryRequest.send();
}


document.addEventListener("DOMContentLoaded", main);
