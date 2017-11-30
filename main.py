from flask import Flask, flash, render_template, request, session
import os
from flask_sqlalchemy import SQLAlchemy
import config


app = Flask(__name__)
 
app.config['SQLALCHEMY_DATABASE_URI'] = config.database_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = config.secret_key

db = SQLAlchemy(app)

from user import *


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
         
    POST_USERNAME = str(request.form['username'])
    POST_PASSWORD = str(request.form['password'])
    
    s = db.session
    query = s.query(User).filter(User.username.in_([POST_USERNAME]), User.password.in_([POST_PASSWORD]) )
    result = query.first()

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
    app.run(debug=False, host='0.0.0.0', port=4000)
