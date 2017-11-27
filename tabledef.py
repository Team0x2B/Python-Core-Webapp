from sqlalchemy import *
from sqlalchemy import create_engine, ForeignKey
from sqlalchemy import Column, Date, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref

engine = create_engine('sqlite:///users.db', echo=True)
Base = declarative_base()

########################################################################
class User(Base):
    """"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String)
    password = Column(String)
    study = Column(String)
    locationX = Column(Float)
    locationY = Column(Float)

#----------------------------------------------------------------------
    def __init__(self, username, password, s, x, y):
        """"""
        self.username = username
        self.password = password
        self.study = s
        self.locationX = x
        self.locationY = y
# create tables
Base.metadata.create_all(engine)
