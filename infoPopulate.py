import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from tabledef import *

engine = create_engine('sqlite:///users.db', echo=True)
 
# create a Session
Session = sessionmaker(bind=engine)
session = Session()
 
user = Info("admin","root","","",False)
session.add(user)
 
user = Info("python","python","","",False)
session.add(user)
 
user = Info("jumpiness","Jumpy","",0,True)
session.add(user)
 
# commit the record the database
session.commit()
 
session.commit()
