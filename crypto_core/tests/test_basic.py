import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from crypto_core.fe_module.dataset_utils import generate_dataset
from crypto_core.fe_module.fe_core import keygen, vector_to_list, setup, encrypt, compute

data = generate_dataset(1)
patient = data[0]
vector = vector_to_list(patient)
mpk, msk = setup()
ciphertext, r = encrypt(mpk, vector)
function_vector = [0, 1, 0, 0, 0, 0]   # extract age
function_key = keygen(msk, function_vector)
result = compute(ciphertext, function_key, r)
print("Original Vector:", vector)
print("Encrypted Vector:", ciphertext)
print("Computed Result (Age):", result)