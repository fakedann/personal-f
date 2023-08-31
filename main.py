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
            'email': self.email,
            'role': self.role
        }

class Assignment(db.Model):
    id = db.Column("id", db.Integer, primary_key=True)
    title = db.Column(db.String(50))
    prof_id = db.Column(db.Integer)
    stud_id = db.Column(db.Integer)
    s3_url = db.Column(db.String(50))
    grade = db.Column(db.Integer)

    def __init__(self, title, stud_id, url):
        self.title = title
        self.prof_id = 0
        self.stud_id = stud_id
        self.s3_url = url
        self.grade = -1

    def set_professor(self, prof_id):
        self.prof_id = prof_id

    def to_json(self):
        return {
            'id': self.id,
            'title': self.title,
            'professor_id': self.prof_id,
            'student_id': self.stud_id,
            'grade': self.grade,
            'url': self.s3_url
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
@app.route("/createUser", methods=["POST"])
def greet():
    user = request.form
    hola = Users.query.filter_by(email=user['email']).first()
    if hola:
        return jsonify('Already exists.')
    else:
        newUser = Users(user['email'], user['role'])
        db.session.add(newUser)
        db.session.commit()
        return newUser.to_json()

@app.route("/createHomework", methods=["POST"])
def create_homework():
    assignment = request.form
    print(assignment)
    if 'files[]' not in request.files:
        return jsonify('File not included.')
    else:
        hola = Users.query.filter_by(email=assignment['email']).first()
        if hola:
            rand_id = uuid.uuid4().hex+".png"
            file = request.files['files[]']
            s3 = bot_session.resource("s3")
            s3.Bucket("test1fa").upload_fileobj(file, rand_id)
            assg = Assignment(assignment['title'], hola.id, rand_id)
            prof = Users.query.filter_by(email="joseleon@gmail.com").first()
            assg.set_professor(prof.id)
            db.session.add(assg)
            db.session.commit()
            print(assg.id)
            return jsonify('https://test1fa.s3.amazonaws.com/'+rand_id)
        else:
            return jsonify('We could not find the email submitted.')

@app.route("/hola", methods=["POST"])
def holaa():
    print(request.form['email'])
    chao = Users.query.filter_by(email="joseleon@gmail.com")
    hola = Assignment(request.form['title'], chao.id, '82913dasdsa')
    # db.session.add(hola)
    # db.session.commit()
    
    # db.session.query(Assignment).delete()
    # db.session.commit()
    
    return hola
    
@app.route("/users", methods=["GET"])
def check_users():
    all_users = Assignment.query.filter_by(id=8).first()
    return all_users.to_json()


if __name__ == "__main__":
    #Run the app in debug mode to auto-reload
    app.run(debug=True)
