import random
def generate_patient():
    return {
        "patient_id": random.randint(1000,9999),
        "age": random.randint(18,90),
        "gender": random.randint(0,1),
        "disease": random.randint(0,5),
        "blood_pressure": random.randint(90,160),
        "risk_score": random.randint(1,100)
    }
def generate_dataset(n=10):
    return [generate_patient() for _ in range(n)]
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