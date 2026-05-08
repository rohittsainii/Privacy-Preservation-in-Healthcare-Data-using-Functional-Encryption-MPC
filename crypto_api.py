from flask import Flask, request, jsonify

from crypto_core.security.aes import encrypt_value

app = Flask(__name__)

@app.route("/encrypt", methods=["POST"])
def encrypt_patient():

    data = request.json

    encrypted_data = {
        "age": encrypt_value(data["age"]),
        "gender": encrypt_value(data["gender"]),
        "disease": encrypt_value(data["disease"]),
        "blood_pressure": encrypt_value(data["blood_pressure"]),
        "risk_score": encrypt_value(data["risk_score"])
    }

    return jsonify({
        "success": True,
        "encrypted_data": encrypted_data
    })


if __name__ == "__main__":
    app.run(port=5001, debug=True)