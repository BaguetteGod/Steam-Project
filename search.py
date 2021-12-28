def recBinarySearch(lst, target, string, start=0, end=None):
    if end is None:
        end = len(lst) - 1
    if start > end:
        return False

    mid = (start + end) // 2
    if target == lst[mid][string]:
        return lst[mid]
    if target < lst[mid][string]:
        return recBinarySearch(lst, target, string, start, mid-1)
    return recBinarySearch(lst, target, string, mid+1, end)

