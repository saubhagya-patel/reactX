const startGameButton=document.getElementById('startGameButton');
const gameBox=document.getElementById('game-box');
const entryBox=document.getElementById('entry-box');
const resultBox=document.getElementById('result-box');
const messageBox=document.getElementById('message-box');
const countdownElement = document.getElementById('timer-box');
const body=document.getElementById('test');
let difficulty = document.getElementById('difficulty').value;
let iterations = document.getElementById('iterations').value;
const intermediateReactionTime=[];
const intermediateHeights=[];
const intermediateWidths=[];
const intermediateDistances=[];
const intermediateSpeeds=[];
const bgColor=["#56b4e9","#42ffa7","#242124"]
const circleColor=["#e69f00","a3f742","#1f1f1f"]
const difficultyArray=["70px","50px","30px"];
const circle=document.getElementById('circle')

startGameButton.addEventListener('click', function() {
    difficulty = document.getElementById('difficulty').value;
    iterations = document.getElementById('iterations').value;
    if(!iterations) {
        iterations=3;
    }
    entryBox.remove();
    messageBox.remove();
    countdown(2);
});

function countdown(seconds) {
    let remainingSeconds = seconds;
    countdownElement.innerHTML = `<p class="lead">The countdown begins be ready...</p>${remainingSeconds}`;

    const intervalId = setInterval(function() {
        remainingSeconds--;
        countdownElement.innerHTML = `<p class="lead">The countdown begins be ready...</p>${remainingSeconds}`;
        if (remainingSeconds <= 0) {
            playBeep();
            clearInterval(intervalId);
            startGame();
        }
    }, 1000);
}

function playBeep() {
    let audio=document.getElementById('audio-player');
    audio.play();
}
function calculateDistance(x1, y1, x2, y2) {
    let xDistance=(x1-x2)**2;
    let yDistance=(y1-y2)**2;
    let distance = (xDistance+yDistance)**(1/2);
    let roundedDistance = Math.round(distance * 100) / 100;
    intermediateDistances.push(roundedDistance);
}

function startGame() {
    countdownElement.remove();
    body.style.backgroundColor=bgColor[difficulty];
    circle.style.backgroundColor=circleColor[difficulty];
    gameBox.style.display='block';
    circle.style.height=difficultyArray[difficulty];
    gameLogic();
}

function generateRandomNumber(start, end) {
    const min=start;
    const max=end;
    let randomNumber = Math.floor(Math.random()*(max-min+1)) + min;
    return randomNumber;
}

let startTime;
function makeDivAtRandomLocation() {
    let maxWidth=window.innerWidth;
    let maxHeight=window.innerHeight;
    let newHeight=generateRandomNumber(1,maxHeight);
    let newWidth=generateRandomNumber(1,maxWidth);
    intermediateHeights.push(newHeight);
    intermediateWidths.push(newWidth);
    circle.style.top=newHeight+"px";
    circle.style.left=newWidth+"px";
    startTime=Date.now();
}

function returnAverageOfArray(arr) {
    let sm=0;
    arr.forEach(element => {
        sm+=element;
    });
    let avg= (sm/arr.length);
    let roundedAvg = Math.round(avg * 100) / 100;
    return roundedAvg;
}

circle.addEventListener("click", ()=> {
    let endTime=Date.now();
    let elapsedTime=endTime-startTime;
    intermediateReactionTime.push(elapsedTime/1000)
})

async function gameLogic() {
    for(let i=0; i<iterations; i++) {
        makeDivAtRandomLocation();
        await waitForClick();
    }
    calculateIntermediateDistances();
    calculateIntermediateSpeeds();
    endGame();
}

function waitForClick() {
    return new Promise(resolve => {
        circle.addEventListener("click",()=> {   
            resolve();
        },{once:true});
    });
}

function calculateIntermediateDistances() {
    let initialWidth=startGameButton.offsetLeft;
    let intialHeight=startGameButton.offsetTop;
    calculateDistance(intialHeight, initialWidth, intermediateHeights[0], intermediateWidths[0]);
    for(let i=1; i<iterations; i++) {
        calculateDistance(intermediateHeights[i-1], intermediateWidths[i-1], intermediateHeights[i], intermediateWidths[i]);
    }
}

function calculateIntermediateSpeeds() {
    for(let i=0; i<intermediateDistances.length; i++) {
        let speed=intermediateDistances[i]/intermediateReactionTime[i];
        let roundedSpeed = Math.round(speed * 100) / 100;
        intermediateSpeeds.push(roundedSpeed);
    }
}

function endGame() {
    gameBox.remove();
    body.style.backgroundColor='';
    circle.style.backgroundColor='';
    resultBox.style.display='block';
    showResult();
    showAverage();
}

function showResult() {
    let table = document.createElement('table');
    let headerRow = table.createTHead().insertRow();
    headerRow.innerHTML = '<th>Intermediate Distances(pixels)</th><th>Intermediate Reaction Times(sec)</th><th>Intermediate Speeds(pixels/sec)</th>'
    let tbody=document.createElement('tbody');
    table.appendChild(tbody);

    for (let i = 0; i < iterations; i++) {
        let row = tbody.insertRow(); 

        let cell1 = row.insertCell();
        let cell2 = row.insertCell();
        let cell3 = row.insertCell();
        
        cell1.textContent = intermediateDistances[i];
        cell2.textContent = intermediateReactionTime[i];
        cell3.textContent = intermediateSpeeds[i];
    }
    table.classList.add('table');
    table.classList.add('table-striped');
    table.classList.add('table-bordered');
    document.getElementById('tableContainer').appendChild(table);
}

function showAverage() {
    let table = document.createElement('table');
    let headerRow = table.createTHead().insertRow();
    headerRow.innerHTML = '<th>Average Distance(pixels)</th><th>Average Reaction Time(sec)</th><th>Average Speed(pixels/sec)</th>'
    let tbody=document.createElement('tbody');
    table.appendChild(tbody);
    let row=tbody.insertRow();
    let cell1=row.insertCell();
    let cell2=row.insertCell();
    let cell3=row.insertCell();

    let avgDistance = returnAverageOfArray(intermediateDistances);
    let avgTime = returnAverageOfArray(intermediateReactionTime);
    let avgSpeed=avgDistance/avgTime;
    let roundedSpeed = Math.round(avgSpeed * 100) / 100;

    cell1.textContent = avgDistance;
    cell2.textContent = avgTime;
    cell3.textContent = roundedSpeed;

    table.classList.add('table');
    table.classList.add('table-striped');
    table.classList.add('table-bordered');
    document.getElementById('avgTableContainer').appendChild(table);   
}