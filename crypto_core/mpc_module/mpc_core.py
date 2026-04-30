from .shamir import generate_shares, reconstruct_secret

# Secure sum using secret sharing
def secure_sum(values, n=3, t=2):
    all_shares = []

    # Step 1: each value → shares
    for val in values:
        shares = generate_shares(val, n, t)
        all_shares.append(shares)

    # Step 2: sum shares index-wise
    summed_shares = []
    for i in range(n):
        x = all_shares[0][i][0]
        y_sum = sum(shares[i][1] for shares in all_shares)
        summed_shares.append((x, y_sum))

    # Step 3: reconstruct
    return reconstruct_secret(summed_shares[:t])


# Secure average
def secure_average(values):
    total = secure_sum(values)
    return total / len(values)