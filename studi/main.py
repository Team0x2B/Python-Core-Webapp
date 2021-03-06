from flask import flash, render_template, request, session, redirect, url_for, abort
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
from studi import app, db
from studi.user import User
from studi.studygroup import StudyGroup


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


@app.route("/group_info")
def redirect_from_group_info():
    return redirect(url_for('home'), code=301)


@app.route('/home')
def redirect_old():
    return redirect(url_for('home'), code=301)  # for cordova install


@app.route('/create_group')
def create_group():
    if not session.get('logged_in'):
        session['redirect-target'] = url_for('create_group')
        print("Set redirect target: {}".format(session['redirect-target']))
        return redirect(url_for('login'))
    else:
        return render_template("landing.html")


@app.route('/group_info/<int:group_id>')
def group_info(group_id):
    group = db.session.query(StudyGroup).filter(StudyGroup.id == group_id).first()

    if not group:
        abort(404)

    members = []
    for m in group.members:
        members.append({"name": m.user.username, "role": m.role.title()})

    can_delete = False
    can_join = False
    can_leave = False

    if session.get("logged_in"):
        user = db.session.query(User).filter(User.id == session['user_id']).first()
        can_delete = group.can_user_delete(user)
        can_join = group.can_user_join(user)
        can_leave = group.can_user_leave(user)

    return render_template("group_info.html",
                           id=group.id,
                           topic=group.topic,
                           department=group.department,
                           course_num=group.course_num,
                           owner="Student",
                           end_date=group.create_date,
                           description=group.description,
                           can_join=can_join,
                           can_delete=can_delete,
                           can_leave=can_leave,
                           members=members
                           )


@app.route('/mygroups')
def my_groups():
    if not session.get('logged_in'):
        abort(404)
    user = db.session.query(User).filter(User.id == session['user_id']).first()
    if not user:
        abort(404)
    groups = []
    for g in user.groups:
        groups.append({"id": g.group.id, "topic": g.group.topic})
    return render_template("groups.html", groups=groups)


@app.route('/create')
def create():
    if session.get('logged_in'):
        return redirect(url_for('home'))
    return render_template("createAccount.html")


@app.route('/login')
def login():
    if session.get('logged_in'):
        return redirect(url_for('home'))
    return render_template('login.html')


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
    return redirect(url_for('login'))


@app.route('/login_post', methods=['POST'])
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
    if session.get('redirect-target'):
        print("redirect to {}".format(session['redirect-target']))
        return redirect(session['redirect-target'])
    else:
        return redirect(url_for('home'))


@app.route("/logout")
def logout():
    session['logged_in'] = False
    return redirect(url_for('home'))
