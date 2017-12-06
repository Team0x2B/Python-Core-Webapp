from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
from studi import db


class StudyGroup(db.Model):
    __tablename__ = "groups"

    id = Column(db.Integer, primary_key=True)
    topic = Column(db.String)
    latitude = Column(db.Float)
    longitude = Column(db.Float)
    create_date = Column(db.Date)
    members = relationship("GroupMembership",
                           cascade="save-update, merge, "
                                   "delete, delete-orphan")

    def __init__(self, topic, latitude, longitude, create_date):
        self.topic = topic
        self.latitude = latitude
        self.longitude = longitude
        self.create_date = create_date

    def add_member(self, user, role):
        self.members.append(GroupMembership(user, role))

    def __repr__(self):
        member_str = "{usr} ({rl}), "
        rep = "Study Group: {" + \
              "".join(member_str.format(usr=m.user.username, rl=m.role) for m in self.members) + \
              "}"
        print(rep)
        return rep


class GroupMembership(db.Model):
    __tablename__ = 'group_member_association'

    user_id = Column(db.Integer, ForeignKey("users.id"), primary_key=True)
    group_id = Column(db.Integer, ForeignKey("groups.id"), primary_key=True)
    role = Column(db.String)
    user = relationship("User", backref='group', lazy=True)

    def __init__(self, user, role):
        self.user = user
        self.role = role
