var dogPhotoUrl = 'https://dog.ceo/api/breeds/image/random';
// var triviaUrl = 'https://opentdb.com/api.php?amount=10&type=multiple'
var scoresList = JSON.parse(localStorage.getItem("highscores")) || []


function fetchDogImg() {
    fetch(dogPhotoUrl)
        .then(function (response) {
            if (!response.ok) throw new Error('Ooops');

            return response.json();
        })
        .then(function (data) {
            createDogImage(data)
        })

        .catch(function (error) {
            console.error(error);
        });
}

function createDogImage(dog) {
    var quizSection = document.getElementById('quiz');
    var imgEL = document.createElement('img');
    imgEL.setAttribute('src', dog.message);
    imgEL.setAttribute('alt', 'cute-dog');
    imgEL.setAttribute('class', 'mx-auto w-64');
    quizSection.append(imgEL);
    return quizSection
}


function replaceCallback(match, p1) {
  return unicodeReplacements[match] || p1;
}

function replaceUnicode(input) {
  const unicodeReplacements = {
    "&quot;": "\"",
    "&#039;": "'",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&ldquo;": "“",
    "&rdquo;": "”",
    "&eacute;": "é",
    "&shy;": "-",
    "&lrm;": " "
  };

  return input.replace(/&(#?\w+);/g, replaceCallback);
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
        buttonEl.setAttribute('class', 'rounded-lg shadow-md bg-orange-500 w-48 mx-auto hover:shadow-xl hover:scale-105');
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
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
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
            sessionStorage.setItem("currentScore", score);
            window.location.href = '#results'
        }
    }
}

var quizSection = document.getElementById("quiz");
var fixedElement = document.getElementById("score");

// Add a scroll event listener to the window object
window.addEventListener("scroll", function() {
  // Get the vertical position of the quiz section relative to the document
  var quizPosition = quizSection.offsetTop;
  
  // Toggle the visibility of the fixed element based on the vertical scroll position
  if (window.scrollY >= quizPosition) {
    fixedElement.style.display = "block";
  } else {
    fixedElement.style.display = "none";
  }
});


function storeScore() {
    const user = new Object;
    user.score = score;
    user.userName = username.value;
    
    localStorage.setItem("user", JSON.stringify(user))
    }

function updateScore() {
    const score = sessionStorage.getItem("currentScore")
    var scoreBoardScore = document.getElementById("ScoreboardScore");
    scoreBoardScore.innerHTML = "Score: " + score;
    sessionStorage.removeItem("currentScore")
};


var nameInput = document.getElementById("username");
var addResultButton = document.getElementById("save-result");
var list = document.getElementById("result-list");

// Retrieve the stored items from local storage when the page loads
window.addEventListener("load", function(e) {
    e.preventDefault();
  var storedResults = JSON.parse(localStorage.getItem("results"));
  
  // If stored items were found, create a new list item element for each item and add it to the list
  if (storedResults !== null) {
    for (var i = 0; i < storedResults.length; i++) {
      var newResult = document.createElement("li");
      newResult.textContent = storedResults[i];
      list.appendChild(newResult);
    }
  }
});

// Add a click event listener to the add item button
addResultButton.addEventListener("click", function(e) {
    e.preventDefault();
  // Get the value of the new item input and trim any leading/trailing whitespace
  var newResultText = nameInput.value.trim() + ' Score: ' + score;
  
  // Return from function early if the new item input is blank
  if (newResultText === "") {
    return;
  }
  
  // Create a new list item element and add the new item text to it
  var newResult = document.createElement("li");
  newResult.textContent = newResultText;
  
  // Add the new item element to the list
  list.appendChild(newResult);
  
  // Get the current array of items from local storage, or create an empty array if none is found
  var results = JSON.parse(localStorage.getItem("results")) || [];
  
  // Add the new item text to the array of items
  results.push(newResultText);

  // Set input text to be blank
  nameInput.value = '';
  
  // Store the updated array of items in local storage
  localStorage.setItem("results", JSON.stringify(results));


});


