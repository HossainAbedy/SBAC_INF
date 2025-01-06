from app.routes.auth_routes import auth_routes
from app.routes.user_routes import user_routes
from app.routes.role_routes import role_routes
from app.routes.profile_routes import profile_routes

def register_routes(app):
    """Register all blueprints to the app."""
    app.register_blueprint(auth_routes)
    app.register_blueprint(user_routes)
    app.register_blueprint(role_routes)
    app.register_blueprint(profile_routes)
