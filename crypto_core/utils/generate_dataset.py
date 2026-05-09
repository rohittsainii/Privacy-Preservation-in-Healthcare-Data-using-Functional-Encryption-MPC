import random

def generate_dataset(num_records):

    dataset = []

    for i in range(num_records):

        patient = {

            "patient_id": f"P{i+1}",

            "age": random.randint(20, 80),

            "gender": random.randint(0, 1),

            "disease": random.randint(0, 5),

            "blood_pressure": random.randint(90, 160),

            "risk_score": random.randint(1, 100)

        }

        dataset.append(patient)

    return dataset
