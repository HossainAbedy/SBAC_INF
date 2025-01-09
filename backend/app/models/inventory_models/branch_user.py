from .. import db  # Import the 'db' instance from __init__.py

class Branch_User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    emp_id = db.Column(db.String(100))
    designation = db.Column(db.String(100))
    branch_role = db.Column(db.String(50))  # e.g., 'admin', 'employee'
    branch_id = db.Column(db.Integer, db.ForeignKey('branch.id'), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "emp_id": self.emp_id,
            "designation": self.designation,
            "branch_role": self.branch_role,
            "branch_id": self.branch_id,
        }