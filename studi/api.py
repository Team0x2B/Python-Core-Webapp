from flask import request, session, jsonify
import datetime
import logging, json, collections
from studi import app, db
from studi.user import User
from studi.studygroup import StudyGroup


@app.route('/api/getUsers')
def get_users():
        logging.debug("inside getUsers")
        conn = db.session # connect to database
        query = conn.query(User)
        users = query.all()  # get all results

        # convert to JSON compatible format with keys matching columns
        results = []
        for u in users:
            d = collections.OrderedDict()
            d['id'] = u.id
            d['username'] = u.username
            results.append(d)

        return jsonify(results)


@app.route('/api/get_study_groups', methods=['GET'])
def get_study_groups():
    s = db.session
    query = s.query(StudyGroup)
    groups = query.all()

    results = []
    for group in groups:
        d = dict()
        d["topic"] = group.topic
        d['latitude'] = group.latitude
        d['longitude'] = group.longitude
        d['create_date'] = group.create_date
        members = []
        for m in group.members:
            m_dict = dict()
            m_dict['id'] = m.user.id
            m_dict['username'] = m.user.username
            m_dict['role'] = m.role
            members.append(m_dict)
        d['members'] = members
        results.append(d)

    return jsonify(results)


@app.route('/api/create_study_group', methods=['POST'])
def create_study_group():
    if not session.get('logged_in'):
        logging.debug('user not logged in - cannot create group')
        return jsonify({'status': 'error'})
    s = db.session
    query = s.query(User).filter(User.id == session['user_id'])
    user = query.first()
    data = json.loads(request.data)
    new_group = StudyGroup(data['topic'], data['lat'], data['lon'], datetime.datetime.now())
    new_group.add_member(user, "OWNER")
    logging.debug('created study group')

    s.add(new_group)
    s.commit()

    return jsonify({'status': 'ok'})
