from app.routes.auth_routes import auth_routes
from app.routes.user_routes import user_routes
from app.routes.role_routes import role_routes
from app.routes.profile_routes import profile_routes
# from app.routes.inventory_routes.branch_routes import branch_routes
# from app.routes.inventory_routes.device_routes import device_routes
# from app.routes.inventory_routes.branch_user_routes import branch_user_routes
# from app.routes.inventory_routes.netdevice_routes import netdevice_routes
# from app.routes.inventory_routes.monitoring_routes import monitoring_routes
# from app.routes.inventory_routes.report_routes import report_routes
from app.routes.inventory_routes.dashboard_routes import dashboard_routes

def register_routes(app):
    """Register all blueprints to the app."""
    app.register_blueprint(auth_routes)
    app.register_blueprint(user_routes)
    app.register_blueprint(role_routes)
    app.register_blueprint(profile_routes)
    # app.register_blueprint(branch_routes)
    # app.register_blueprint(device_routes)
    # app.register_blueprint(branch_user_routes)
    # app.register_blueprint(netdevice_routes)
    # app.register_blueprint(monitoring_routes)
    # app.register_blueprint(report_routes)
    app.register_blueprint(dashboard_routes)