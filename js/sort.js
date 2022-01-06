function mergeSort(arr, string) {
    let i, j, k;
    let arrCopy = Array.from(arr);
    if (arrCopy.length > 1) {
        let mid = Math.floor(arrCopy.length / 2);

        let leftSide = arrCopy.slice(0, mid);
        let rightSide = arrCopy.slice(mid, arrCopy.length);

        leftSide = mergeSort(leftSide, string);
        rightSide = mergeSort(rightSide, string);

        i = j = k = 0;
        while (i < leftSide.length && j < rightSide.length) {
            if (leftSide[i][string] <= rightSide[j][string]) {
                arrCopy[k] = leftSide[i];
                i ++;
            } else {
                arrCopy[k] = rightSide[j];
                j ++;
            }
            k ++;
        }
        while (i < leftSide.length) {
            arrCopy[k] = leftSide[i];
            i ++;
            k ++;
        }
        while (j < rightSide.length) {
            arrCopy[k] = rightSide[j];
            j ++;
            k ++;
        }
    }
    return arrCopy;
}

function selectionSort(arr, string) {
    let arrCopy = Array.from(arr);
    for (let i = 0; i < arrCopy.length; i ++) {
        let minIdx = i;
        for (let j = 0; j < arrCopy.length; j ++) {
            if (arrCopy[minIdx][string] > arrCopy[j][string]) {
                minIdx = j;
            }
        }
        arrCopy[i], arrCopy[minIdx] = arrCopy[minIdx], arrCopy[i];
    }
    return arrCopy;
}
