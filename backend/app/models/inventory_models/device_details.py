from .. import db  # Import the 'db' instance from __init__.py

class DeviceDetails(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    device_id = db.Column(db.Integer, db.ForeignKey('device.id'), nullable=False, unique=True)
    oem = db.Column(db.String(100), nullable=False)  # Manufacturer
    serial_number = db.Column(db.String(50), unique=True, nullable=False)
    firmware_version = db.Column(db.String(50), nullable=True)
    installation_date = db.Column(db.Date, nullable=True)
    bandwidth_usage = db.Column(db.Float, default=0.0)
    uptime = db.Column(db.Float, default=0.0)

    def __repr__(self):
        return f"<DeviceDetails {self.serial_number}>"
