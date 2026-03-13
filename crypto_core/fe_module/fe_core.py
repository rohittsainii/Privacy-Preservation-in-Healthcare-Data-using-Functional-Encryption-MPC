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

# Functional Encryption
def setup(vector_size=5):
    # Generate master keys.
    master_secret_key = [random.randint(1, PRIME) for _ in range(vector_size)]
    master_public_key = vector_size
    return master_public_key, master_secret_key

# Encryption Function
def encrypt(mpk, patient_vector):
    # Encrypt a patient vector using random masking.
    r = random.randint(1, PRIME)
    ciphertext = [(x + r) % PRIME for x in patient_vector]
    return ciphertext, r

#Function Key Generation

def keygen(msk, function_vector):
    #Generate a function key for allowed computation
    return function_vector

#Secure Computation
def compute(ciphertext, function_key, r):
    #Compute function on encrypted vector    
    masked_result = inner_product(ciphertext, function_key)
    correction = r * sum(function_key)
    result = mod_p(masked_result - correction)
    return result