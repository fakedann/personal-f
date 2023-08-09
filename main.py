import email
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import boto3
import uuid

app = Flask(__name__)
app.secret_key = "hello"
bot_session = boto3.Session(profile_name= 'fakey')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app, intercept_exceptions=False, supports_credentials=True)

class Users(db.Model):
    id = db.Column("id", db.Integer, primary_key=True)
    email = db.Column(db.String(50))
    role = db.Column(db.String(10))

    def __init__(self, email, role):
        self.email = email
        self.role = role

    def to_json(self):
        return {
            'id': self.id,
            'name': self.email,
            'role': self.role
        }

class Homework(db.Model):
    id = db.Column("id", db.Integer, primary_key=True)
    prof_id = db.Column(db.Integer)
    stud_id = db.Column(db.Integer)

    def __init__(self, name, prof_id, stud_id):
        self.name = name
        self.prof_id = prof_id
        self.stud_id = stud_id

    def to_json(self):
        return {
            'id': self.id,
            'professor_id': self.prof_id,
            'student_id': self.stud_id
        }


with app.app_context():
    db.create_all()
        

@app.route('/')
def hello_world():
    #Rendering HTML Elements
    return '<h1 style="text-align: center">Hello, World!</h1>' \
           '<p>This is a paragraph.</p>' \
           '<img src="https://media.giphy.com/media/hvS1eKlR75hMr0l7VJ/giphy.gif" width=200>'


#Creating variable paths and converting the path to a specified data type
# /username/<name> 
@app.route("/username", methods=["POST"])
def greet():
    name = request.form
    print(name)
    if 'files[]' not in request.files:
        print('not yet dani')
    else:
        rand_id = uuid.uuid4().hex+".png"
        file = request.files['files[]']
        s3 = bot_session.resource("s3")
        s3.Bucket("test1fa").upload_fileobj(file, rand_id)
        # return jsonify('https://test1fa.s3.amazonaws.com/4444.png')

    friend = Users(name['name'], name['role'])
    db.session.add(friend)
    # homehome = Homework(name['role'])
    # db.session.add(homehome)
    db.session.commit()
    print(friend)
    return friend.to_json()
    # return jsonify('hola')


if __name__ == "__main__":
    #Run the app in debug mode to auto-reload
    app.run(debug=True)
