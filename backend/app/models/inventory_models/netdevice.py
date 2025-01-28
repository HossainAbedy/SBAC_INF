from .. import db  # Import the 'db' instance from __init__.py
from datetime import datetime

class NetDevice(db.Model):
    __tablename__ = 'netdevice'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    ip_address = db.Column(db.String(15), unique=True, nullable=False)
    device_type = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(50))
    manufacturer = db.Column(db.String(100))
    serial_number = db.Column(db.String(50))
    firmware_version = db.Column(db.String(50))
    installation_date = db.Column(db.Date)
    online_status = db.Column(db.Boolean, default=False)  # Online or Offline
    last_checked = db.Column(db.DateTime, default=datetime.now)
    bandwidth_usage = db.Column(db.Float, default=0.0)  # In Mbps
    uptime = db.Column(db.Float, default=0.0)  # In Hours

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}