from sqlalchemy import Column
from main import db


class User(db.Model):
    """"""
    __tablename__ = "users"

    id = Column(db.Integer, primary_key=True)
    username = Column(db.String)
    password = Column(db.String)
    study = Column(db.String)
    locationX = Column(db.Float)
    locationY = Column(db.Float)

    def __init__(self, username, password, s, x, y):
        """"""
        self.username = username
        self.password = password
        self.study = s
        self.locationX = x
        self.locationY = y

# create tables
db.create_all()
