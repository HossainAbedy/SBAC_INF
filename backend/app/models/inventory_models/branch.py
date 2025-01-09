from .. import db
from .branch_user import Branch_User  # Import the Branch_User model to define relationships
from .device import Device  # Import the Device model to define relationships

class Branch(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    branch_code = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200))
    devices = db.relationship('Device', backref='branch', lazy=True)
    branch_users = db.relationship('Branch_User', backref='branch', lazy=True)

    def to_dict(self):
        """Serialize the Branch model into a dictionary."""
        return {
            "id": self.id,
            "name": self.name,
            "branch_code": self.branch_code,
            "address": self.address if self.address else "N/A",  # Handle optional address field
            "devices": [device.to_dict() for device in self.devices],  # Serialize devices if needed
            "branch_users": [branch_user.to_dict() for branch_user in self.branch_users],  # Serialize branch users if needed
        }
