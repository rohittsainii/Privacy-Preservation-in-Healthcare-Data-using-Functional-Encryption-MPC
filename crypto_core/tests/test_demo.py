from crypto_core.fe_module.fe_core import setup, encrypt, keygen
from crypto_core.fe_module.aggregation import encrypt_dataset, compute_average
from crypto_core.fe_module.dataset_utils import generate_dataset, dataset_to_vectors, filter_by_disease


# STEP 1 — setup
mpk, msk = setup(5)

# STEP 2 — dataset
dataset = generate_dataset(10)

print("Original dataset:")
for d in dataset:
    print(d)

# STEP 3 — filter
filtered = filter_by_disease(dataset, 2)

print("\nFiltered dataset (disease=2):")
for d in filtered:
    print(d)

# STEP 4 — convert to vectors
vectors = dataset_to_vectors(filtered)

# STEP 5 — encrypt dataset
encrypted_data, masks = encrypt_dataset(mpk, vectors, encrypt)

print("\nEncrypted data:")
print(encrypted_data)

# STEP 6 — function key (AGE)
fk = keygen(msk, [1,0,0,0,0])

# STEP 7 — compute average
avg_age = compute_average(encrypted_data, fk, masks)

print("\nAverage Age (disease=2):", avg_age)
print("\n===== RESULTS =====")
print(f"Filter applied: disease = 2")
print(f"Patients found: {len(filtered)}")
print(f"Average Age: {round(avg_age,2)}")

if len(filtered) == 0:
    print("No patients found for this filter.")