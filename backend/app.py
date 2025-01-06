from flask import Flask
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from app.models import db
from app.routes import register_routes

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Register routes
register_routes(app)

# Configuration
app.config.from_object('app.config.Config')

# Initialize extensions
jwt = JWTManager(app)
bcrypt = Bcrypt(app)
db.init_app(app)

with app.app_context():
    db.create_all()
 
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"



if __name__ == "__main__":
    app.run(debug=True)
