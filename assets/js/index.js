const cityEl = document.getElementById('cityInput');

//handled the submit of the city search
function handleSubmit(event) {
    event.preventDefault();
    const city = document.getElementById('city').value;
    search(city);
}

function search(city) {
    if(!city || city.length < 2) {
        errorBox.textContent = "Please enter a valid city name and try again."
        return;
    }
    const apiKey = '1d06b7c740fb5f44ff9ef2d948306601';
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
    fetch(url)
    .then(function(resp) {
        return resp.json();
    })
    .then(function(data) {
        const lat = data[0].lat;
        const lon = data[0].lon;
        fiveDay(lat, lon);
    })
    .catch(function(error) {
        console.error("Error: ", error)
    });
}

function fiveDay(lat, lon) {
    const APIKey = '1d06b7c740fb5f44ff9ef2d948306601';
    const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`
    fetch(url)
        .then(function(resp) {
            return resp.json();
        })
        .then(function(data) {
            let fiveDayArr = [];
            
        })
    }

//listener for the 'submit' on the city search
cityEl.addEventListener('submit', handleSubmit)