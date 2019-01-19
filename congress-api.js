const xhr = new XMLHttpRequest(),
baseURL = 'https://api.propublica.org/congress/v1/statements/search.json?query=',
TEXT = document.getElementById('each-text'),
BUTTONMORE = document.getElementById('api-button'),
BUTTONSEARCH = document.getElementById('search-button'),
LINKS = document.getElementsByTagName('a'),
SPEED = 30,
INTRO = document.getElementById('text-intro'),
RESULTSNUMBER = document.getElementById('results-number'),
TITLEWORD = document.getElementById('h1-span'),
SELECTOR = document.getElementById('selection'),
DIVFILTER = document.getElementById('close-this'),
CLEANFILTER = document.getElementById('clean-filter');

let subject = 'water',
state = '',
offset = 0,
searchQuery = document.getElementById('search'),
stateQuery = document.getElementById('state'),
textIntro = `Type something ☝️. If you want, you can also filter the search by state (instead of the full name, use the abbreviation. Like MO for Missouri).`,
h = 0,
numberofresults = 0;

TITLEWORD.innerHTML = subject;

var typeLike = () => {
  if(h < textIntro.length) {
    INTRO.innerHTML += textIntro.charAt(h);
    h++;
  }
  setTimeout(typeLike, SPEED);
}

typeLike();

var apiResults = (results) => {

  for(let i = 0; i < results.length; i++) {
    TEXT.innerHTML += `<div class='announcement'>
    <p class='p-date'>${results[i].date}</p>
    <p class='p-name ${results[i].party}'><span>${results[i].name}</span> <span class="${results[i].party}">${results[i].party}-${results[i].state}</span></p> <p class="p-party-chamber">${results[i].chamber}</p>
    <a href='${results[i].url}'>${results[i].title}</a>
    <p class='p-type'>Type: ${results[i].statement_type}</p></div>`;
  }
}

var callThatApi = () => {

  xhr.open('GET', `${baseURL}${subject}&offset=${offset}`);
  xhr.setRequestHeader('X-API-Key', config.API_KEY);
  xhr.send();
  xhr.onload = handleSuccess;
  xhr.onerror = handleError;

  function handleSuccess(state) {

    let response = JSON.parse(xhr.responseText),
    results = response.results,
    filterResults = [];

    if (stateQuery.value.length == 0) {

      apiResults(results);

      console.log(results);

    } else {

      for (var i = 0; i < results.length; i++) {

        if (results[i].state === stateQuery.value) {

          filterResults.push(results[i]);

        } else {

        }
      }
      apiResults(filterResults);
      console.log("sfa", filterResults.length);
      newresults = filterResults.length;
      numberofresults += newresults;
      RESULTSNUMBER.style.display = 'block';
      RESULTSNUMBER.innerText = `The number of statements related to your search is ${numberofresults}. Click on the button below to see older statements.`;
      CLEANFILTER.innerText = stateQuery.value;
      SELECTOR.style.display = 'block';
    }

  }

  function handleError() {
    console.log('fail');
  }

  // function callThatApi ends here
}

callThatApi();

BUTTONSEARCH.addEventListener('click', function() {
  TEXT.innerHTML = '';
  TITLEWORD.innerHTML = '';
  subject = searchQuery.value;
  state = stateQuery.value;
  TITLEWORD.innerHTML = subject;
  RESULTSNUMBER.innerText = '';
  callThatApi();
});

DIVFILTER.addEventListener('click', function(){
  stateQuery.value = '';
  SELECTOR.style.display = 'none';
  RESULTSNUMBER.style.display = 'none';
  numberofresults = 0;
  callThatApi();
});

BUTTONMORE.addEventListener('click', function() {

  offset = offset + 20;

  callThatApi();
});
