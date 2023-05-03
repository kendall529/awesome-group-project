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


    fetch(triviaUrl)
    .then(function(response) {
        if (!response.ok) throw new Error('Ooops');
     
        console.log('response :>>', response);

        return response.json();
    })
    .then(function(data) {
        console.log('data :>>', data);

        renderQuestion(data.results);
    })
    .catch(function(error) {
        console.log(error);
    });

    function replaceUnicode(str) {
        var decodedStr = decodeURIComponent(str);
        return decodedStr.replace(/\\u([\dA-Fa-f]{4})/g, function(match, p1) {
          return String.fromCharCode(parseInt(p1, 16));
        }).replace(/&quot;/g, '"').replace(/&#039;/g, `'`).replace(/&ouml;/g, `ö`).replace(/&aacute;/g, `á`);
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

    var button1El = document.createElement('button');
    button1El.setAttribute('class', 'rounded-full shadow-md bg-amber-400 w-48 mx-auto');
    button1El.textContent = question.incorrect_answers[0];
    var button2El = document.createElement('button');
    button2El.setAttribute('class', 'rounded-full shadow-md bg-amber-400 w-48 mx-auto');
    button2El.textContent = question.correct_answer;
    var button3El = document.createElement('button');
    button3El.setAttribute('class', 'rounded-full shadow-md bg-amber-400 w-48 mx-auto');
    button3El.textContent = question.incorrect_answers[2];
    var button4El = document.createElement('button');
    button4El.setAttribute('class', 'rounded-full shadow-md bg-amber-400 w-48 mx-auto');
    button4El.textContent = question.incorrect_answers[1];

    answerContainerEl.append(button1El, button2El, button3El, button4El);
    

    cardEl.append(questionEl, answerContainerEl);
    // return the question card
    return cardEl;
}

function renderQuestion(questions) {
    // get quiz container
    var quizContainer = document.getElementById('quiz');
    // loop over questions
    for(var i = 0; i < questions.length; i++) {
        // create a question card for each loop
        var questionCard = createQuestion(questions[i]);
        // append question card to body
        quizContainer.append(questionCard);
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