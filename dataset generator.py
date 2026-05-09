import csv
import random

NUM_RECORDS = 10000

genders = [0, 1]

diseases = [0, 1, 2, 3, 4, 5]

output_file = "healthcare_dataset.csv"


with open(output_file, mode="w", newline="") as file:

    writer = csv.writer(file)

    writer.writerow([
        "patient_id",
        "age",
        "gender",
        "disease",
        "blood_pressure",
        "risk_score"
    ])


    for i in range(NUM_RECORDS):

        patient_id = f"P{1000 + i}"

        age = random.randint(18, 90)

        gender = random.choice(genders)

        disease = random.choice(diseases)

        blood_pressure = random.randint(90, 160)

        risk_score = random.randint(1, 100)

        writer.writerow([
            patient_id,
            age,
            gender,
            disease,
            blood_pressure,
            risk_score
        ])


print(
    f"Dataset generated successfully: {output_file}"
)
