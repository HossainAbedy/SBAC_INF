from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
# from app.models.user import db

# Initialize extensions
db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # Configure your app
    # app.config.from_object('app.config.Config')


    # Initialize extensions
    # db.init_app(app)
    # bcrypt.init_app(app)
    # jwt.init_app(app)

    # Register blueprints
    # from app.routes.auth_routes import auth_routes
    # app.register_blueprint(auth_routes)

    return app
