var catFactsUrl = 'https://cat-fact.herokuapp.com/facts';



fetch(catFactsUrl)
    .then(function(response) {
        if (!response.ok) throw new Error('Ooops');
     
        console.log('response :>>', response);

        return response.json();
    })
    .then(function(data) {
        console.log('data :>>', data);
    })
    .catch(function(error) {
        console.log(error);
    });


