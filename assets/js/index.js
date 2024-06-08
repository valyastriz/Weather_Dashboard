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
        fiveDay(lat, lon, city);
    })
    .catch(function(error) {
        console.error("Error: ", error)
    });
}

function fiveDay(lat, lon, city) {
    const APIKey = '1d06b7c740fb5f44ff9ef2d948306601';
    const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`
    fetch(url)
        .then(function(resp) {
            return resp.json();
        })
        .then(function(data) {
            console.log(data);
            let fiveDayArr = [];
            data.list.forEach((item, index) => {
                if (index % 8 === 0) { // if the index number is exactly divisible by 8 (there are 8 indices for each day so we only need one, then take the info from that index)
                    const tempF = (item.main.temp - 273.15) * 9/5 + 32; // converting from kelvin to farenhight
                    // newDate = item.dt.text
                    fiveDayArr.push({
                        // cityName: 
                        city: city,
                        date: formatDate(item.dt_txt),
                        emoji: item.weather[0].icon,
                        temp: tempF.toFixed(1), //rounds to one decimal place
                        wind: item.wind.speed,
                        humidity: item.main.humidity,
                    });
                }
            });
            console.log(fiveDayArr);
        });
    }

function formatDate(dateString) {
    //create date object from date input string
    const date = new Date(dateString);
    //extract the date from the date object
    const day = date.getDate().toString().padStart(2, '0');
    //extract the month from the date object
    const month = (date.getMonth() + 1).toString();
    //extract the year from the date object
    const year = date.getFullYear();
    //return formatedd date string
    return `${month}/${day}/${year}`;
}

//listener for the 'submit' on the city search
cityEl.addEventListener('submit', handleSubmit)