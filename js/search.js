// Binary search algorithm
function recBinarySearch(arr, x, string, start = 0, end = null) {
  if (end === null) end = arr.length - 1;
  // Base Condition
  if (start > end) return false;

  // Find the middle index
  let mid = Math.floor((start + end) / 2);

  // Compare mid with given key x
  if (arr[mid][string] === x) return arr[mid];

  // If element at mid is greater than x,
  // search in the left half of mid
  if (arr[mid][string] > x) return recBinarySearch(arr, x, string, start, mid - 1);
  // If element at mid is smaller than x,
  // search in the right half of mid
  else return recBinarySearch(arr, x, string, mid + 1, end);
}

// Binary search algorithm for appIDs
function recBinarySearchID(arr, x, string = 'appID', start = 0, end = null) {
  if (end === null) end = arr.length - 1;
  // Base Condition
  if (start > end) return false;

  // Find the middle index
  let mid = Math.floor((start + end) / 2);

  // Compare mid with given key x
  if (arr[mid][string] === x) return arr[mid];

  // If element at mid is greater than x,
  // search in the left half of mid
  if (arr[mid][string] > x) return recBinarySearchID(arr, x, string, start, mid - 1);
  // If element at mid is smaller than x,
  // search in the right half of mid
  else return recBinarySearchID(arr, x, string, mid + 1, end);
}

// Binary search algorithm to check if name includes a string
function includesBinarySearch(arr, x, string = 'name', start = 0, end = null) {
  if (end === null) end = arr.length - 1;
  // Base Condition
  if (start > end) return false;

  // Find the middle index
  let mid = Math.floor((start + end) / 2);
  let midArrayName = arr[mid][string].toLowerCase();
  let target = x.toLowerCase();

  // Compare mid with given key x
  if (midArrayName.includes(target)) return arr[mid];

  // If element at mid is greater than x,
  // search in the left half of mid
  if (midArrayName > target) return includesBinarySearch(arr, x, string, start, mid - 1);
  // If element at mid is smaller than x,
  // search in the right half of mid
  else return includesBinarySearch(arr, x, string, mid + 1, end);
}

function findGameByName(arr, string) {
  let target = string.split(' ');
  let result = arr.filter((obj) => {
    let lowerCaseName = obj.name.toLowerCase();
    return lowerCaseName.includes(target[0].toLowerCase());
  });
  if (target.length > 1) {
    for (let i = 1; i < target.length; i++) {
      result = result.filter((obj) => {
        let lowerCaseName = obj.name.toLowerCase();
        return lowerCaseName.includes(target[i].toLowerCase());
      });
    }
  }
  return mergeSort(result, 'totalPlayTime').reverse();
}
