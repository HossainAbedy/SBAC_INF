from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import models to make them available when 'db' is used elsewhere
from .role import Role
from .user import User