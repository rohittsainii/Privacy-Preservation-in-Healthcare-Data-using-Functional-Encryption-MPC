import random

PRIME = 2**127 - 1

def mod_p(x):
    return x % PRIME

# Generate polynomial
def generate_polynomial(secret, degree):
    coeffs = [secret] + [random.randint(1, PRIME) for _ in range(degree)]
    return coeffs

# Evaluate polynomial
def eval_polynomial(coeffs, x):
    result = 0
    for power, coef in enumerate(coeffs):
        result += coef * (x ** power)
    return mod_p(result)

# Split secret into shares
def generate_shares(secret, n=3, t=2):
    coeffs = generate_polynomial(secret, t-1)
    shares = [(i, eval_polynomial(coeffs, i)) for i in range(1, n+1)]
    return shares

# Reconstruct using Lagrange interpolation
def reconstruct_secret(shares):
    secret = 0

    for j, (xj, yj) in enumerate(shares):
        num, den = 1, 1

        for m, (xm, _) in enumerate(shares):
            if m != j:
                num *= -xm
                den *= (xj - xm)

        lagrange = num * pow(den, -1, PRIME)
        secret += yj * lagrange

    return mod_p(secret)