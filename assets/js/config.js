var dogPhotoUrl = 'https://dog.ceo/api/breeds/image/random';
var triviaUrl = 'https://opentdb.com/api.php?amount=10&type=multiple'


fetch(dogPhotoUrl)
    .then(function(response) {
        if (!response.ok) throw new Error('Ooops');
     
        console.log('response :>>', response);

        return response.json();
    })
    .then(function(data) {
        console.log('data :>>', data);

        var dump = document.createElement('pre');
        dump.textContent = JSON.stringify(data, null, 2);
        document.body.appendChild(dump);
    })
    .catch(function(error) {
        console.log(error);
    });


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
    // create the answer buttons
    for (var i = 0; i < answers.length; i++) {
      var buttonEl = document.createElement('button');
      buttonEl.setAttribute('class', 'rounded-lg shadow-md bg-amber-400 w-48 mx-auto hover:shadow-xl hover:scale-105');
      //apply the unicode replacement function to the answers
      var answer = replaceUnicode(answers[i]);
      buttonEl.textContent = answer;
      // add event listener to each button
      var scoreEl = document.getElementById('score');
      var score = 0;
      buttonEl.addEventListener('click', function() {
        if(this.textContent === question.correct_answer) {
            score += 10;
            scoreEl.textContent = 'Score: ' + score;
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

  // create a next button so that the quiz can be moved through
function createNextButton() {
    var nextButton = document.createElement('button');
    nextButton.setAttribute('class', 'rounded-lg shadow-md bg-cyan-500 w-48 mx-auto hover:shadow-md hover:shadow-slate-950 absolute bottom-0 right-24');
    nextButton.setAttribute('id', 'next-btn');
    nextButton.textContent = 'Next'

    var quizContainer = document.getElementById('quiz');
    quizContainer.append(nextButton);
}

createNextButton();

// async and await have enabled the function to go through one iteration of the loop at once and wait for the next button to be clicked
async function renderQuestion(questions) {
    // get quiz container
    var quizContainer = document.getElementById('quiz');
    // loop over questions
    for(var i = 0; i < questions.length; i++) {
        //remove the previously created card
        var previousQuestion = quizContainer.querySelector('.quiz-card');
        if(previousQuestion) {
            previousQuestion.remove();
        }
        // create a question card for each loop
        var questionCard = createQuestion(questions[i]);
        // add a class to card so it can be identified for removal
        questionCard.classList.add('quiz-card');
        // append question card to body
        quizContainer.append(questionCard);

    var nextButtonPromise = new Promise(function(resolve) {
        var nextButton = document.getElementById('next-btn');
        nextButton.addEventListener('click', function() {
            // remove event listener so it doesn't get called again
            nextButton.removeEventListener('click', arguments.callee);
            //resolve the promise
            resolve();
        });
    });
    // gets the function to wait for the nextButton click before going to the next iteration
    await nextButtonPromise;
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

