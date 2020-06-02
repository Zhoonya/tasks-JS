'use strict';

const formElement = document.querySelector('form');

const removeOldInformation = () => {
    const oldResponse = document.querySelector('.response');
    if (oldResponse) {
        oldResponse.remove();
    }

    const oldError = document.querySelector('.error');
    if (oldError) {
        oldError.remove();
    }
};

const getWeatherTemplate = (response) => {
    removeOldInformation();

    const createMarkup = (data) => {
        const getWindDirection = () => {
            const windDegrees = data.wind.deg;
            switch (true) {
                case windDegrees <= 20 && windDegrees >= 340:
                    return 'northern';
                    break;
                case windDegrees > 20 && windDegrees < 70:
                    return 'northeastern';
                    break;
                case windDegrees >= 70 && windDegrees <= 110:
                    return 'eastern';
                    break;
                case windDegrees > 110 && windDegrees < 160:
                    return 'southeastern';
                    break;
                case windDegrees >= 160 && windDegrees <= 200:
                    return 'southern';
                    break;
                case windDegrees > 200 && windDegrees < 250:
                    return 'southwestern';
                    break;
                case windDegrees >= 250 && windDegrees <= 290:
                    return 'western';
                    break;
                case windDegrees > 290 && windDegrees < 340:
                    return 'northwestern';
                    break;
                default:
                    return;
            }
        };
        return (
            `<article class="box response">
                <h3 class="name">${data.name}</h3>
                <p class="coords">${data.coord.lon}, ${data.coord.lat}</p>
                <p class="bold">${data.weather[0].description[0].slice().toUpperCase() + data.weather[0].description.slice(1)}</p>
                <p><span class="bold">Average temperature:</span> ${Math.round(data.main.temp - 273.15)}&#176;</p>
                <p><span class="bold">Feels like:</span> ${Math.round(data.main.feels_like - 273.15)}&#176;</p>
                <p><span class="bold">Maximum temperature:</span> ${Math.round(data.main.temp_min - 273.15)}&#176;</p>
                <p><span class="bold">Minimum temperature:</span> ${Math.round(data.main.temp_max - 273.15)}&#176;</p>
                <p><span class="bold">Pressure:</span> ${data.main.pressure}hPa</p>
                <p><span class="bold">Humidity:</span> ${data.main.humidity}%</p>
                <p><span class="bold">Wind speed:</span> ${data.wind.speed}m/s</p>
                <p><span class="bold">Direction of the wind:</span> ${getWindDirection()}</p>
            </article>`
        );
    };

    const newElement = document.createElement('div');
    newElement.innerHTML = createMarkup(response);
    formElement.after(newElement.firstChild);

};

const getErrorTemplate = (text) => {
    removeOldInformation();

    const createMarkup = () => {
        return (
            `<article class="box error">
                <h3 class="name">Error</h3>
                <p>${text}</p>
            </article>`
        );
    };

    const newElement = document.createElement('div');
    newElement.innerHTML = createMarkup();
    formElement.after(newElement.firstChild);
};

const getFormData = () => {
    const formData = new FormData(document.querySelector('form'));
    return {
        "lon": formData.get('longitude'),
        "lat": formData.get('latitude'),
    }
};

const request = () => {
    const coords = getFormData();
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=7312b1a42d2665a6c830420857b8c3f9`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`${response.status}`);
            } else {
                return response
            }
        })
        .then((response) => response.json())
        .then((response) => {
            getWeatherTemplate(response);
            formElement.reset();
        })
        .catch((error) => {
            if (error == 'Error: 400') {
                getErrorTemplate(`Failed to check the weather by coordinates: ${coords.lat}, ${coords.lon}. Please make sure they are correct.`);
            } else {
                getErrorTemplate('Failed to check the weather.');
            }
            formElement.reset();
        });
};

const inputElements = document.querySelectorAll('input');
inputElements.forEach((input) => {
    input.addEventListener('invalid', () => {
        if (input.validity.patternMismatch) {
            input.setCustomValidity(`Please enter the data in the proposed format`);
        } else if (input.validity.valueMissing) {
            input.setCustomValidity('Please enter a coordinate.');
        } else {
            input.setCustomValidity('');
        }
    });
});

formElement.addEventListener('submit', (evt) => {
    evt.preventDefault();
    request();
});
