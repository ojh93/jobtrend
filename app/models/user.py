users = []

def find_user(email):
    return next((u for u in users if u['email'] == email), None)

def create_user(name, email, password):
    users.append({'name': name, 'email': email, 'password': password})
