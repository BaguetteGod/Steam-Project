def selectionSort(lst):
    lstCopy = lst.copy()
    for i in range(len(lstCopy)):
        minIdx = i
        for j in range(i + 1, len(lstCopy)):
            if lstCopy[minIdx] > lstCopy[j]:
                minIdx = j
        lstCopy[i], lstCopy[minIdx] = lstCopy[minIdx], lstCopy[i]
    return lstCopy


def insertionSort(lst):
    lstCopy = lst.copy()
    for i in range(1, len(lstCopy)):
        key = lstCopy[i]
        j = i - 1
        while j >= 0 and key < lstCopy[j]:
            lstCopy[j + 1] = lstCopy[j]
            j -= 1
        lstCopy[j + 1] = key
    return lstCopy


def mergeSort(lst, string):
    lstCopy = lst.copy()
    if len(lstCopy) > 1:
        mid = len(lstCopy) // 2
        # Dividing the list elements into 2 halves
        L = lstCopy[:mid]
        R = lstCopy[mid:]
        # Sorting the first half
        mergeSort(L, string)
        # Sorting the second half
        mergeSort(R, string)

        i = j = k = 0
        # Copy data to temp lists L[] and R[]
        while i < len(L) and j < len(R):
            if L[i][string] < R[j][string]:
                lstCopy[k] = L[i]
                i += 1
            else:
                lstCopy[k] = R[j]
                j += 1
            k += 1
        # Checking if any element was left
        while i < len(L):
            lstCopy[k] = L[i]
            i += 1
            k += 1

        while j < len(R):
            lstCopy[k] = R[j]
            j += 1
            k += 1
    return lstCopy