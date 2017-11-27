from flask import Flask
from flask import Flask, flash, redirect, render_template, request, session, abort
import os
from sqlalchemy.orm import sessionmaker
from tabledef import *
from flask_restful import Resource, Api
#from json import dumps
import json
from flask.ext.jsonpify import jsonify
import logging,sys
import collections

logging.basicConfig(stream=sys.stderr, level=logging.DEBUG)

engine = create_engine('sqlite:///users.db', echo=True)

app = Flask(__name__)
api = Api(app)
'''
class Employees(Resource):
    def post(self):
        POST_USERNAME = str(request.form['username'])
        POST_PASSWORD = str(request.form['password'])
        conn = engine.connect() # connect to database
        query = conn.execute("INSERT INTO users (username,password) VALUES(?,?,?,?)",(POST_USERNAME,POST_PASSWORD)) # This line performs query and returns json result
        engine.commit()
'''
class users(Resource):
    def get(self):
        conn = engine.connect() # connect to database
        query = conn.execute("select * from users") # This line performs query and returns json result
        rows = query.cursor.fetchall()
        results = []
        for row in rows:
            d = collections.OrderedDict()
            d['id'] = row[0]
            d['username'] = row[1]
            d['password'] = row[2]
            d['study'] = row[3]
            d['locationX'] = row[4]
            d['locationY'] = row[5]
            results.append(d)
        logging.debug(results)
        return results
api.add_resource(users, '/users')



@app.route('/')
def home():
    if not session.get('logged_in'):
        return render_template('login.html')
    else:
        return render_template("landing.html")
@app.route('/nearby')
def nearby():
    return "This section isn't up and running yet, check back soon!"

@app.route('/create')
def create():
    return render_template("CreateAccount.html")

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
        session['logged_in'] = True
    else:
        flash('wrong password!')
    return home()
      
@app.route("/logout")
def logout():
    session['logged_in'] = False
    return home()
         
if __name__ == "__main__":
    app.secret_key = os.urandom(12)
    app.run(debug=True,host='0.0.0.0', port=4000,
    ssl_context=('./server.pem','./server.pem'))
#openssl req -new -x509 -keyout server.pem -out server.pem -days 365 -nodes