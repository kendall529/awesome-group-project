
var dogPhotoUrl = 'https://dog.ceo/api/breeds/image/random';
// var triviaUrl = 'https://opentdb.com/api.php?amount=10&type=multiple'
var scoresList = JSON.parse(localStorage.getItem("highscores")) || []

function fetchDogImg() {
    fetch(dogPhotoUrl)
        .then(function (response) {
            if (!response.ok) throw new Error('Ooops');

            console.log('response :>>', response);

            return response.json();
        })
        .then(function (data) {
            console.log('data :>>', data);
            createDogImage(data)
        })

        .catch(function (error) {
            console.log(error);
        });
}

function createDogImage(dog) {
    var quizSection = document.getElementById('quiz');
    var imgEL = document.createElement('img');
    imgEL.setAttribute('src', dog.message);
    console.log(dog.message);
    imgEL.setAttribute('alt', 'cute-dog');
    imgEL.setAttribute('class', 'mx-auto w-64');
    quizSection.append(imgEL);
    return quizSection
}


function replaceUnicode(input) {
    if (!input) return input;

    // List the unicode characters you want to replace and their replacements
    const unicodeReplacements = {
        "&quot;": "\"",
        "&#039;": "\'",
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&ldquo;": "“",
        "&rdquo;": "”",
        "&eacute;": "é",
        "&shy;":"-",
    };

    return input.replace(/&[^;]+;/g, match => unicodeReplacements[match] || match);
}

var score = 0;

function createQuestion(question) {

    var cardEl = document.createElement('div');
    cardEl.setAttribute('class', 'shadow-slate-950 bg-slate-500 w-2/5 mx-auto rounded-md my-9 shadow-lg');
    // create the question element
    var questionEl = document.createElement('h5');
    var sentence = question.question;
    var newSentence = replaceUnicode(sentence);
    questionEl.textContent = newSentence;
    questionEl.setAttribute('class', 'text-center py-6');

    // create the answer buttons container
    var answerContainerEl = document.createElement('div');
    answerContainerEl.setAttribute('class', 'w-50 grid grid-cols-2 gap-5 py-8');

    // shuffle the answer options
    var answers = shuffleArray(question.incorrect_answers.concat(question.correct_answer));

    var scoreEl = document.getElementById('score');
    // create the answer buttons
    var correctAnswer = replaceUnicode(question.correct_answer);
    for (var i = 0; i < answers.length; i++) {
        var buttonEl = document.createElement('button');
        buttonEl.setAttribute('class', 'rounded-lg shadow-md bg-amber-400 w-48 mx-auto hover:shadow-xl hover:scale-105');
        //apply the unicode replacement function to the answers
        var answer = replaceUnicode(answers[i]);
        buttonEl.textContent = answer;
        // add event listener to each button
        buttonEl.addEventListener('click', function () {
            if (this.textContent === correctAnswer) {
                score += 10;
                scoreEl.textContent = 'Score: ' + score;
            } else {
                fetchDogImg();
            }
        });
        answerContainerEl.appendChild(buttonEl);
    }
    // append question and answer buttons to card
    cardEl.append(questionEl, answerContainerEl);
    // return the question card
    return cardEl;
}

// shuffle array function
function shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function fetchQuizResults(category) {
    var quizURL = 'https://opentdb.com/api.php?amount=10&category='

    // Fetch data from quizURL
    return fetch(quizURL + category)
        .then(function (res) {
            if (!res.ok) throw new Error('Ooops');
            return res.json();
        })
        .then(function (data) {
            return data.results;
        })
        .catch(function (error) {
            console.error(error);
        });
}

var startQuizButton = document.getElementById('start-quiz');

//Add a click event for Start Quiz button
startQuizButton.addEventListener('click', function (e) {
    e.preventDefault();

    // input elements by ID
    var setCategory = document.getElementById('category');
    // var setCategory = document.getElementById('category');
    // var setDifficulty = document.getElementById('difficulty');
    // Get values form input fields
    var category = setCategory.value;
    // var category = setCategory.value;
    // var difficulty = setDifficulty.value;

    // Create the URL for the fetch with the input values
    fetchQuizResults(category)
        .then(function (questions) {
            // debugging: check the fetch
            console.log('Questions array:', questions);
            renderQuestion(questions);
        })
        .catch(function (error) {
            console.error(error);
        });
    
    document.getElementById('score').textContent = 'Score: 0'

    var quizSection = document.getElementById('quiz');
    var previousImg = quizSection.querySelector('img');
    if(previousImg) {
        previousImg.remove();
    }
});

async function renderQuestion(questions, currentIndex = 0) {
    // debugging: Check questions array, currentIndex, and current question object
    console.log('Inside renderQuestion:>>', questions, currentIndex, questions[currentIndex]);

    // get quiz container
    var quizContainer = document.getElementById('quiz');
    var previousQuestion = quizContainer.querySelector('.quiz-card');
    if (previousQuestion) {
        previousQuestion.remove();
    }

    var quizSection = document.getElementById('quiz');
    var previousImg = quizSection.querySelector('img');
    if(previousImg) {
        previousImg.remove();
    }

    // debugging: Check if the question object is received as expected
    console.log('Current question object', questions[currentIndex]);

    // Pass the entire question object to createQuestion
    var questionCard = createQuestion(questions[currentIndex]);
    questionCard.classList.add('quiz-card');
    quizContainer.append(questionCard);

    var answerButtonPromises = [];
    var answerButtons = questionCard.querySelectorAll('button');
    for (var j = 0; j < answerButtons.length; j++) {
        answerButtonPromises[j] = new Promise(function (resolve) {
            answerButtons[j].addEventListener('click', createEventListener(j, resolve, questions, currentIndex));
        });
    }

    // waits for the nextButton click before going to the next iteration
    await Promise.race(answerButtonPromises);

    // call renderQuestion for the next index after a delay of 1000 milliseconds
    setTimeout(function () {
        if (currentIndex + 1 < questions.length) {
            renderQuestion(questions, currentIndex + 1);
        }
    }, 2000);
}

function createEventListener(j, resolve, questions, currentIndex) {
    var answerButtons = document.querySelectorAll('button');
    return function () {
        // remove event listener so it doesn't get called again
        answerButtons[j].removeEventListener('click', arguments.callee);
        // resolve the promise
        resolve();
        // go to next question if there are more questions
        if (currentIndex + 1 < questions.length) {
            renderQuestion(questions, currentIndex + 1);
        } else {
            window.location.href = './scoreboard.html'
        }
    }
}



    // As a user I want to take a trivia quiz
    // Acceptance Criteria
    // A question pops up with selectors for possible answers
    // If I get a question right I receive points
    // A photo of a dog shows up when click the wrong answer

    // As a user I want to see a beautiful landing page and overall website
    // Acceptance Criteria
    // A navbar at the top
    // A paragraph and header talking about our product
    // An anchor tag with "Start Quiz" inside that goes to the quiz section of app
    // An image relating to the product next to the paragraph

    // As a user I want to leave behind a record of my quiz score
    // Acceptance Criteria
    // A form that you can enter a name in
    // A spot that displays the score obtained on the quiz
    // A save button that then saves content to local storage
    // A card of previous scores is maintained

    // As a user each time I answer a question, a new photo of a dog pops up
    // Acceptance Criteria
    // The API is used to generate a different img src='' each time a question pops up


    // As a user I feel emotionally supported no matter how badly I do on the quiz
    // Acceptance Criteria
    // There's a dog image

    // As a user I can personalize my quiz
    // Acceptance Criteria
    // There are several inputs for number of questiions
    // category, difficulty, type i.e. mult choice or t/f

