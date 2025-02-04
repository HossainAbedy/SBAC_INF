from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.models.inventory_models.device_details import DeviceDetails, db
from app.models.inventory_models.device import Device
from app.models.inventory_models.location import Location

dashboard_routes = Blueprint('dashboard_routes', __name__)

### --- Read only routes --- ###

@dashboard_routes.route('/api/devices/summary', methods=['GET'])
def get_device_summary():
    summary = db.session.query(Device.type, db.func.count(Device.id)).group_by(Device.type).all()
    return jsonify([{ "type": type_, "count": count } for type_, count in summary])

@dashboard_routes.route('/api/locations', methods=['GET'])
def get_all_locations():
    # Query to fetch all locations
    locations = db.session.query(Location).all()
    
    # Format the result as a list of dictionaries
    result = [{
        "id": location.id,
        "name": location.name,
        "sub_branch_code": location.sub_branch_code
    } for location in locations]
    
    # Return the result as JSON
    return jsonify(result)

@dashboard_routes.route('/api/devices/by-location', methods=['GET'])
def get_devices_by_location():
    location_summary = db.session.query(
        Location.name.label("location"),
        db.func.count(Device.id).label("count")
    ).join(Device, Device.location_id == Location.id) \
     .group_by(Location.name) \
     .all()

    return jsonify([{ "location": loc, "count": count } for loc, count in location_summary])    

@dashboard_routes.route('/api/devices/summaries', methods=['GET'])
def get_device_summaries():
    summary = db.session.query(
        Device.id,
        Device.name,
        Device.type,
        Location.name.label("location_name"),  # Get the location name
        DeviceDetails.oem,
        DeviceDetails.serial_number,
        DeviceDetails.firmware_version,
        DeviceDetails.installation_date,
        DeviceDetails.bandwidth_usage,
        DeviceDetails.uptime,
        db.func.count(Device.id).label("count")  # Count devices of the same type
    ).join(Location, Device.location_id == Location.id) \
     .outerjoin(DeviceDetails, Device.id == DeviceDetails.device_id) \
     .group_by(Device.id, Device.name, Device.type, Location.name, 
               DeviceDetails.oem, DeviceDetails.serial_number, 
               DeviceDetails.firmware_version, DeviceDetails.installation_date, 
               DeviceDetails.bandwidth_usage, DeviceDetails.uptime) \
     .all()

    return jsonify([
        {
            "id": id_,
            "name": name,
            "type": type_,
            "location": location_name,
            "oem": oem,
            "serial_number": serial_number,
            "firmware_version": firmware_version,
            "installation_date": installation_date.strftime('%Y-%m-%d') if installation_date else None,
            "bandwidth_usage": bandwidth_usage,
            "uptime": uptime,
            "count": count
        }
        for id_, name, type_, location_name, oem, serial_number, firmware_version,
            installation_date, bandwidth_usage, uptime, count in summary
    ])

@dashboard_routes.route('/api/devices/<string:type>', methods=['GET'])
def get_devices_by_type(type):
    devices = Device.query.filter_by(type=type).all()
    return jsonify([{ "id": d.id, "name": d.name, "location": d.location.name } for d in devices])

@dashboard_routes.route('/api/device/details/<int:device_id>', methods=['GET'])
def get_device_details(device_id):
    device = Device.query.get_or_404(device_id)
    details = DeviceDetails.query.filter_by(device_id=device.id).first()
    
    return jsonify({
        "id": device.id,
        "name": device.name,
        "type": device.type,
        "location": device.location.name,
        "oem": details.oem,
        "serial_number": details.serial_number,
        "firmware_version": details.firmware_version,
        "installation_date": details.installation_date.strftime('%Y-%m-%d') if details.installation_date else None,
        "bandwidth_usage": details.bandwidth_usage,
        "uptime": details.uptime
    })

### --- Device Management --- ###

@dashboard_routes.route('/api/device', methods=['POST'])
@jwt_required()  # Ensure only authenticated users can add devices
def add_device():
    claims = get_jwt()  # Extract JWT claims
    user_role = claims.get('role')  # Check the role from JWT claims

    if user_role != 'admin':  # Only admins can add devices
        return jsonify({"success": False, "message": "Only admins can add devices"}), 403

    data = request.get_json()
    print(data)
    # Ensure required fields are provided
    required_fields = ["name", "type",  "oem", "serial_number"]
    if not all(field in data for field in required_fields):
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    try:
        # Create and add the device
        new_device = Device(
            name=data["name"],
            type=data["type"],
            location_id=data["location_id"]
        )
        db.session.add(new_device)
        db.session.commit()  # Save the device first to get the ID

        # Create and add the device details
        new_details = DeviceDetails(
            device_id=new_device.id,
            oem=data["oem"],
            serial_number=data["serial_number"],
            firmware_version=data.get("firmware_version"),
            installation_date=data.get("installation_date"),
            bandwidth_usage=data.get("bandwidth_usage", 0.0),
            uptime=data.get("uptime", 0.0)
        )
        db.session.add(new_details)
        db.session.commit()

        return jsonify({"success": True, "message": "Device added successfully", "device_id": new_device.id}), 201

    except Exception as e:
        db.session.rollback()  # Rollback in case of an error
        return jsonify({"success": False, "message": str(e)}), 500

