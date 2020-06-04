'use strict';

const KELVIN = 273.15;
const ICON_URL = 'http://openweathermap.org/img/wn/';
const URL = 'https://api.openweathermap.org/data/2.5/weather?';
const API_KEY = '&appid=7312b1a42d2665a6c830420857b8c3f9';

const windDirections = [
    'northern',
    'northeastern',
    'eastern',
    'southeastern',
    'southern',
    'southwestern',
    'western', 'northwestern'
];

const formElement = document.querySelector('form');
const container = document.querySelector('.container');

const removeOldInformation = () => {
    const oldResponse = document.querySelector('.response');
    if (oldResponse) {
        oldResponse.remove();
    }

    const oldError = document.querySelector('.error');
    if (oldError) {
        oldError.remove();
    }

    const loading = document.querySelector('.loading');
    if (loading) {
        loading.remove();
    }
};

const removePastRequestsList = () => {
    const oldInformation = document.querySelector('.past-requests');
    if (oldInformation) {
        oldInformation.remove();
    }
};

const changeKelvinsToСelsius = (value) => {
    return Math.round(value - KELVIN);
};

const renderWeatherTemplate = (response) => {
    removeOldInformation();

    const createMarkup = (data) => {

        const getWindDirection = () => {
            const indexOfDirection = Math.round(data.wind.deg/45);
            if (indexOfDirection === 8) {
                return windDirections[0];
            } else {
                return windDirections[indexOfDirection];
            }
        };

        const timeSunrise = new Date(data.sys.sunrise * 1000);
        const timeSunset = new Date(data.sys.sunset * 1000);

        return (
            `<article class="box response">
                <h3 class="name">${data.name}</h3>
                <p class="coords">${data.coord.lat}, ${data.coord.lon}</p>
                <p>
                    <img class="icon" src="${ICON_URL}${data.weather[0].icon}.png" alt="${data.weather[0].description}">
                    <span class="bold currentTemp">${changeKelvinsToСelsius(data.main.temp)}&#176;</span>
                </p>
                <p class="bold">${data.weather[0].description[0].slice().toUpperCase() + data.weather[0].description.slice(1)}</p>
                <p><span class="bold">Feels like:</span> ${changeKelvinsToСelsius(data.main.feels_like)}&#176;</p>
                <p><span class="bold">Maximum temperature:</span> ${changeKelvinsToСelsius(data.main.temp_min)}&#176;</p>
                <p><span class="bold">Minimum temperature:</span> ${changeKelvinsToСelsius(data.main.temp_max)}&#176;</p>
                <p><span class="bold">Pressure:</span> ${data.main.pressure}hPa</p>
                <p><span class="bold">Humidity:</span> ${data.main.humidity}%</p>
                <p><span class="bold">Wind speed:</span> ${data.wind.speed}m/s</p>
                <p><span class="bold">Direction of the wind:</span> ${getWindDirection()}</p>
                <p><span class="bold">Sunrise:</span> ${timeSunrise.getHours()}:${timeSunrise.getMinutes()}:${timeSunrise.getSeconds()}</p>
                <p><span class="bold">Sunset:</span> ${timeSunset.getHours()}:${timeSunset.getMinutes()}:${timeSunset.getSeconds()}</p>
            </article>`
        );
    };

    const newElement = document.createElement('div');
    newElement.innerHTML = createMarkup(response);
    container.append(newElement.firstChild);

};

const renderCurrentPositionButton = () => {
    const newElement = document.createElement('div');
    newElement.innerHTML = '<button type="button" class="current-position">Check weather at current location</button>';
    formElement.append(newElement.firstChild);
};

const renderErrorTemplate = (text) => {
    removeOldInformation();
    const createMarkup = () => {
        return (
            `<section class="box error">
                <h3 class="name">Error</h3>
                <p>${text}</p>
            </section>`
        );
    };

    const newElement = document.createElement('div');
    newElement.innerHTML = createMarkup();
    container.append(newElement.firstChild);
};

