import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate("./serviceAccountKey.json") # given by chirag sir in slack
app = firebase_admin.initialize_app(cred)
print(app, dir(app), app.__dict__)
