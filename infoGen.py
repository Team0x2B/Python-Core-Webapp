from sqlalchemy import *
from sqlalchemy import create_engine, ForeignKey
from sqlalchemy import Column, Date, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref

engine = create_engine('sqlite:///users.db', echo=True)
Base = declarative_base()

########################################################################
class Info(Base):
    """"""
    __tablename__ = "info"

    id = Column(Integer, primary_key=True)
    username = Column(String)
    name = Column(String)
    topic = Column(String)
    specifics = Column(String)
    location = Column(Boolean)

#----------------------------------------------------------------------
    def __init__(self, username, name, topic, specifics, location):
        """"""
        self.username = username
        self.name = name
        self.topic = topic
        self.specifics = specifics
        self.location = location
# create tables
Base.metadata.create_all(engine)
