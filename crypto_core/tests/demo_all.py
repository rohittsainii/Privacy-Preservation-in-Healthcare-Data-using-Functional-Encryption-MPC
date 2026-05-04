from crypto_core.fe_module.fe_core import setup, encrypt, keygen
from crypto_core.fe_module.aggregation import compute_sum, encrypt_dataset
from crypto_core.utils.generate_dataset import generate_dataset
from crypto_core.utils.dataset_utils import (
    dataset_to_vectors,
    filter_by_disease,
    encrypt_dataset_raw,
    decrypt_dataset_raw
)
from crypto_core.mpc_module.mpc_core import secure_sum


print("\n===== STEP 1: GENERATE DATA =====")
hospital_A = generate_dataset(10)
hospital_B = generate_dataset(10)

print("Sample Patient (Hospital A):", hospital_A[0])


print("\n===== STEP 2: AES ENCRYPTION (STORAGE) =====")
encrypted_A = encrypt_dataset_raw(hospital_A)
print("Encrypted Sample:", encrypted_A[0])


print("\n===== STEP 3: DECRYPT FOR PROCESSING =====")
decrypted_A = decrypt_dataset_raw(encrypted_A)
print("Decrypted Sample:", decrypted_A[0])


print("\n===== STEP 4: FILTER BY DISEASE =====")
filtered_A = filter_by_disease(decrypted_A, 2)
print("Filtered Patients (disease=2):", len(filtered_A))


print("\n===== STEP 5: FUNCTIONAL ENCRYPTION =====")
mpk, msk = setup(5)

vectors_A = dataset_to_vectors(filtered_A)
encrypted_data_A, masks_A = encrypt_dataset(mpk, vectors_A, encrypt)

fk = keygen(msk, [1,0,0,0,0])  # AGE

sum_A = compute_sum(encrypted_data_A, fk, masks_A)
count_A = len(filtered_A)

print("Hospital A → Sum:", sum_A, "Count:", count_A)


print("\n===== STEP 6: SECOND HOSPITAL =====")
encrypted_B = encrypt_dataset_raw(hospital_B)
decrypted_B = decrypt_dataset_raw(encrypted_B)
filtered_B = filter_by_disease(decrypted_B, 2)

vectors_B = dataset_to_vectors(filtered_B)
encrypted_data_B, masks_B = encrypt_dataset(mpk, vectors_B, encrypt)

sum_B = compute_sum(encrypted_data_B, fk, masks_B)
count_B = len(filtered_B)

print("Hospital B → Sum:", sum_B, "Count:", count_B)


print("\n===== STEP 7: MPC SECURE AGGREGATION =====")
global_sum = secure_sum([sum_A, sum_B])
global_count = secure_sum([count_A, count_B])

if global_count == 0:
    print("No data available")
else:
    global_avg = global_sum / global_count
    print("\nFinal Secure Global Average Age:", global_avg)


