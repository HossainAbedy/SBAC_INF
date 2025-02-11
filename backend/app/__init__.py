from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from extensions import migrate
from app.models import db

# Shutdown the scheduler when exiting the app

# Initialize extensions
bcrypt = Bcrypt()
jwt = JWTManager()
migrate = Migrate()


def create_app():
    app = Flask(__name__)

    # Enable CORS for specific origins, including Socket.IO
    CORS(app, origins=["http://localhost:3000","http://172.19.100.110:3000"], supports_credentials=True)

    # Configure your app
    app.config.from_object('app.config.Config')

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    return app
