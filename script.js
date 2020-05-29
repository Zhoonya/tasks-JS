const quickSort = (array, startIndex = 0, endIndex = array.length - 1) => {

    if (array.length > 1) {
        const centralElement = array[Math.floor((startIndex + endIndex) / 2)];
        let i = startIndex;
        let j = endIndex;

        while (i <= j) {
            while (array[i] < centralElement) {
                i++;
            }
            while (array[j] > centralElement) {
                j--;
            }
            if (i <= j) {
                [array[i], array[j]] = [array[j], array[i]];
                i++;
                j--;
            }
        }

        if (startIndex < i - 1) {
            quickSort(array, startIndex, i - 1);
        }
        if (endIndex > i) {
            quickSort(array, i, endIndex);
        }
    }
};

