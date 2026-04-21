from crypto_core.mpc_module.mpc_core import secure_sum, secure_average

values = [30, 63]

print("Values:", values)

total = secure_sum(values)
avg = secure_average(values)

print("Secure Sum:", total)
print("Secure Average:", avg)