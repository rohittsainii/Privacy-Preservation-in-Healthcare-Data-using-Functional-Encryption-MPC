from .fe_core import inner_product

def encrypt_dataset(mpk, vectors, encrypt_fn):
    encrypted_data = []
    masks = []

    for v in vectors:
        cipher, r = encrypt_fn(mpk, v)
        encrypted_data.append(cipher)
        masks.append(r)

    return encrypted_data, masks

def compute_sum(encrypted_data, function_key, masks):
    total = 0
    for cipher, r in zip(encrypted_data, masks):
        masked = inner_product(cipher, function_key)
        correction = r * sum(function_key)
        total += (masked - correction)

    return total

def compute_average(encrypted_data, function_key, masks):
    total = compute_sum(encrypted_data, function_key, masks)
    return total / len(encrypted_data)

def compute_average(encrypted_data, function_key, masks):
    if len(encrypted_data) == 0:
        return 0   # or None
    
    total = compute_sum(encrypted_data, function_key, masks)
    return total / len(encrypted_data)