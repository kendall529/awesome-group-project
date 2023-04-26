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

function createQuestion(question) {
    var cardEl = document.createElement('div');
    // cardEl.setAttribute('class', );

    var questionEl = document.createElement('h5');
    questionEl.textContent = question.question;

    var answerContainerEl = document.createElement('div');
    // answerContainerEl.setAttribute('class', )

    var button1El = document.createElement('button');
    // button1El.setAttribute('class', );
    button1El.textContent = question.incorrect_answers[0];
    var button2El = document.createElement('button');
    // button2El.setAttribute('class', );
    button2El.textContent = question.correct_answer;
    var button3El = document.createElement('button');
    // button3El.setAttribute('class', );
    button3El.textContent = question.incorrect_answers[2];
    var button4El = document.createElement('button');
    // button4El.setAttribute('class', );
    button4El.textContent = question.incorrect_answers[1];

    answerContainerEl.append(button1El, button2El, button3El, button4El);
    

    cardEl.append(questionEl, answerContainerEl);

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

