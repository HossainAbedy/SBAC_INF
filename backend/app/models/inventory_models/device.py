from .. import db  # Import the 'db' instance from __init__.py

class Device(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    device_type = db.Column(db.String(100), nullable=False)
    device_model = db.Column(db.String(100), nullable=False)  # e.g., Router, Printer, etc.
    manufacturer = db.Column(db.String(100))
    serial_number = db.Column(db.String(100))
    ip_address = db.Column(db.String(100))
    online_status = db.Column(db.Boolean, default=False)
    branch_id = db.Column(db.Integer, db.ForeignKey('branch.id'), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "device_type": self.device_type,
            "device_model": self.device_model,
            "manufacturer": self.manufacturer,
            "serial_number": self.serial_number,
            "ip_address": self.ip_address,
            "online_status": self.online_status,
            "branch_id": self.branch_id,
        }