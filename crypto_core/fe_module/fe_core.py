import random

PRIME = 2**127 - 1

def mod_p(x):
    return x % PRIME

def vector_to_list(patient):
    return [
        patient["age"],
        patient["gender"],
        patient["disease"],
        patient["blood_pressure"],
        patient["risk_score"]
    ]

def inner_product(vec1, vec2):
    return mod_p(sum(a*b for a, b in zip(vec1, vec2)))

# Setup
def setup(vector_size=5):
    master_secret_key = [random.randint(1, PRIME) for _ in range(vector_size)]
    master_public_key = vector_size
    return master_public_key, master_secret_key

# Encrypt
def encrypt(mpk, patient_vector):
    r = random.randint(1, PRIME)
    ciphertext = [mod_p(x + r) for x in patient_vector]
    return ciphertext, r

# KeyGen
def keygen(msk, function_vector):
    return function_vector

# Compute
def compute(ciphertext, function_key, r):
    if len(ciphertext) != len(function_key):
        raise ValueError("Vector size mismatch")

    masked_result = inner_product(ciphertext, function_key)
    correction = mod_p(r * sum(function_key))
    result = mod_p(masked_result - correction)

    return result