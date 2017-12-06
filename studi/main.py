from flask import Flask, flash, render_template, request, session, jsonify
import datetime
from studi.user import User
from studi import app, db
from sqlalchemy.orm import sessionmaker
from tabledef import *
from flask_sqlalchemy import SQLAlchemy
import os,logging,sys,json
import collections
from tabledef import *


logging.basicConfig(stream=sys.stderr, level=logging.DEBUG)


@app.before_request
def before_request():
    session.permanent = True
    app.permanent_session_lifetime = datetime.timedelta(hours=2)
    session.modified = True


# Define GET getUsers API
@app.route('/api/getUsers')
def getUsers():
        logging.debug("inside getUsers")
        conn = db.session # connect to database
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
            #d['email']=row[6]
            results.append(d)
        #logging.debug(results)

        # return JSON results
        return jsonify(results)

#Define POST saveUser/<Id>
@app.route('/api/saveUser/<int:id>',methods=['POST'])
def saveUser(id):
    conn = db.session
    logging.debug("Save API ID=" + str(id))
    user = conn.query(User.id)
    #user = User.query.get(id)
    logging.debug(request.data);
    data = json.loads(request.data)
    user.study = data['study']
    conn.commit()
    logging.debug(data['study'])
    return jsonify( {'status':'ok'})




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
    if session.get('logged_in'):
        return home()
    return render_template("createAccount.html")


@app.route('/createAccount', methods=['POST'])
def do_create_account():
    username = str(request.form['username'])
    password = str(request.form['password'])
    confirm_password = str(request.form['confirm-password'])

    if len(username) == 0 or len(password) == 0 or len(confirm_password) == 0:
        flash("You must complete all fields!")
        return create()

    if password != confirm_password:
        flash("Passwords didn't match!")
        return create()

    s = db.session
    query = s.query(User).filter(User.username.in_([username]))
    result = query.first()
    if result is not None:
        flash("Username: '{}' is already in use!".format(username))
        return create()

    new_user = User(username, password, "", 0, 0)
    s.add(new_user)
    s.commit()
    flash("Account created!")
    return home()


@app.route('/login', methods=['POST'])
def do_admin_login():
         
    post_username = str(request.form['username'])
    post_password = str(request.form['password'])
    
    s = db.session
    query = s.query(User).filter(User.username.in_([post_username]), User.password.in_([post_password]))
    result = query.first()

    if result:
        session['logged_in'] = True
        session['id']=result.id
        session['username']=result.username
        session['study']=result.study
        session['locationX']=result.locationX
        session['locationY']=result.locationY
    else:
        flash('wrong password!')
    return home()


@app.route("/logout")
def logout():
    session['logged_in'] = False
    return home()
