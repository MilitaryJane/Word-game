'use strict'

let levels = [];
levels[0] = {
    word: 'ИНФОРМАТИКА',
    newWord: [
        'романтика', 'аниматор', 'иномарка', 'романтик', 'инфаркт', 'камфора', 'кариота', 'каротин', 'картина', 'комната', 'криофит', 'марафон', 'намотка', 'натирка', 'окраина', 'ритмика', 'фанатик',
        'фонарик', 'формиат', 'аконит', 'анатом', 'анорак', 'аромат', 'карман', 'картон', 'катран', 'кафтан', 'микрон', 'морфин', 'ратник', 'тиамин', 'трафик', 'фактор', 'фантом', 'фараон', 'фианит', 'формат', 
        'антик', 'аорта', 'аркан', 'икона', 'икота', 'камин', 'канат', 'карат', 'карма', 'карта', 'комар', 'корма', 'кофта', 'манок', 'марка', 'минор', 'матка', 'минор', 'митра', 'накат', 'нимфа', 'нитка',
        'норма', 'октан', 'отара', 'ринит', 'рифма', 'роман', 'таран', 'тариф', 'тиара', 'тимин', 'тиран', 'тоник', 'трико', 'факир', 'фанат', 'финик', 'фирма', 'форма', 'франк', 'франт', 'фронт', 'арак',
        'арка', 'арфа', 'атом', 'икра', 'инок', 'кант', 'карт', 'кино', 'кома', 'корм', 'корт', 'кофр', 'кран', 'крот', 'мара', 'март', 'мина', 'мини', 'мира', 'мирт', 'мрак', 'нарт', 'нора', 'нота', 'окат',
        'омар', 'рама', 'ритм', 'рота', 'танк', 'тара', 'таро', 'тина', 'тмин', 'торф', 'трак', 'трио', 'трон', 'факт', 'фант', 'фара', 'фата', 'фора', 'форт', 'фрак', 'фтор', 'акр', 'акт', 'ара', 'арк', 'ион',
        'кар', 'кит', 'ком', 'кот', 'мак', 'мат', 'мир', 'миф', 'мор', 'мот', 'ник', 'рак', 'риф', 'рок', 'ром', 'рот', 'тан', 'тик', 'тир', 'тиф', 'ток', 'том', 'тон', 'три', 'фон', 'ар', 'ми', 'ом', 'ор',
        'фа'],
    wordDefinition: [
        'То, что содержит идеи и чувства, эмоционально возвышающие человека.', ' Художник, создающий мультфильмы.', 'Легковой автомобиль зарубежного производства.', 'Человек, проникнутый высокими чувствами.', 
        'Прекращение тока крови при спазме артерий.', 'Прозрачное с сильным специфическим запахом вещество.', 'Род пальм.', 'Растительный пигмент.', 'Произведение живописи.', 'Отдельное помещение для жилья в квартире.',
        'Растение сухих и холодных местообитаний.', 'Дисциплина лёгкой атлетики.', 'Накручивание.', 

    ]
};
levels[1] = {
    word: 'ПАРАГРАФ',
    newWord: ['графа', 'агар', 'арап', 'арфа', 'граф', 'пара', 'фара', 'ара', 'пар', 'ар', 'га', 'па', 'фа']
};
levels[2] = {
    word: 'ПРОГРЕСС',
    newWord: ['пресс', 'серсо', 'спрос', 'горе', 'перо', 'перс', 'песо', 'репс', 'серп', 'спор', 'пес', 'рог', 'сор', 'го', 'ер', 'ор', 'ре']
}


const POINTS_HELP_ALL_WORD = 5;
const POINTS_HELP_DEFINITION = 1;

let modulLevel = document.querySelector('.modul-level');

let gameField = document.querySelector('.game-field');
let gameVersionField = document.querySelector('.game-version-field');
let gameResultField = document.querySelector('.game-result-field');
let currentResponseArray = [];
let arrayCurrentEvents = [];
    


let levelsButton = document.querySelectorAll('.level');
for (let i = 0; i < levelsButton.length; i++) {
    levelsButton[i].questWord = levels[i].word;
    levelsButton[i].arrayNewWords = levels[i].newWord;
    levelsButton[i].addEventListener('change', function (evt) {

        (function() {
            modulLevel.classList.add('hidden');
        })();

        let buttons = [];
        for(let i = 0; i < this.questWord.length; i++) {
            buttons[i] = document.createElement('input');
            buttons[i].type = 'submit';
            buttons[i].value = this.questWord[i];
            buttons[i].textContent = this.questWord[i];
            gameField.appendChild(buttons[i]);

        };
        currentResponseArray = evt.target.arrayNewWords;     
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


// функция вызова подсказки: показать слово
function getHelpAllWord() {
    if(scoringPoints(POINTS_HELP_ALL_WORD)) {
    getResult(getRandomElement(currentResponseArray));
    statistics.helpCount++;
    console.log(statistics.helpCount);
    count();
    }
}

// функция достает рандомный элемент из массива слов
function getRandomElement(array) {
    let index = Math.floor(Math.random() * ((array.length - 1) - 0 + 1));
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




//______поле статистики_______
let statistics = {
    answerCount: 0,
    questCount: currentResponseArray.length,
    helpCount: 0,
    points: 0
}

let countAnswerWord = document.querySelector('.count-answer-word');
let questWord = document.querySelector('.count-quest-word');
let countHelp = document.querySelector('.count-help');
let points = document.querySelector('.points');


//функция обновления статистической информации
function count() {
    statistics.answerCount++;
    countAnswerWord.textContent = statistics.answerCount;
    questWord.textContent = currentResponseArray.length;
    countHelp.textContent = statistics.helpCount;
    points.textContent = statistics.points;
    
};

