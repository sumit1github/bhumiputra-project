roles = [
    "IT",
    "Admin",
    "User",
]

BLOOD_GROUP_CHOICES = (
    ('A+', 'A+'),
    ('A-', 'A-'),
    ('B+', 'B+'),
    ('B-', 'B-'),
    ('AB+', 'AB+'),
    ('AB-', 'AB-'),
    ('O+', 'O+'),
    ('O-', 'O-'),
)

JOINING_COMISSION = {
    1: 25,
    2: 15,
    3: 5,
    4: 2,
    5: 2,
    6: 2,
    7: 2,
    8: 1,
    9: 1,
    10: 1,
    11: 1,
    12: 0.5,
    13: 0.5,
    14: 0.5,
    15: 0.5,
    16: 0.3,
    17: 0.3,
    18: 0.3,
    19: 0.3,
    20: 0.2,
    21: 0.2,
    22: 0.2,
    23: 0.2
}

ACHIVER_LEVELS =ACHIVER_LEVELS = {
    1: 3,   # eligible for rewards up to level 3
    2: 6,   # eligible for rewards up to level 6
    3: 9,   # eligible for rewards up to level 9
    4: 14,  # eligible for rewards up to level 14
    5: 23,  # eligible for rewards up to level 23
}


# key = level, value = commission percentage
REPURCHASE_COMISSION = {
    1: 5,
    2: 2,
    3: 1,
    4: 1,
    5: 1,
    6: 0.7,
    7: 0.7,
    8: 0.7,
    9: 0.7,
    10: 0.7,
    11: 0.3,
    12: 0.3,
    13: 0.3,
    14: 0.3,
    15: 0.3,
    16: 0.2,
    17: 0.2,
    18: 0.2,
    19: 0.2,
    20: 0.2,
    21: 0.2,
    22: 0.2,
    23: 0.2,
}