from datetime import datetime
from .. import db  # Import the 'db' instance from __init__.py

class DeviceLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.Integer, db.ForeignKey('device.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.now)
    online_status = db.Column(db.Boolean)
    bandwidth_usage = db.Column(db.Float)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
