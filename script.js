const getRandomNumber = (minValue, maxValue) => {
    return minValue + Math.round(Math.random() * (maxValue - minValue));
};

const getUniqueValues = (array) => {
    return Array.from(new Set(array));
};

const createRandomArr = (lengthOfArray) => {
    return Array.from(Array(lengthOfArray)).map(() => {
        return getRandomNumber(-10, 10)
    });
};

const getCountOfArrValues = (array) => {
    const countOfValues ={};
    for (let i = 0; i < array.length; i++) {
        if (countOfValues[array[i]] !== undefined) {
            countOfValues[array[i]]++
        } else {
            countOfValues[array[i]] = 1;
        }
    }
    return countOfValues;
};
