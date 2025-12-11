import sys
data = sys.stdin.read().strip().split()
if len(data) >= 2:
    a, b = map(int, data[:2])
    print(a - b)