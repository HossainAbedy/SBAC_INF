from .. import db  # Import the 'db' instance from __init__.py

class Location(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), unique=True, nullable=False)  # DC, DR, HO, Branch
    sub_branch_code = db.Column(db.String(20), unique=True, nullable=True)  # If applicable
    devices = db.relationship('Device', backref='location', lazy=True)

    def __repr__(self):
        return f"<Location {self.name}>"