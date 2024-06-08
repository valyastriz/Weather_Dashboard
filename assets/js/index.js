const cityEl = document.getElementById('cityInput');
let fiveDayArr = JSON.parse(localStorage.getItem('fiveDayArr')) || []; //load from local storage or initialize an empty array

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
    const apiKey = '1d06b7c740fb5f44ff9ef2d948306601';
    const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
    fetch(url)
        .then(function(resp) {
            return resp.json();
        })
        .then(function(data) {
            console.log(data);
            let cityData = [];
            data.list.forEach((item, index) => {
                if (index % 8 === 0) { // if the index number is exactly divisible by 8 (there are 8 indices for each day so we only need one, then take the info from that index)
                    const tempF = (item.main.temp - 273.15) * 9/5 + 32; // converting from kelvin to farenhight
                    const iconCode = item.weather[0].icon; //get icon code
                    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`; //icon url
                    // newDate = item.dt.text
                    cityData.unshift({ 
                        city: city,
                        date: formatDate(item.dt_txt),
                        iconUrl: iconUrl,
                        temp: tempF.toFixed(1), //rounds to one decimal place
                        wind: item.wind.speed,
                        humidity: item.main.humidity,
                    });
                }
            });
            //add new data to the bgeinning of the array using unshift
            fiveDayArr.unshift(cityData);

            //check make sure the array only stores the 5 latest searches so we don't use extra room 
            if (fiveDayArr.length > 5) {
                fiveDayArr = fiveDayArr.slice(0, 5);
            }

            //save to lcoal storage
            localStorage.setItem('fiveDayArr', JSON.stringify(fiveDayArr));
            console.log(fiveDayArr);

            createFutureCards();
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

function renderSavedData(fiveDayArr) {

}

function createFutureCards() {
    const futureContainerEl = document.getElementById('futureContainer');
    futureContainerEl.innerHTML = ''; //clears any previous content

    const cityDataArray = fiveDayArr[0] || [];


    cityDataArray.forEach(function(item) {
        const div = document.createElement('div');
        div.classList.add('col-span-2', 'p-2', 'bg-cyan-600', 'rounded-md', 'shadow-md', 'shadow-cyan-500/50', 'mb-2');
        div.innerHTML = `
            <h3 class="font-bold mb-2">${item.date}</h3>
            <img src="${item.iconUrl}" alt="Weather Icon" class="mb-1.5">
            <p class="mb-1.5">Temp: ${item.temp} °F</p>
            <p class="mb-1.5">Wind: ${item.wind} MPH</p>
            <p class="mb-1.5">Humidity: ${item.humidity}%</p>
        `;
        futureContainerEl.appendChild(div);
    });
}


//listener for the 'submit' on the city search
cityEl.addEventListener('submit', handleSubmit)

// document.addEventListener('DOMContentLoaded', renderSavedData);