const renderPastRequestsTemplate = (pastRequests) => {
    removePastRequestsList();
    const createListOfRequests = () => {
        return pastRequests.map((item) => {
            const latitude = Number(item.latitude).toFixed(3);
            const longitude = Number(item.longitude).toFixed(3);
            return (
                `<button type="button" class="past-request">
                    <span class="latitude">${latitude}</span>, 
                    <span class="longitude">${longitude}</span>
                </button>`
            );
        }).join(`\n`)
    };
    const createMarkup = () => {
        return (
            `<section class="box past-requests">
                <h3 class="name">Past requests</h3>
                ${createListOfRequests()}
            </section>`
        );
    };

    const newElement = document.createElement('div');
    newElement.innerHTML = createMarkup();
    formElement.after(newElement.firstChild);

    const listOfRequests = document.querySelectorAll('.past-request');
    listOfRequests.forEach((item) => {
        const position = {
            coords: {
                latitude: Number(item.querySelector('.latitude').textContent),
                longitude: Number(item.querySelector('.longitude').textContent)
            }
        };
        item.addEventListener('click', () => {
            request(position)
        });
    })
};

const renderLoadingTemplate = () => {
    removeOldInformation();

    const createMarkup = () => {
        return (
            `<section class="box loading">
                <h3 class="name">Loading...</h3>
            </section>`
        );
    };

    const newElement = document.createElement('div');
    newElement.innerHTML = createMarkup();
    container.append(newElement.firstChild);
};

const getFormData = () => {
    const formData = new FormData(document.querySelector('form'));
    return {
        coords: {
            "longitude": Number(formData.get('longitude')),
            "latitude": Number(formData.get('latitude')),
        }
    }
};

const request = (position) => {
    const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };
    const latitude = `lat=${position.coords.latitude}`;
    const longitude = `&lon=${position.coords.longitude}`;
    renderLoadingTemplate();
    fetch(`${URL}${latitude}${longitude}${API_KEY}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            return response;
        })
        .then((response) => response.json())
        .then((response) => {
            renderWeatherTemplate(response);
            formElement.reset();
            setItemToStorage(coords);
            const pastRequests = getItemsFromStorage();
            renderPastRequestsTemplate(pastRequests);
        })
        .catch((error) => {
            if (error == 'Error: 400') {
                renderErrorTemplate(`Failed to check the weather by coordinates: ${position.coords.latitude}, ${position.coords.longitude}. Please make sure they are correct.`);
            } else {
                renderErrorTemplate('Failed to check the weather.');
            }
            formElement.reset();
        });
};

const validation = (input) => {
    if (input.validity.patternMismatch) {
        input.setCustomValidity('Please enter the data in the proposed format.');
    } else if (input.validity.valueMissing) {
        input.setCustomValidity('Please enter a coordinate.');
    } else {
        input.setCustomValidity('');
    }
};

const inputElements = document.querySelectorAll('input');
inputElements.forEach((input) => {
    input.addEventListener('input', () => {
        validation(input);
    });
    input.addEventListener('invalid', () => {
        validation(input);
    });
});

formElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    request(getFormData());
});

const errorHandler = () => {
    renderErrorTemplate('Failed to check your coordinates. Please enter them yourself.');
};

if (navigator.geolocation) {
    renderCurrentPositionButton();
    const currentPositionButton = formElement.querySelector('.current-position');
    currentPositionButton.addEventListener('click', () => {
        navigator.geolocation.getCurrentPosition(request, errorHandler);
    });
}

const storage = window.localStorage;
const nameStorage = 'lastRequests';

const getItemsFromStorage = () => {
    return JSON.parse(storage.getItem(nameStorage)) || []
};

const setItemToStorage = (newItem) => {
    const oldData = getItemsFromStorage();
    const getNewData = () => {
        if (oldData.length >= 5) {
            oldData.unshift(newItem);
            return oldData.slice(0, 5)
        } else {
            oldData.unshift(newItem);
            return oldData;
        }
    };
    const newData = getNewData();
    storage.setItem(nameStorage, JSON.stringify(newData));
};

const pastRequests = getItemsFromStorage();
if (pastRequests.length > 0) {
    renderPastRequestsTemplate(pastRequests);
}




