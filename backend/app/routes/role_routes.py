from flask import Blueprint, jsonify
from app.models.user import Role

role_routes = Blueprint('role_routes', __name__)

@role_routes.route('/roles', methods=['GET'])
def get_roles():
    roles = Role.query.all()
    roles_data = [{"id": role.id, "name": role.name} for role in roles]
    return jsonify({"roles": roles_data})
