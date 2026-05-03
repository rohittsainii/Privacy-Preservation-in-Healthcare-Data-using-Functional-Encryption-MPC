from crypto_core.security.aes import encrypt_value, decrypt_value

def encrypt_dataset_raw(dataset):
    encrypted_dataset = []

    for patient in dataset:
        encrypted_patient = {
            "age": encrypt_value(patient["age"]),
            "gender": encrypt_value(patient["gender"]),
            "disease": encrypt_value(patient["disease"]),
            "blood_pressure": encrypt_value(patient["blood_pressure"]),
            "risk_score": encrypt_value(patient["risk_score"])
        }
        encrypted_dataset.append(encrypted_patient)

    return encrypted_dataset


def decrypt_dataset_raw(enc_dataset):
    decrypted_dataset = []

    for patient in enc_dataset:
        decrypted_patient = {
            "age": int(decrypt_value(patient["age"])),
            "gender": int(decrypt_value(patient["gender"])),
            "disease": int(decrypt_value(patient["disease"])),
            "blood_pressure": int(decrypt_value(patient["blood_pressure"])),
            "risk_score": int(decrypt_value(patient["risk_score"]))
        }
        decrypted_dataset.append(decrypted_patient)

    return decrypted_dataset

def vector_to_list(patient):
    return [
        patient["age"],
        patient["gender"],
        patient["disease"],
        patient["blood_pressure"],
        patient["risk_score"]
    ]


def dataset_to_vectors(dataset):
    return [vector_to_list(p) for p in dataset]


def filter_by_disease(dataset, disease_id):
    return [p for p in dataset if p["disease"] == disease_id]