from flask import flash, render_template, request, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
from studi import app, db
from studi.user import User


@app.before_request
def before_request():
    if not app.debug and request.url.startswith('http://'):
        url = request.url.replace('http://', 'https://', 1)
        return redirect(url, code=301)
    elif app.debug:
        print("Not forcing https because app.debug is set")
    session.permanent = True
    app.permanent_session_lifetime = datetime.timedelta(hours=2)
    session.modified = True


@app.route('/')
def home():
    return render_template("main_page.html")


@app.route('/home')
def redirect_old():
    return render_template(url_for('home'), code=301)  # for cordova install


@app.route('/create_group')
def create_group():
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
        return redirect(url_for('home'))
    return render_template("createAccount.html")


@app.route('/createAccount', methods=['POST'])
def do_create_account():
    username = str(request.form['username'])
    password = str(request.form['password'])
    confirm_password = str(request.form['confirm-password'])

    if len(username) == 0 or len(password) == 0 or len(confirm_password) == 0:
        flash("You must complete all fields!")
        return redirect(url_for('create'))

    if password != confirm_password:
        flash("Passwords didn't match!")
        return redirect(url_for('create'))

    s = db.session
    query = s.query(User).filter(User.username.in_([username]))
    result = query.first()
    if result is not None:
        flash("Username: '{}' is already in use!".format(username))
        return redirect(url_for('create'))

    hashed_password = generate_password_hash(password, method='sha256', salt_length=32)
    new_user = User(username, hashed_password)

    s.add(new_user)
    s.commit()
    flash("Account created!")
    return redirect(url_for('home'))


@app.route('/login', methods=['POST'])
def do_admin_login():
         
    post_username = str(request.form['username'])
    post_password = str(request.form['password'])
    
    s = db.session
    query = s.query(User).filter(User.username == post_username)
    result = query.first()

    if result and check_password_hash(result.secret, post_password):
        session['logged_in'] = True
        session['user_id'] = result.id
    else:
        flash("Incorrect username or password!")
    return redirect(url_for('home'))


@app.route("/logout")
def logout():
    session['logged_in'] = False
    return redirect(url_for('home'))
