from crypto_core.fe_module.fe_core import (
    setup,
    encrypt,
    keygen
)

from crypto_core.fe_module.aggregation import (
    compute_sum,
    encrypt_dataset
)

from crypto_core.utils.generate_dataset import (
    generate_dataset
)

from crypto_core.utils.dataset_utils import (
    dataset_to_vectors,
    filter_by_disease,
    encrypt_dataset_raw,
    decrypt_dataset_raw
)

from crypto_core.mpc_module.mpc_core import (
    secure_sum
)

# ─────────────────────────────────────────────
# SYSTEM SETUP
# ─────────────────────────────────────────────

print("\n==============================")
print(" PRIVACY PRESERVING HEALTHCARE ")
print(" FE + MPC FULL PIPELINE TEST ")
print("==============================\n")

mpk, msk = setup(5)

print("Functional Encryption Setup Complete")
print("Master Public Key Generated")
print("Master Secret Key Generated\n")

# ─────────────────────────────────────────────
# DATASET GENERATION
# ─────────────────────────────────────────────

hospital_A = generate_dataset(10)
hospital_B = generate_dataset(10)

print("Hospital A Dataset Generated")
print("Hospital B Dataset Generated\n")


# ─────────────────────────────────────────────
# PROCESS HOSPITAL
# ─────────────────────────────────────────────

def process_hospital(name, dataset, disease_filter):

    print(f"\n========== {name} ==========")

    print("\nORIGINAL DATASET:\n")

    for patient in dataset:
        print(patient)

    # STEP 1 — AES ENCRYPTION

    encrypted_raw = encrypt_dataset_raw(dataset)

    print("\nAES ENCRYPTED DATA:\n")

    for patient in encrypted_raw[:2]:
        print(patient)

    # STEP 2 — DECRYPT FOR COMPUTATION

    decrypted = decrypt_dataset_raw(encrypted_raw)

    # STEP 3 — FILTER

    filtered = filter_by_disease(
        decrypted,
        disease_filter
    )

    print(f"\nFILTERED PATIENTS (Disease={disease_filter})")

    for patient in filtered:
        print(patient)

    if len(filtered) == 0:

        print("\nNo matching patients found")

        return 0, 0

    # STEP 4 — VECTOR CONVERSION

    vectors = dataset_to_vectors(filtered)

    print("\nVECTOR REPRESENTATION:\n")

    for vec in vectors:
        print(vec)

    # STEP 5 — FUNCTIONAL ENCRYPTION

    encrypted_data, masks = encrypt_dataset(
        mpk,
        vectors,
        encrypt
    )

    print("\nFUNCTIONAL ENCRYPTION COMPLETE")

    # STEP 6 — FUNCTION KEY GENERATION

    fk = keygen(msk, [1,0,0,0,0])

    print("Function Key Generated")
    print("→ Computing SUM(age)\n")

    # STEP 7 — SECURE COMPUTATION

    total = compute_sum(
        encrypted_data,
        fk,
        masks
    )

    count = len(filtered)

    print(f"Local Secure Sum: {total}")
    print(f"Matching Patients: {count}")

    return total, count


# ─────────────────────────────────────────────
# LOCAL FE COMPUTATION
# ─────────────────────────────────────────────

sum_A, count_A = process_hospital(
    "HOSPITAL A",
    hospital_A,
    2
)

sum_B, count_B = process_hospital(
    "HOSPITAL B",
    hospital_B,
    2
)

# ─────────────────────────────────────────────
# MPC AGGREGATION
# ─────────────────────────────────────────────

print("\n==============================")
print(" MPC SECURE AGGREGATION ")
print("==============================\n")

global_sum = secure_sum([sum_A, sum_B])

global_count = secure_sum([count_A, count_B])

print(f"Global Secure Sum = {global_sum}")
print(f"Global Patient Count = {global_count}")

# ─────────────────────────────────────────────
# FINAL RESULT
# ─────────────────────────────────────────────

print("\n==============================")
print(" FINAL RESULT ")
print("==============================")

if global_count == 0:

    print("\nNo matching patient data found")

else:

    global_avg = global_sum / global_count

    print(
        f"\nSecure Global Average Age = "
        f"{global_avg:.2f}"
    )

print("\nFULL FE + MPC PIPELINE SUCCESSFUL\n")