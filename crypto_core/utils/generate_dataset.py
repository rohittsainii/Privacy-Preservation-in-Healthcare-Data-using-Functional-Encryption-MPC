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

def generate_dataset(n=100):
    return [generate_patient() for _ in range(n)]