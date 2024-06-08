const cityEl = document.getElementById('cityInput');

//handled the submit of the city search
function handleSubmit(event) {
    event.preventDefault();
    const city = document.getElementById('city').value;
    console.log(city);
}

//listener for the 'submit' on the city search
cityEl.addEventListener('submit', handleSubmit)