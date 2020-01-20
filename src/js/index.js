'use strict'
window.addEventListener('DOMContentLoaded', checkName);




const POINTS_HELP_ALL_WORD = 5;
const POINTS_HELP_DEFINITION = 1;

let modulLevel = document.querySelector('.modul-level');

let gameField = document.querySelector('.game-field');
let gameVersionField = document.querySelector('.game-version-field');
let gameResultField = document.querySelector('.game-result-field');
let currentResponseArray = [];
let arrayCurrentEvents = [];
let currentLevel;
let lvls = [];
let isComplete = false;

const REQUEST_URL = './data';



let levelsButton = document.querySelectorAll('.level');

for (let i = 0; i < levelsButton.length; i++) {
    levelsButton[i].addEventListener('change', function (evt) {

        (function() {
            modulLevel.classList.add('hidden');
        })();

        currentLevel = i + 1;

        

        fetch(`${REQUEST_URL}/${i}.json`)
            .then(response => {
                if(response.ok) {
                    response.json()
                        .then( result => {
                            this.questWord = result.word;
                            this.arrayNewWords = result.newWord;
                            let buttons = [];
                            for(let i = 0; i < this.questWord.length; i++) {
                                buttons[i] = document.createElement('input');
                                buttons[i].type = 'submit';
                                buttons[i].value = this.questWord[i];
                                buttons[i].textContent = this.questWord[i];
                                gameField.appendChild(buttons[i]);
                    
                            };
                            currentResponseArray = evt.target.arrayNewWords;  

                            dataUpdating();
                            staticticsUpdating();
                        })

                }
            }) 

   
    });    
    
}

gameField.addEventListener('click', function(evt) {
    if (evt.target.value != undefined) {
        gameVersionField.textContent += evt.target.value;
        evt.target.disabled = true;
        window.currentEvent = evt.target;
        arrayCurrentEvents.push(window.currentEvent);
        
    }
    if(checkIt(gameVersionField.textContent)) {
        getResult(gameVersionField.textContent);
        

        (function(str){
            for (let i = 0; i < currentResponseArray.length; i++) {
                if(str.toLowerCase() == currentResponseArray[i]){
                    currentResponseArray.splice(i--, 1);
                    getPoints(str);
                }
                if(currentResponseArray.length == 0) {
                    alert('Поздравляем! Все слова на этом уровне отгаданы!'); // тут нужно сделать попап 
                    isComplete = true;
                } 
            }
        })(gameVersionField.textContent);
        
        eraseAll();
        count();
    }
});


let buttonEraseLetter = document.querySelector('.erase-letter');
buttonEraseLetter.addEventListener('click', eraseLetter);

let buttonEraseAll = document.querySelector('.erase-all');
buttonEraseAll.addEventListener('click', eraseAll);

let buttonHelpDefinition = document.querySelector('.help-definition');
buttonHelpDefinition.addEventListener('click', getHelpDefinition);

let buttonHelpAllWord = document.querySelector('.help-all-word');
buttonHelpAllWord.addEventListener('click', getHelpAllWord);
    
// функция удаляет последнюю букву из поля ввода и снимает с соответствующей кнопки-буквы свойство disabled
function eraseLetter() {
    gameVersionField.textContent = gameVersionField.textContent.slice(0,-1);
    notDisabledOne();
}

//функция отменяет свойство disabled у последней кнопки-буквы
function notDisabledOne() {
    if (arrayCurrentEvents.length - 1 >= 0){
        arrayCurrentEvents[arrayCurrentEvents.length - 1].disabled = false;
        arrayCurrentEvents.splice(-1);
    }
}

//функция обнуляет поле ввода и снимает со всех кнопок-букв свойство disabled
function eraseAll() {
    gameVersionField.textContent = '';
    notDisabledAll();
}


//функция отменяет свойство disabled у всех кнопок-букв
function notDisabledAll() {
    for (let i = 0; i < arrayCurrentEvents.length; i++) {
        arrayCurrentEvents[i].disabled = false;
    }
    arrayCurrentEvents = [];
}
     

// функация проверяет существование введенного слова
function checkIt(str) {
    for (let i = 0; i < currentResponseArray.length; i++) {
        if(str.toLowerCase() == currentResponseArray[i]){
            return true;
        }
    }
}

// функция отправляет слово в поле правильных ответов
function getResult(string) {
    gameResultField.textContent += ' ' + string.toUpperCase();
}

function getDefinition(key) {
    fetch('./data/vocabulary.json')
        .then(response => {
            if(response.ok) {
                response.json()
                    .then( result => {
                        alert(result[key]);
                    })
            } else {
                alert ('Что-то пошло не так...');
            }
        })
    
}

