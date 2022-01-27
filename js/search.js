// Binary search algorithm
function recBinarySearch(arr, x, string, start = 0, end = null) {
    if (end === null) end = arr.length - 1;
    // Base Condition
    if (start > end) return false;
  
    // Find the middle index
    let mid=Math.floor((start + end)/2);
  
    // Compare mid with given key x
    if (arr[mid][string]===x) return arr[mid];
         
    // If element at mid is greater than x,
    // search in the left half of mid
    if (arr[mid][string] > x)
        return recBinarySearch(arr, x, string, start, mid-1);
    else
        // If element at mid is smaller than x,
        // search in the right half of mid
        return recBinarySearch(arr, x, string, mid+1, end);

}

// Binary search algorithm for appIDs
function recBinarySearchID(arr, x, string = 'appID', start = 0, end = null) {
    if (end === null) end = arr.length - 1;
    // Base Condition
    if (start > end) return false;
  
    // Find the middle index
    let mid=Math.floor((start + end)/2);
  
    // Compare mid with given key x
    if (arr[mid][string]===x) return arr[mid];
         
    // If element at mid is greater than x,
    // search in the left half of mid
    if (arr[mid][string] > x)
        return recBinarySearchID(arr, x, string, start, mid-1);
    else
        // If element at mid is smaller than x,
        // search in the right half of mid
        return recBinarySearchID(arr, x, string, mid+1, end);

}