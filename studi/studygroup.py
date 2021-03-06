from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
from studi import db


class StudyGroup(db.Model):
    __tablename__ = "groups"

    id = Column(db.Integer, primary_key=True)
    topic = Column(db.String)
    latitude = Column(db.Float)
    longitude = Column(db.Float)
    duration = Column(db.Float)
    department = Column(db.String)
    course_num = Column(db.String)
    description = Column(db.String)
    create_date = Column(db.Date)
    members = relationship("GroupMembership",
                           cascade="save-update, merge, "
                                   "delete, delete-orphan")

    def __init__(self, topic, latitude, longitude, duration, department, course_num, description, create_date):
        self.topic = topic
        self.latitude = latitude
        self.longitude = longitude
        self.duration = duration
        self.department = department
        self.course_num = course_num
        self.description = description
        self.create_date = create_date

    def add_member(self, user, role):
        self.members.append(GroupMembership(user, role))

    def can_user_delete(self, user):
        for m in self.members:
            if m.user.id == user.id:
                return m.role == "OWNER"
        return False

    def can_user_join(self, user):
        for m in self.members:
            if m.user.id == user.id:
                return False
        return True

    def can_user_leave(self, user):
        for m in self.members:
            if m.user.id == user.id:
                return m.role != "OWNER"
        return False

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
    user = relationship("User")
    group = relationship("StudyGroup")

    def __init__(self, user, role):
        self.user = user
        self.role = role
