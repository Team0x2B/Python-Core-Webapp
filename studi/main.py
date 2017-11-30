from flask import flash, render_template, request, session
import datetime
from studi.user import User
from studi import app, db


@app.before_request
def before_request():
    session.permanent = True
    app.permanent_session_lifetime = datetime.timedelta(hours=2)
    session.modified = True


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
    else:
        flash('wrong password!')
    return home()


@app.route("/logout")
def logout():
    session['logged_in'] = False
    return home()
