let request2 = new XMLHttpRequest();
request2.open('GET', 'steam2.json', false);
request2.send(null);
let data2 = JSON.parse(request2.responseText);
let dataSize2 = data2.length;

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
            if (leftSide[i][string] < rightSide[j][string]) {
                arrCopy[k] = leftSide[i];
                i += 1;
            } else {
                arrCopy[k] = rightSide[j];
                j += 1;
            }
            k += 1;
        }
        while (i < leftSide.length) {
            arrCopy[k] = leftSide[i];
            i += 1;
            k += 1;
        }
        while (i < rightSide.length) {
            arrCopy[k] = rightSide[j];
            i += 1;
            k += 1;
        }
    }
    return arrCopy;
}

console.log(data2)
console.log(mergeSort(data2, 'average_playtime'));
