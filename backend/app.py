# from flask_cors import CORS
from app import create_app
from app.routes import register_routes

app = create_app()

# Register routes
register_routes(app)

# with app.app_context():
#     db.create_all()
 
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

if __name__ == "__main__":
    app.run(host="172.19.100.110", port=5000, debug=True)
    