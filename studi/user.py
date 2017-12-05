from sqlalchemy import Column

from studi import db


class User(db.Model):
    """"""
    __tablename__ = "users"

    id = Column(db.Integer, primary_key=True)
    username = Column(db.String)
    secret = Column(db.String)
    study = Column(db.String)
    locationX = Column(db.Float)
    locationY = Column(db.Float)

    def __init__(self, username, secret, s, x, y):
        """"""
        self.username = username
        self.secret = secret
        self.study = s
        self.locationX = x
        self.locationY = y

# create tables
db.create_all()
