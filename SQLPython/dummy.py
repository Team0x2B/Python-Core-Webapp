import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from tabledef import *

engine = create_engine('sqlite:///users.db', echo=True)
 
# create a Session
Session = sessionmaker(bind=engine)
session = Session()
 
user = User("admin","password","",0,0)
session.add(user)
 
user = User("python","python","",0,0)
session.add(user)
 
user = User("jumpiness","python","",0,0)
session.add(user)
 
# commit the record the database
session.commit()
 
session.commit()
