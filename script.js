const getRandomNumber = (minValue, maxValue) => {
    return minValue + Math.round(Math.random() * (maxValue - minValue));
};

const createRandomArr = (lengthOfArray) => {
    return Array.from(Array(lengthOfArray)).map(() => {
        return getRandomNumber(-10, 10)
    });
};
