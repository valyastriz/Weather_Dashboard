document.addEventListener('DOMContentLoaded', () => {

    const cityEl = document.getElementById('cityInput');
    let fiveDayArr = JSON.parse(localStorage.getItem('fiveDayArr')) || []; //load from local storage or initialize an empty array
    const cityClicked = document.getElementById('cityClicked');



    //handled the submit of the city search
    function handleSubmit(event) {
        event.preventDefault();
        const city = document.getElementById('city').value;
        search(city);
        document.getElementById('city').value = '';
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
        const citySearchId = crypto.randomUUID(); //generate an id for each city search

        const urlFive = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        
        fetch(urlFive)
            .then(function(resp) {
                return resp.json();
            })
            .then(async function(fiveDayData) {    
                let cityData = {
                    id: citySearchId,
                    city: city,
                    data: []
                };

                let dates = [];
                fiveDayData.list.forEach((item) => {
                    if(!dates.includes(item.dt_txt.split(" ")[0])){
                        dates.push(item.dt_txt.split(" ")[0]);
                        const tempF = (item.main.temp - 273.15) * 9 / 5 + 32; // Convert Kelvin to Fahrenheit
                        const iconCode = item.weather[0].icon; // Get icon code
                        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`; // Construct icon URL
                        cityData.data.push({
                            city: city,
                            date: formatDate(item.dt_txt),
                            iconUrl: iconUrl,
                            temp: tempF.toFixed(1), // Round to one decimal place
                            wind: item.wind.speed,
                            humidity: item.main.humidity,
                        });
                    }
                });
                // Add new data to the beginning of the array using unshift
                fiveDayArr.unshift(cityData);

                // Save to local storage
                localStorage.setItem('fiveDayArr', JSON.stringify(fiveDayArr));

                createCurrentCard(cityData.data, city);
                createFutureCards(cityData.data);
                renderSavedSearches();
            })
            .catch(function(error) {
                console.error("Error: ", error);
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


    function createFutureCards(cityDataArray) {
        const futureContainerEl = document.getElementById('futureContainer');
        futureContainerEl.innerHTML = ''; //clears any previous content

        //only render indices 1-5 since index 0 is the current day weather
        for (let i = 1; i<=6 && i < cityDataArray.length; i++) {
            const item = cityDataArray[i];
            const div = document.createElement('div');
            div.classList.add('col-span-2', 'p-2', 'bg-cyan-600', 'rounded-md', 'shadow-md', 'shadow-cyan-500/50', 'mb-2');
            div.innerHTML = `
                <h3 class="font-bold mb-2">${item.date}</h3>
                <img src="${item.iconUrl}" alt="Weather Icon" class="mb-1.5 w-12 h-12">
                <p class="mb-1.5">Temp: ${item.temp} °F</p>
                <p class="mb-1.5">Wind: ${item.wind} MPH</p>
                <p class="mb-1.5">Humidity: ${item.humidity}%</p>
            `;
            futureContainerEl.appendChild(div);
        }
        
    }
    

    function createCurrentCard(cityDataArray, city) {
        const currentCardEl = document.getElementById('currentCard');
        currentCardEl.innerHTML = ''; //clears any previous content

        if(cityDataArray.length > 0) {
            const item = cityDataArray[0];
            const currDiv = document.createElement('div');
            currDiv.classList.add('border-solid', 'border-2', 'border-cyan-800', 'mt-3', 'rounded-md', 'm-2', 'p-2', 'bg-cyan-800', 'text-gray-200', 'shadow-md', 'shadow-cyan-500/50');
            currDiv.dataset.id = item.id;
            currDiv.innerHTML = `
            <h2 class="text-lg font-bold mb-2">${city} ${item.date} <img src="${item.iconUrl}" alt="Weather Icon" class="mb-1.5 w-12 h-12"></h2>
            <p class="mb-1">Temp: ${item.temp} °F</p>
            <p class="mb-1">Wind: ${item.wind} MPH</p>
            <p class="mb-1">Humidity: ${item.humidity}%</p>
            `;
            currentCardEl.prepend(currDiv);
        }
    }


    function handlePreviousCityClick(event) {
        event.preventDefault();
        const previousCityBtn = event.target.closest('.savedSearches');
        if (previousCityBtn) {
            const id = previousCityBtn.getAttribute('data-id');
            const savedSearch = fiveDayArr.find(item => item.id === id);
            if (savedSearch) {
                createCurrentCard(savedSearch.data, savedSearch.city);
                createFutureCards(savedSearch.data);
            }
    }
}
    
    function renderSavedData() {
        if(fiveDayArr.length > 0) {
            const latestCityData = fiveDayArr[0];
            createCurrentCard(latestCityData, latestCityData.city);
            createFutureCards(latestCityData);
        }
    }

    function renderSavedSearches() {
        const savedSearchesContainer = document.getElementById('savedSearches');
        savedSearchesContainer.innerHTML = ''; // Clears any previous content

        fiveDayArr.forEach(search => {
            const searchBtnDiv = document.createElement('div');
            const searchBtn = document.createElement('button');
            console.log(search);
            searchBtnDiv.classList.add('mb-2');
            searchBtn.textContent = search?.city;
            searchBtn.dataset.id = search.id;
            searchBtn.classList.add('bg-gray-200', 'py-2', 'rounded', 'bg-slate-300', 'hover:bg-slate-500', 'hover:text-white', 'w-full', 'focus:outline-none', 'focus:ring', 'focus:ring-cyan-600', 'previousSearch');
            searchBtnDiv.appendChild(searchBtn);
            savedSearchesContainer.appendChild(searchBtnDiv);

            // Add event listener to the search button
            searchBtn.addEventListener('click', handlePreviousCityClick);
    });
}

    function init(){
        renderSavedData();
        renderSavedSearches();
        cityEl.addEventListener('submit', handleSubmit)
    }
        
    init();
});