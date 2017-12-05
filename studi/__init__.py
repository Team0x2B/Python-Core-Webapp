from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

from studi import config

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = config.database_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = config.secret_key

db = SQLAlchemy(app)


import studi.main



