from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import models to make them available when 'db' is used elsewhere
from .role import Role
from .user import User
from .inventory_models.branch import Branch
from .inventory_models.branch_user import Branch_User  
from .inventory_models.device import Device 
