from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, jwt_required
from app.models.user import User, db  # Import the User model

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    # Extract JWT claims
    claims = get_jwt()  # Get the JWT claims for the logged-in user
    logged_in_user_role = claims.get('role')  # Get the role from JWT claims
    
    # Fetch all users from the database
    users = User.query.all()
    
    # Prepare the users data to return
    users_data = [
        {"id": user.id, "name": user.username, "email": user.email, "roleId": user.role_id}
        for user in users
    ]
    
    # Return users and logged-in user's role as response
    return jsonify({"users": users_data, "loggedInUserRole": logged_in_user_role})

@user_routes.route('/users/<int:user_id>/updateRole', methods=['POST'])
@jwt_required()
def update_user_role(user_id):
    claims = get_jwt()  # Extract JWT claims
    user_role = claims.get('role')  # Check the role from JWT claims
    
    if user_role != 'admin':
        return jsonify({"success": False, "message": "Only admins can update roles"}), 403

    data = request.json
    new_role_id = data.get("roleId")
    
    if not new_role_id:
        return jsonify({"success": False, "message": "roleId is required"}), 422
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    user.role_id = new_role_id
    db.session.commit()

    return jsonify({"success": True, "message": "Role updated successfully"})
