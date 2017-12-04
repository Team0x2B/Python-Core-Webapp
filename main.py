from flask import Flask, flash, redirect, render_template, request, session, abort, jsonify
from sqlalchemy.orm import sessionmaker
from tabledef import *
from flask_restful import Resource, Api
#from flask.ext.sqlalchemy import SQLAlchemy
from flask_sqlalchemy import SQLAlchemy
import os,logging,sys,ssl
import collections
import BaseHTTPServer, SimpleHTTPServer
import flask_sqlalchemy

logging.basicConfig(stream=sys.stderr, level=logging.DEBUG)

engine = create_engine('sqlite:///users.db', echo=True)

app = Flask(__name__)
app.config.from_pyfile('config.py')
db = SQLAlchemy(app)

# Model for Users database
class Users(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(255))
  study = db.Column(db.String(255))
  locationX = db.Column(db.String(255))
  locationY = db.Column(db.String(255))

  def __init__(self, username, password, study, locationX, locationY):
    self.username = username
    self.study = study
    self.locationX = locationX
    self.locationY = locationY

# Define GET getUsers API
@app.route('/api/getUsers')
def getUsers():
        conn = engine.connect() # connect to database
        query = conn.execute("select * from users") # perform query
        rows = query.cursor.fetchall() # get all results

        # convert to JSON compatible format with keys matching columns
        results = []
        for row in rows:
          d = collections.OrderedDict()
          d['id'] = row[0]
          d['username'] = row[1]
          d['password'] = row[2]
          d['study'] = row[3]
          d['locationX'] = row[4]
          d['locationY'] = row[5]
          d['email']=row[6]
          results.append(d)
        logging.debug(results)

        # return JSON results
        return jsonify(results)

#Define POST saveUser/<Id>
@app.route('/api/saveUser/<int:id>',methods=['POST'])
def saveUser(id):
  user = Users.query.get(id)
  logging.debug(request.data);
  data = json.loads(request.data)
  user.study = data['study']
  db.session.commit()
  return jsonify( {'status':'ok'})



# main login
@app.route('/')
def home():
    if not session.get('logged_in'):
        return render_template('login.html')
    else:
        #logging.debug("username:" + session['username'])
        return render_template("landing.html")

# Following may not be needed
#@app.route('/nearby')
#def nearby():
#    return "This section isn't up and running yet, check back soon!"

# create new account page
@app.route('/create')
def create():
    return render_template("createAccount.html")

# login page
@app.route('/login', methods=['POST'])
def do_admin_login():

    POST_USERNAME = str(request.form['username'])
    POST_PASSWORD = str(request.form['password'])

    Session = sessionmaker(bind=engine)
    s = Session()
    query = s.query(User).filter(User.username.in_([POST_USERNAME]), User.password.in_([POST_PASSWORD]) )
    result = query.first()
    #print(result)
    if result:
        logging.debug('Logged in user: ' + result.username)
        session['logged_in'] = True
        session['id']=result.id
        session['username']=result.username
        session['study']=result.study
        session['locationX']=result.locationX
        session['locationY']=result.locationY

    else:
        flash('wrong password!')
    return home()


# logout page
@app.route("/logout")
def logout():
    session['logged_in'] = False
    return home()

if __name__ == "__main__":
    app.secret_key = os.urandom(12)
    #need to have https:// for maps to work when accessed from ip address
    app.run(debug=True,host='0.0.0.0', port=4000,
    ssl_context=('./server.pem','./server.pem'))
#openssl req -new -x509 -keyout server.pem -out server.pem -days 365 -nodes