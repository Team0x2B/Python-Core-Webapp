from flask import Flask, url_for
from flask_sqlalchemy import SQLAlchemy

from studi import config

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = config.database_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = config.secret_key

db = SQLAlchemy(app)

from studi import user, studygroup  # import all ORM objects here
db.create_all()

import studi.main  # import all views here
import studi.api   # import json apis here
