from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Role model representing user roles (e.g., admin, user, etc.)
class Role(db.Model):
    __tablename__ = 'roles'  # Use plural convention for table names

    id = db.Column(db.Integer, primary_key=True)  # Primary key (integer type)
    name = db.Column(db.String(50), unique=True, nullable=False)  # Role name (e.g., admin, user)

    # String representation of the Role model
    def __repr__(self):
        return f"<Role {self.name}>"

# User model representing users in the system
class User(db.Model):
    __tablename__ = 'users'  # Use plural convention for table names

    # Updated 'id' column to be an integer with AUTO_INCREMENT
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Integer type with auto-increment
    username = db.Column(db.String(120), unique=True, nullable=False)  # Unique username
    email = db.Column(db.String(120), unique=True, nullable=False)  # Unique email
    password = db.Column(db.String(255), nullable=False)  # User password (hashed)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False)  # Foreign key to Role
    role = db.relationship('Role', backref=db.backref('users', lazy='dynamic'))  # Relationship to Role

    # String representation of the User model
    def __repr__(self):
        return f"<User {self.username}>"