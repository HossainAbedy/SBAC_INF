from flask import Flask, Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.inventory_models.branch import Branch, db
from app.models.inventory_models.branch_user import Branch_User, db
from app.models.inventory_models.device import Device, db

device_routes = Blueprint('device_routes', __name__)


@device_routes.route('/api/devices', methods=['GET'])
@jwt_required()
def get_devices():
    devices = Device.query.all()

    if not devices:
        return jsonify({"message": "No devices found"}), 404
    
    # Serialize devices using the to_dict method
    device_list = [device.to_dict() for device in devices]
    
    # Wrap the device list under the 'devices' key
    return jsonify({"devices": device_list}), 200
    

@device_routes.route('/api/device/<int:device_id>', methods=['GET'])
@jwt_required()
def get_device_details(device_id):
    device = Device.query.get_or_404(device_id)

    # Return the response in the desired format
    return jsonify({
        "id": device.id,
        "name": device.name,
        "device_type": device.device_type,
        "device_model": device.device_model,
        "ip_address": device.ip_address,
        "manufacturer": device.manufacturer,
        "serial_number": device.serial_number,
        "online_status": device.online_status
    })

@device_routes.route('/api/device', methods=['POST'])
@jwt_required()
def add_device():
    data = request.json
    
    try:
        # Convert 'online_status' to a boolean
        online_status = data["online_status"] == '1'

        # Create a new Device instance
        device = Device(
            name=data["name"], 
            device_type=data["device_type"],
            device_model=data["device_model"],
            manufacturer=data["manufacturer"],
            serial_number=data["serial_number"], 
            ip_address=data["ip_address"],
            online_status=online_status,
            branch_id=data["branch_id"]
        )
        
        # Add and commit the new device
        db.session.add(device)
        db.session.commit()
        
        return jsonify({"message": "Device added successfully!"}), 201
    except Exception as e:
        # Rollback in case of an error
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@device_routes.route('/api/device/<int:device_id>', methods=['PUT'])
@jwt_required()
def update_device_id(device_id):
    data = request.json
    device = Device.query.get_or_404(device_id)

    try:
        # Update the fields
        device.name = data.get("name", device.name)
        device.device_type = data.get("device_type", device.device_type)
        device.device_model = data.get("device_model", device.device_model)
        device.manufacturer = data.get("manufacturer", device.manufacturer)
        device.serial_number = data.get("serial_number", device.serial_number)
        device.ip_address = data.get("ip_address", device.ip_address)
        
        # Convert 'online_status' to boolean and update
        if "online_status" in data:
            device.online_status = data["online_status"] == '1'

        # Update branch_id
        device.branch_id = data.get("branch_id", device.branch_id)

        # Commit the changes to the database
        db.session.commit()
        return jsonify({"message": "Device updated successfully!"}), 200
    except Exception as e:
        # Rollback in case of an error
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@device_routes.route('/api/device/<int:device_id>', methods=['DELETE'])
@jwt_required()
def delete_device(device_id):
    device = Device.query.get_or_404(device_id)
    db.session.delete(device)
    db.session.commit()
    return jsonify({"message": "Device deleted successfully!"})




