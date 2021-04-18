from flask import Flask, request, make_response, jsonify
from flask_jwt_extended.utils import set_access_cookies, unset_jwt_cookies
from flask_wtf.csrf import CSRFProtect, generate_csrf
# from flask_cors import CORS, cross_origin
from mongoengine.errors import ValidationError, DoesNotExist, NotUniqueError
from database.db import initialize_db
from database.models import Note, User
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
import datetime
import os
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path=dotenv_path)

jwt_secret = os.environ.get("JWT_SECRET_KEY")
app_secret = os.environ.get("SECRET_KEY")
DB = os.environ.get("DB")
DB_PASS = os.environ.get("DB_PASS")

app = Flask(__name__)

# cors = CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'

app.config['JWT_SECRET_KEY'] = jwt_secret
app.config['SECRET_KEY'] = app_secret
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config["JWT_COOKIE_SECURE"] = False

csrf = CSRFProtect(app)
app.config["JWT_COOKIE_CSRF_PROTECT"] = False

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

host = DB.replace("<password>", DB_PASS)

app.config['MONGODB_SETTINGS'] = {
    'host': host
}

initialize_db(app)

@app.route("/api/getcsrf", methods=["GET"])
def get_csrf():
    token = generate_csrf()
    response = jsonify({"detail": "CSRF cookie set"})
    response.headers.set("X-CSRFToken", token)
    return response

@app.route('/api/notes')
@jwt_required()
def get_notes():
    user_id = get_jwt_identity()
    notes = Note.objects(added_by=user_id)
    response = make_response({
        "status": "success",
        "notes": notes
    })
    return response, 200

@app.route('/api/notes/<id>', methods=["GET"])
@jwt_required()
def get_one_note(id):
    user_id = get_jwt_identity()
    note = Note.objects.get(id=id, added_by=user_id)
    response = make_response({
        "status": "success",
        "note": note
    })
    return response, 200


@app.route('/api/notes', methods=['POST'])
@jwt_required()
def add_note():
    user_id = get_jwt_identity()

    body = request.get_json()

    user = User.objects.get(id=user_id)
    note = Note(**body, added_by=user)
    note.save()

    response = make_response({
        "status": "success",
        "note": note
    })

    return response


@app.route('/api/notes/<id>', methods=["PATCH"])
@jwt_required()
def update_note(id):

    user_id = get_jwt_identity()

    note = Note.objects.get(id=id, added_by=user_id)

    body = request.get_json()

    note.modify(**body)

    response = make_response({
        "status": "success",
        "note": note
    })

    return response

@app.route('/api/notes/<id>', methods=["DELETE"])
@jwt_required()
def delete_note(id):
    user_id = get_jwt_identity()

    Note.objects.get(id=id, added_by=user_id).delete()

    return {
        "status": "success",
        "message": "resource deleted!"
    }, 200


@app.route('/user/signup', methods=["POST"])
def signup():
    try:
        body = request.get_json()
        user = User(**body)

        if len(user.password) < 8:
            response = make_response({
                "status": "fail",
                "message": "password must be atleast 8 characters long"
            })
            return response

        user.hash_password()
        user.save()
        return {
            "status": "success",
            "user": user
        }, 200

    except ValidationError:
        response = make_response({
        "status": "fail",
        "message": "This is not a valid phone number"
        })
        return response, 400
    
    except NotUniqueError:
        response = make_response({
            "status": "fail",
            "message": "Account already exists!"
        })
        return response, 409



@app.route('/user/login', methods=["POST"])
def login():
    try:
        body = request.get_json()
        user = User.objects.get(email=body.get("email"))

        authorized = user.check_password(body.get("password"))
        if not authorized:
            return {
                "status": "fail",
                "message": 'Incorrect email or password!'
            }, 401

        expires = datetime.timedelta(minutes=5)
        access_token = create_access_token(
            identity=str(user.id),
            expires_delta=expires
        )

        response = make_response({
            "status": "Success",
            "token": access_token
        })

        set_access_cookies(response, access_token)
        return response

    except DoesNotExist:
        return {
            "status": "fail",
            "message": "Account does not exist"
        }, 404


@app.route("/user/logout", methods=["GET"])
def logout():
    response = make_response({
        "status": "success",
        "message": "logout successful"
    })
    unset_jwt_cookies(response)
    return response


@app.route("/user/get_loggedin_user", methods=["GET"])
@jwt_required(optional=True)
def get_loggedin_user():
    user = get_jwt_identity()

    if not user:
        response = make_response({
            "status": "fail",
            "message": "not logged in"
        })
        return response

    response = make_response({
        "status": "success",
        "user": user
    })
    return response
