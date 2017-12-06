from sqlalchemy import Column
from sqlalchemy.orm import relationship
from studi import db


class User(db.Model):
    """"""
    __tablename__ = "users"

    id = Column(db.Integer, primary_key=True)
    username = Column(db.String)
    secret = Column(db.String)
    groups = relationship("GroupMembership",
                          cascade="save-update, merge, "
                                  "delete, delete-orphan"
                          )

    def __init__(self, username, secret):
        """"""
        self.username = username
        self.secret = secret