// функция вызова подсказки: показать слово
function getHelpAllWord() {
    if(scoringPoints(POINTS_HELP_ALL_WORD)) {
        getResult(getRandomElement(currentResponseArray));
        statistics.helpCount++;
        count();
    }
}

// функция вызова подсказки: показать определение
function getHelpDefinition() {
    if(scoringPoints(POINTS_HELP_DEFINITION)) {
        getDefinition(currentResponseArray[getRandom(currentResponseArray)]);
        statistics.helpCount++;
        statistics.answerCount--;
        count();
    }
}

// функция cоздает рандомный индекс
function getRandom(array) {
    let index = Math.floor(Math.random() * ((array.length - 1) - 0 + 1));
    return index;
}


// функция достает рандомный элемент из массива слов
function getRandomElement(array){
    let index = getRandom(array);
    let currentElement = array[index];
    array.splice(index, 1);
    return currentElement;
}


// функция проверяет достаточность очков, и списывает их
function scoringPoints(num) {
    if (statistics.points < num) {
        alert('У Вас недостаточно очков');
        return false;
    } else {
        statistics.points -= num;
        return true;
    }

}
// функция начисляет очки за отгаданное слово
function getPoints(str){
    statistics.points += str.length;
}


// функция создает объект и заполняет его данными уровня
class Level {
    constructor() {
        this.answerCount = statistics.answerCount;
        this.currentResponseArray = currentResponseArray;
        this.helpCount = statistics.helpCount;
        this.points = statistics.points;
        this.answers = gameResultField.textContent;
        this.isComplete = isComplete;
    }
}


//______поле статистики_______
let statistics = {};


let countAnswerWord = document.querySelector('.count-answer-word');
let questWord = document.querySelector('.count-quest-word');
let countHelp = document.querySelector('.count-help');
let points = document.querySelector('.points');


//функция обновления статистической информации
function count() {
    statistics.answerCount++;
    staticticsUpdating()
    saveData();
    
};


// ___________________________________________






let player = document.querySelector('.player');
const modulSign = document.querySelector('.modul-sign');
const overlay = document.querySelector('.modul-overlay');

function checkName() {
    checkLvlOnClose();
    if (!localStorage.userName) {
        modulSign.classList.remove('modul-sign-hide')
        overlay.classList.remove('modul-overlay-hide')
        const button = document.querySelector('.buttonSend');
        button.addEventListener('click', getNewUser);
    } else {
        player.textContent = localStorage.userName;
        
    }
}


//функция создает в локал сторадж имя нового пользователя и передает его имя в строку с именем игрока
function getNewUser(evt) {
    evt.preventDefault();
    location.reload();
    let userName = document.querySelector('#inputname').value;
    localStorage.setItem('userName', userName);
    player.textContent = localStorage.userName;
    modulSign.classList.add('modul-sign-hide')
    overlay.classList.add('modul-overlay-hide')

}

const changePlayerButton = document.querySelector('.change-player-button');
changePlayerButton.addEventListener('click', function(evt) {
    evt.preventDefault();
    let question = confirm('Прогресс игры буде потерян. Вы уверены, что хотите сменить игрока?');
    if(question) {
        localStorage.clear();
        checkName();
    }
})



// функция сохраняет данные в localStorage
function saveData() {
    lvls[currentLevel - 1] = new Level();

    localStorage.setItem(`level${currentLevel}`, JSON.stringify(lvls[currentLevel - 1]));

}




// функция обновляет данные из localStorage
function dataUpdating() {
    let level = {};

    if(localStorage[`level${currentLevel}`]) {
        level = JSON.parse(localStorage[`level${currentLevel}`]);
    } 

    statistics.answerCount = +level.answerCount || 0;
    currentResponseArray = level.currentResponseArray || currentResponseArray;
    statistics.helpCount = +level.helpCount || 0;
    statistics.points = +level.points || 0;
    gameResultField.textContent = level.answers || '';
}

// функция обновляет выведенные статистический данные
function staticticsUpdating() {
    countAnswerWord.textContent = statistics.answerCount;
    questWord.textContent = currentResponseArray.length;
    countHelp.textContent = statistics.helpCount;
    points.textContent = statistics.points;
}


function checkLvlOnClose() {

    let count = 0;
    for(let i = 1; i <= levelsButton.length; i++) {
        if (localStorage[`level${i}`]) {
            if (JSON.parse(localStorage[`level${i}`]).isComplete) {
                count++;
            }
        }
    }
    levelsButton[count + 1].disabled = false;
}
