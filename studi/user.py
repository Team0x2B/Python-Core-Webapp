from sqlalchemy import Column
from studi import db


class User(db.Model):
    """"""
    __tablename__ = "users"

    id = Column(db.Integer, primary_key=True)
    username = Column(db.String)
    secret = Column(db.String)

    def __init__(self, username, secret):
        """"""
        self.username = username
        self.secret = secret
