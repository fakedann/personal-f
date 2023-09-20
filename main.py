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

    def set_grade(self, grade):
        self.grade = grade

    def to_json(self):
        return {
            'id': self.id,
            'title': self.title,
            'professor_id': self.prof_id,
            'student_id': self.stud_id,
            'grade': self.grade,
            'url': self.s3_url
        }

class Complaint(db.Model):
    id = db.Column("id", db.Integer, primary_key=True)
    prof_id = db.Column(db.Integer)
    stud_id = db.Column(db.Integer)
    assg_id = db.Column(db.Integer)
    status = db.Column(db.Integer)
    message = db.Column(db.String(50))

    def __init__(self, stud_id, assg_id, message):
        self.prof_id = 3
        self.stud_id = stud_id
        self.assg_id = assg_id
        self.status = 0
        self.message = message

    def to_json(self):
        return {
            'id': self.id,
            'prof_id': self.prof_id,
            'stud_id': self.stud_id,
            'assg_id': self.assg_id,
            'status': self.status,
            'message': self.message
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
    if 'files[]' not in request.files:
        return jsonify('File not included.')
    else:
        hola = Users.query.filter_by(email=assignment['email']).first()
        if hola:
            rand_id = uuid.uuid4().hex+".pdf"
            file = request.files['files[]']
            s3 = bot_session.resource("s3")
            s3.Bucket("test1fa").upload_fileobj(file, rand_id)
            assg = Assignment(assignment['title'], hola.id, rand_id)
            prof = Users.query.filter_by(email="daniel07escalona@gmail.com").first()
            assg.set_professor(prof.id)
            db.session.add(assg)
            db.session.commit()
            return jsonify('https://test1fa.s3.amazonaws.com/'+rand_id)
        else:
            return jsonify('We could not find the email submitted.')

@app.route("/assignments/<user_email>", methods=["GET"])
def assgs(user_email):
    person = Users.query.filter_by(email=user_email).first()
    if user_email == "daniel07escalona@gmail.com":
        all_users = Assignment.query.filter_by(prof_id=person.id).all()
        arr = [{'id':assg.id, 'title':assg.title, 'prof_id':assg.prof_id, 'url':'https://test1fa.s3.amazonaws.com/'+assg.s3_url, 'grade':assg.grade, 'student':Users.query.filter_by(id=assg.stud_id).first().email} for assg in all_users]
    else:
        all_users = Assignment.query.filter_by(stud_id=person.id).all()
        arr = [{'id':assg.id, 'title':assg.title, 'prof_id':assg.prof_id, 'url':'https://test1fa.s3.amazonaws.com/'+assg.s3_url, 'grade':assg.grade} for assg in all_users]
    return jsonify(arr)

@app.route("/gradeAssignment", methods=["POST"])
def grade_assignment():
    change = request.form
    print(change)
    assg = Assignment.query.filter_by(id=change['id']).first()
    assg.set_grade(change['grade'])
    db.session.add(assg)
    db.session.commit()
    return jsonify('success!')

@app.route("/complaints/<user_email>", methods=["GET"])
def compls(user_email):
    person = Users.query.filter_by(email=user_email).first()
    if user_email == "daniel07escalona@gmail.com":
        all_complaints = Complaint.query.filter_by(prof_id=3).all()
        arr = [{'id':compl.id, 'stud_id':compl.stud_id, 'prof_id':compl.prof_id, 'assg_id': compl.assg_id, 'status': compl.status, 'message':compl.message, 'student':Users.query.filter_by(id=compl.stud_id).first().email} for compl in all_complaints]
    else:
        all_complaints = Complaint.query.filter_by(stud_id=person.id).all()
        arr = [{'id':compl.id, 'stud_id':compl.stud_id, 'prof_id':compl.prof_id, 'assg_id': compl.assg_id, 'status': compl.status, 'message':compl.message} for compl in all_complaints]
    return jsonify(arr)
    
@app.route("/review_complaint/<complaint_id>", methods=["POST"])
def review_complaint(complaint_id):
    compl = Complaint.query.filter_by(id=complaint_id).first()
    if compl:
        assg = Assignment.query.filter_by(id=compl.assg_id).first()
        assg.grade = request.form['grade']
        compl.message = request.form['message']
        compl.status = 1
        db.session.add(compl, assg)
        db.session.commit()
        return jsonify('Success')
    else:
        return jsonify('incorrect number!')

@app.route("/create_complaint/<user_email>", methods=["POST"])
def create_complaint(user_email):
    person = Users.query.filter_by(email=user_email).first()
    assg = Assignment.query.filter_by(id=request.form['assgid'], stud_id=person.id).first()
    if assg:
        compl = Complaint(person.id, request.form['assgid'], request.form['message'])
        db.session.add(compl)
        db.session.commit()
        return jsonify('working!') 
    else:
        print('nothing!')
        return jsonify('failed'), 404

@app.route("/user_assignments/<user_email>", methods=["GET"])
def get_assignments(user_email):
    person = Users.query.filter_by(email=user_email).first()
    assgs = Assignment.query.filter_by(stud_id=person.id).all()
    arr = [{'id':assg.id, 'title':assg.title, 'grade':assg.grade} for assg in assgs]
    return jsonify(arr)

@app.route("/users", methods=["GET"])
def check_users():
    db.session.query(Complaint).delete()
    db.session.commit()
    # compls = Assignment.query.all()
    # arr = [{'id':compl.id, 'title':compl.title} for compl in compls]
    # return jsonify(arr)
    return jsonify('deleting!')


if __name__ == "__main__":
    #Run the app in debug mode to auto-reload
    app.run(debug=True)
