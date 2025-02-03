from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import models to make them available when 'db' is used elsewhere
from .role import Role
from .user import User
from .inventory_models.device import Device
from .inventory_models.location import Location
from .inventory_models.device_details import DeviceDetails  

