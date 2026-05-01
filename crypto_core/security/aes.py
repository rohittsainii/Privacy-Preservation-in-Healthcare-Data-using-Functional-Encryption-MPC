from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import base64

key = b'1234567890123456'  # fixed demo key

def encrypt_value(value):
    cipher = AES.new(key, AES.MODE_EAX)
    ciphertext, tag = cipher.encrypt_and_digest(str(value).encode())
    return base64.b64encode(cipher.nonce + ciphertext).decode()

def decrypt_value(enc):
    data = base64.b64decode(enc)
    nonce = data[:16]
    ciphertext = data[16:]
    cipher = AES.new(key, AES.MODE_EAX, nonce=nonce)
    return cipher.decrypt(ciphertext).decode()