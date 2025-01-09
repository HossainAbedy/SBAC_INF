from flask import Flask, Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.inventory_models.branch import Branch, db
from app.models.inventory_models.branch_user import Branch_User, db
from app.models.inventory_models.device import Device, db

branch_user_routes = Blueprint('branch_user_routes', __name__)

@branch_user_routes.route('/api/branch_users', methods=['GET'])
@jwt_required()
def get_branch_User():
    branch_users = Branch_User.query.all()
    # return jsonify([branch_User.name for branch_User in branch_Users])

    if not branch_users:
        return jsonify({"message": "No branch user found"}), 404
    
    # Serialize devices using the to_dict method
    branch_users_list = [branch_user.to_dict() for branch_user in branch_users]
    
    # Wrap the device list under the 'devices' key
    return jsonify({"branch_users": branch_users_list}), 200

@branch_user_routes.route('/api/branch_user/<int:branch_user_id>', methods=['GET'])
@jwt_required()
def get_branch_user_details(branch_user_id):
    branch_user = Branch_User.query.get_or_404(branch_user_id)
    # Return the response in the desired format
    return jsonify({
        "id": branch_user.id,
        "name": branch_user.name,
        "email": branch_user.email,
        "emp_id": branch_user.emp_id,
        "designation": branch_user.designation,
        "branch_role": branch_user.branch_role,
        "branch_id": branch_user.branch_id,
    })

@branch_user_routes.route('/api/branch_user', methods=['POST'])
@jwt_required()
def add_branch_user():
    data = request.json
    branch_user = Branch_User(
        name=data["name"], 
        email=data["email"],
        emp_id=data["emp_id"],
        designation=data["designation"],
        branch_role=data["branch_role"], 
        branch_id=data["branch_id"]
    )
    db.session.add(branch_user)
    db.session.commit()
    return jsonify({"message": "Branch User added successfully!"})

@branch_user_routes.route('/api/branch_user/<int:branch_user_id>', methods=['PUT'])
@jwt_required()
def update_branch_user_id(branch_user_id):
    data = request.json
    branch_user = Branch_User.query.get_or_404(branch_user_id)
    branch_user.name = data.get("name", branch_user.name)
    branch_user.email = data.get("email", branch_user.email)
    branch_user.emp_id = data.get("emp_id", branch_user.emp_id)
    branch_user.designation = data.get("designation", branch_user.designation)
    branch_user.branch_role = data.get("branch_role", branch_user.branch_role)
    branch_user.branch_id = data.get("branch_id", branch_user.branch_id)
    db.session.commit()
    return jsonify({"message": "Branch User updated successfully!"})

@branch_user_routes.route('/api/branch_user/<int:branch_user_id>', methods=['DELETE'])
@jwt_required()
def delete_branch_user(branch_user_id):
    branch_user = Branch_User.query.get_or_404(branch_user)
    db.session.delete(branch_user)
    db.session.commit()
    return jsonify({"message": "Branch User deleted successfully!"})


