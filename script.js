const getRandomNumber = (minValue, maxValue) => {
    return minValue + Math.round(Math.random() * (maxValue - minValue));
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

const insertionSort = (array) => {
    for (let i = 1; i < array.length; i++) {
        let j = i;
        while (j > 0 && array[j] < array[j - 1]) {
            [array[j - 1], array[j]] = [array[j], array[j - 1]];
            j--;
        }
    }
};
