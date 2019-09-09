function gameResult(){
    const gameRequest = new XMLHttpRequest();
    gameRequest.open('POST', '/confirmAnswers');
    gameRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let answers = "";
    for(let i = 0; i < 10; i++){
        console.log(document.querySelector(`#prob${i}`).value)
        answers += `prob${i}=${document.querySelector(`#prob${i}`).value}`;
        if (i !== 9){
            answers+="&"
        }
    }
	gameRequest.addEventListener('load', function(evt){
        if (gameRequest.status >= 200 && gameRequest.status < 300){
            const resultBox = document.querySelector('#result');
            const gameRes = JSON.parse(gameRequest.responseText);
            const resultMessage = document.createTextNode(gameRes);
            resultBox.appendChild(resultMessage);
            resultBox.appendChild(document.createElement('br'));
            document.querySelector('#problems').setAttribute('style', 'display: none');
            resultBox.setAttribute('style', 'display: inline-block');
            const playAgain = document.createElement('a');
            playAgain.setAttribute('href', '/minigame');
            playAgain.appendChild(document.createTextNode("Play Again!"));
            resultBox.appendChild(playAgain);
        }
    });
	gameRequest.send(answers);
}

function main(){
    document.querySelector("#gameButton").addEventListener('click', function(){
        gameResult();
    })
}


document.addEventListener("DOMContentLoaded", main);
