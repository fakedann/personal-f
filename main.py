from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import boto3

app = Flask(__name__)
# app.secret_key = "hello"
bot_session = boto3.Session(profile_name= 'fakey')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app, intercept_exceptions=False, supports_credentials=True)

class Friends(db.Model):
    id = db.Column("id", db.Integer, primary_key=True)
    name = db.Column(db.String(50))

    def __init__(self, name):
        self.name = name

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
        }

class Homework(db.Model):
    id = db.Column("id", db.Integer, primary_key=True)
    name = db.Column(db.String(50))

    def __init__(self, name):
        self.name = name

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
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
        file = request.files['files[]']
        s3 = bot_session.resource("s3")
        s3.Bucket("test1fa").upload_fileobj(file, "532131235.pdf")
        # return jsonify('https://test1fa.s3.amazonaws.com/4444.png')

    friend = Friends(name['name'])
    db.session.add(friend)
    homehome = Homework(name['role'])
    db.session.add(homehome)
    db.session.commit()
    print(homehome, friend)
    return homehome.to_json()


if __name__ == "__main__":
    #Run the app in debug mode to auto-reload
    app.run(debug=True)
