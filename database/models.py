from mongoengine.errors import ValidationError
from .db import db
from flask_bcrypt import generate_password_hash, check_password_hash

class Note(db.Document):
    title = db.StringField(required=True)
    content = db.StringField(default="")
    added_by = db.ReferenceField('User')

def phone_validation(phone):
    if len(str(phone)) < 6 or len(str(phone)) > 10:
        raise ValidationError("This is not a valid phone number")

class User(db.Document):

    first_name = db.StringField(required=True)
    last_name = db.StringField(required=True)
    phone_number = db.IntField(required=True, validation=phone_validation)
    email = db.EmailField(required=True, unique=True)
    password = db.StringField(required=True)

    def hash_password(self):
        self.password = generate_password_hash(self.password).decode('utf8')
    
    def check_password(self, password):
        return check_password_hash(self.password, password)
