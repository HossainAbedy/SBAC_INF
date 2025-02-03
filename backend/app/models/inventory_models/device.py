from .. import db  # Import the 'db' instance from __init__.py

class Device(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.Enum('Router', 'Switch', 'Server', 'Storage', 'Firewall', name="device_types"), nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey('location.id'), nullable=False)
    details = db.relationship('DeviceDetails', backref='device', lazy=True)  # One-to-One relation

    def __repr__(self):
        return f"<Device {self.name} ({self.type})>"
