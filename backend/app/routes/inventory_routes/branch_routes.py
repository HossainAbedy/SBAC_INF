from flask import Flask, Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.inventory_models.branch import Branch, db
from app.models.inventory_models.branch_user import Branch_User, db
from app.models.inventory_models.device import Device, db

branch_routes = Blueprint('branch_routes', __name__)

@branch_routes.route('/api/branches', methods=['GET'])
@jwt_required()
def get_branches():
    # Query all branches
    branches = Branch.query.all()
    
    if not branches:
        return jsonify({"message": "No branches found"}), 404
    
    # Serialize branches using the to_dict method
    branch_list = [branch.to_dict() for branch in branches]
    
    return jsonify({"branches": branch_list}), 200

@branch_routes.route('/api/branch/<int:branch_id>', methods=['GET'])
@jwt_required()
def get_branch_details(branch_id):
    branch = Branch.query.get_or_404(branch_id)
    
    # Retrieve devices related to the branch
    devices = [
        {
            "id": device.id,
            "name": device.name,
            "device_type": device.device_type,
            "device_model": device.device_model,
            "ip_address": device.ip_address,
            "manufacturer": device.manufacturer,
            "serial_number": device.serial_number,
            "online_status": device.online_status
        } 
        for device in branch.devices
    ]
    
    # Retrieve users related to the branch
    branch_users = [
        {
            "id": branch_user.id,
            "name": branch_user.name,
            "email": branch_user.email,
            "emp_id": branch_user.emp_id,
            "branch_role": branch_user.branch_role,
            "designation": branch_user.designation
        }
        for branch_user in branch.branch_users
    ]
    
    # Return the response in the desired format
    return jsonify({
        "id": branch.id,
        "name": branch.name,
        "address": branch.address,
        "branch_users": branch_users,
        "devices": devices
    })

@branch_routes.route('/api/branch', methods=['POST'])
@jwt_required()
def add_branch():
    data = request.json
    if not data.get("name"):
        return jsonify({"message": "Branch name is required!"}), 400

    new_branch = Branch(name=data["name"],
                        branch_code=data["branch_code"],
                        devices=data["devices"],
                        address=data["address"])
    db.session.add(new_branch)
    db.session.commit()
    return jsonify({"message": "Branch added successfully!"}), 201

@branch_routes.route('/api/branch/<int:branch_id>', methods=['PUT'])
@jwt_required()
def update_branch(branch_id):
    data = request.json
    branch = Branch.query.get_or_404(branch_id)
    branch.name = data.get("name", branch.name)
    branch.branch_code = data.get("branch_code", branch.branch_code)
    branch.devices = data.get("devices", branch.devices)
    branch.address = data.get("address", branch.address)
    db.session.commit()
    return jsonify({"message": "Branch updated successfully!"})

@branch_routes.route('/api/branch/<int:branch_id>', methods=['DELETE'])
@jwt_required()
def delete_branch(branch_id):
    branch = Branch.query.get_or_404(branch_id)
    db.session.delete(branch)
    db.session.commit()
    return jsonify({"message": "Branch deleted successfully!"})

