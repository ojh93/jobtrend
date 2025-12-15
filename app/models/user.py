<<<<<<< HEAD
users = []

def find_user(email):
    return next((u for u in users if u['email'] == email), None)

def create_user(name, email, password):
    users.append({'name': name, 'email': email, 'password': password})
=======
users = []

def find_user(email):
    return next((u for u in users if u['email'] == email), None)

def create_user(name, email, password):
    users.append({'name': name, 'email': email, 'password': password})
>>>>>>> a9ccfb7 (feat: 최신 Dockerfile 및 라우트 오류 수정 사항 반영)
