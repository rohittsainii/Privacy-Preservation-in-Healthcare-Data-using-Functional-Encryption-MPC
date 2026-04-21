from crypto_core.fe_module.fe_core import setup, encrypt, keygen
from crypto_core.fe_module.aggregation import compute_sum, encrypt_dataset
from crypto_core.fe_module.dataset_utils import generate_dataset, dataset_to_vectors, filter_by_disease
from crypto_core.mpc_module.mpc_core import secure_sum


# SETUP
mpk, msk = setup(5)

# Simulate hospitals
hospital_A = generate_dataset(10)
hospital_B = generate_dataset(10)


def process_hospital(dataset, disease_filter):
    filtered = filter_by_disease(dataset, disease_filter)

    if len(filtered) == 0:
        return 0, 0

    vectors = dataset_to_vectors(filtered)
    encrypted_data, masks = encrypt_dataset(mpk, vectors, encrypt)

    fk = keygen(msk, [1,0,0,0,0])  # AGE

    total = compute_sum(encrypted_data, fk, masks)
    count = len(filtered)

    return total, count


# LOCAL COMPUTATION (FE)
sum_A, count_A = process_hospital(hospital_A, 2)
sum_B, count_B = process_hospital(hospital_B, 2)

print("\nLocal Results:")
print("Hospital A →", sum_A, count_A)
print("Hospital B →", sum_B, count_B)


# STEP 2 — MPC aggregation
global_sum = secure_sum([sum_A, sum_B])
global_count = secure_sum([count_A, count_B])


# STEP 3 — final result
if global_count == 0:
    print("\nNo data available")
else:
    global_avg = global_sum / global_count
    print("\nFinal Secure Global Average:", global_avg)