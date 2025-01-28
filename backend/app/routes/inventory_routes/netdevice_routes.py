from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models.inventory_models.netdevice import NetDevice, db

netdevice_routes = Blueprint('netdevice_routes', __name__)

@netdevice_routes.route('/api/netdevices', methods=['GET'])
def get_devices():
    devices = NetDevice.query.all()
    return jsonify([device.to_dict() for device in devices])

@netdevice_routes.route('/api/netdevice', methods=['POST'])
def add_device():
    data = request.json
    new_device = NetDevice(**data)
    db.session.add(new_device)
    db.session.commit()
    return jsonify(new_device.to_dict()), 201

@netdevice_routes.route('/api/netdevice/<int:id>', methods=['PUT'])
def update_device(id):
    data = request.json
    device = NetDevice.query.get_or_404(id)
    for key, value in data.items():
        setattr(device, key, value)
    db.session.commit()
    return jsonify(device.to_dict())

@netdevice_routes.route('/api/netdevice/<int:id>', methods=['DELETE'])
def delete_device(id):
    device = NetDevice.query.get_or_404(id)
    db.session.delete(device)
    db.session.commit()
    return '', 204