@dashboard_routes.route('/api/device/<int:device_id>', methods=['PUT'])
@jwt_required()
def update_device(device_id):
    claims = get_jwt()  # Extract JWT claims
    user_role = claims.get('role')  # Check the role from JWT claims

    if user_role != 'admin':  # Only admins can add devices
        return jsonify({"success": False, "message": "Only admins can update devices"}), 403

    data = request.get_json()
    device = Device.query.get_or_404(device_id)
    details = DeviceDetails.query.filter_by(device_id=device_id).first()

    # Update Device Information
    if "name" in data:
        device.name = data["name"]
    if "type" in data:
        device.type = data["type"]
    if "location_id" in data:
        device.location_id = data["location_id"]

    # Update Device Details
    if details:
        if "oem" in data:
            details.oem = data["oem"]
        if "serial_number" in data:
            details.serial_number = data["serial_number"]
        if "firmware_version" in data:
            details.firmware_version = data["firmware_version"]
        if "installation_date" in data:
            details.installation_date = data["installation_date"]
        if "bandwidth_usage" in data:
            details.bandwidth_usage = data["bandwidth_usage"]
        if "uptime" in data:
            details.uptime = data["uptime"]
    else:
        return jsonify({"error": "Device details not found"}), 404

    db.session.commit()
    return jsonify({"message": "Device updated successfully"})

@dashboard_routes.route('/api/device/<int:device_id>', methods=['DELETE'])
@jwt_required()
def delete_device(device_id):
    claims = get_jwt()  # Extract JWT claims
    user_role = claims.get('role')  # Check the role from JWT claims

    if user_role != 'admin':  # Only admins can add devices
        return jsonify({"success": False, "message": "Only admins can delete devices"}), 403

    device = Device.query.get_or_404(device_id)
    details = DeviceDetails.query.filter_by(device_id=device_id).first()

    # First delete the DeviceDetails if they exist
    if details:
        db.session.delete(details)

    # Then delete the Device itself
    db.session.delete(device)
    db.session.commit()

    return jsonify({"message": "Device deleted successfully"})

# Ensure the user is an admin
def is_admin():
    current_user = get_jwt_identity()
    return current_user.get("role") == "admin"

### --- Location Management --- ###

@dashboard_routes.route('/api/locations', methods=['POST'])
@jwt_required()
def add_location():
    claims = get_jwt()  # Extract JWT claims
    user_role = claims.get('role')  # Check the role from JWT claims

    if user_role != 'admin':  # Only admins can add devices
        return jsonify({"success": False, "message": "Only admins can add locations"}), 403

    data = request.json
    new_location = Location(
        name=data['name'],
        sub_branch_code=data.get('sub_branch_code')
    )
    db.session.add(new_location)
    db.session.commit()
    return jsonify({"message": "Location added successfully", "location_id": new_location.id})

@dashboard_routes.route('/api/locations/<int:location_id>', methods=['PUT'])
@jwt_required()
def update_location(location_id):
    claims = get_jwt()  # Extract JWT claims
    user_role = claims.get('role')  # Check the role from JWT claims

    if user_role != 'admin':  # Only admins can add devices
        return jsonify({"success": False, "message": "Only admins can update location"}), 403

    location = Location.query.get_or_404(location_id)
    data = request.json
    location.name = data.get('name', location.name)
    location.sub_branch_code = data.get('sub_branch_code', location.sub_branch_code)

    db.session.commit()
    return jsonify({"message": "Location updated successfully"})

@dashboard_routes.route('/api/locations/<int:location_id>', methods=['DELETE'])
@jwt_required()
def delete_location(location_id):
    claims = get_jwt()  # Extract JWT claims
    user_role = claims.get('role')  # Check the role from JWT claims

    if user_role != 'admin':  # Only admins can add devices
        return jsonify({"success": False, "message": "Only admins can delete location"}), 403

    location = Location.query.get_or_404(location_id)
    db.session.delete(location)
    db.session.commit()
    return jsonify({"message": "Location deleted successfully"})