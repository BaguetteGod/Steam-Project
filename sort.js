let request2 = new XMLHttpRequest();
request2.open('GET', 'steam2.json', false);
request2.send(null);
let data2 = JSON.parse(request2.responseText);
let dataSize2 = data2.length

// function mergeSort (arr, string) {
//     let arrCopy = Array.from(arr);
//     if(arrCopy.length > 1) {
//         let mid = Math.floor(arrCopy / 2);

//         let leftSide = arrCopy.slice(0, mid);
//         let rightSide = arrCopy.slice(mid, arrCopy.length);

//         mergeSort(leftSide, string);
//         mergeSort(rightSide, string);


//     }
// }


const mergeSort = (array, level, string) => {
    logWithLevel(level, "Start sort array " + array);
    if(array.length < 2) {
      //function stops here
      logWithLevel(level, "Finish sort array " + array);
      return array;
    }
  
    const middle = Math.floor(array.length / 2);
    logWithLevel(level, "middle element is " + array[middle][string])
    const leftSide = array.slice(0, middle);
    const rightSide = array.slice(middle, array.length);
    let result = merge(mergeSort(leftSide, level + 1, string), mergeSort(rightSide, level + 1, string));
    logWithLevel(level, "Finish sort array " + result);
    return result;
  };
  
const merge = (left, right, string) => {
    const result = [];
    let leftData = left[0][string]
    let rightData = right[0][string]
    while(left.length && right.length){
      if(leftData <= rightData){
        result.push(left.shift());
      }else{
        result.push(right.shift());
      }
    }
  
    while(left.length) result.push(left.shift());
  
    while(right.length) result.push(right.shift());
  
    return result;
  }
  
const logWithLevel = (level, data) => {
      var s = ""
      for (i = 0; i < level; i++) {
          s += "    ";
      }
      console.log(s + data);
  }

console.log(data2[0]['average_playtime'])
console.log(mergeSort(data2, 0, 'average_playtime'))