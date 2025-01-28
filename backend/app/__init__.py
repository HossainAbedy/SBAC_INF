from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from extensions import migrate
from app.models import db
from apscheduler.schedulers.background import BackgroundScheduler
from .health_check import perform_health_check
from flask_socketio import SocketIO

scheduler = BackgroundScheduler()
scheduler.add_job(func=perform_health_check, trigger="interval", minutes=5)
scheduler.start()

# Shutdown the scheduler when exiting the app
import atexit
atexit.register(lambda: scheduler.shutdown())

# Initialize extensions
bcrypt = Bcrypt()
jwt = JWTManager()
migrate = Migrate()
socketio = SocketIO()

def create_app():
    app = Flask(__name__)

    # Enable CORS for specific origins, including Socket.IO
    CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

    # Configure your app
    app.config.from_object('app.config.Config')

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    socketio.init_app(app, cors_allowed_origins=["http://localhost:3000"])  # CORS for Socket.IO

    @socketio.on('connect')
    def handle_connect():
        print("Client connected")

    @socketio.on('disconnect')
    def handle_disconnect():
        print("Client disconnected")

    # Emit device status every 5 seconds
    import threading, time
    from app.monitoring import check_online_status

    def emit_device_status():
        devices = ['172.19.100.177', '10.0.1.101']  # List of IPs to check
        while True:
            for ip in devices:
                data = check_online_status(ip)  # Pass the IP address to the function
                socketio.emit('device_status_update', {'ip': ip, 'status': data})
            time.sleep(5)

    threading.Thread(target=emit_device_status).start()

    # Register blueprints
    # from app.routes.auth_routes import auth_routes
    # app.register_blueprint(auth_routes)

    return app
