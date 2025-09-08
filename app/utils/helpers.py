import hashlib

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(input_pw, stored_pw_hash):
    return hash_password(input_pw) == stored_pw_hash
