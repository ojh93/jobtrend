<<<<<<< HEAD
import hashlib

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(input_pw, stored_pw_hash):
    return hash_password(input_pw) == stored_pw_hash
=======
import hashlib

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(input_pw, stored_pw_hash):
    return hash_password(input_pw) == stored_pw_hash
>>>>>>> a9ccfb7 (feat: 최신 Dockerfile 및 라우트 오류 수정 사항 반영)
