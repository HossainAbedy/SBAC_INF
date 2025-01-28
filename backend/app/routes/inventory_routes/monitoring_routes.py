from datetime import datetime
from flask import Blueprint, jsonify
from app.monitoring import check_online_status, get_bandwidth_usage
from app.models.inventory_models.netdevice import db, NetDevice

monitoring_routes = Blueprint('monitoring_routes', __name__)

@monitoring_routes.route('/api/status/<int:id>', methods=['GET'])
def get_device_status(id):
    device = NetDevice.query.get_or_404(id)
    is_online = check_online_status(device.ip_address)
    device.online_status = is_online
    device.last_checked = datetime.now()
    db.session.commit()
    return jsonify({'device': device.name, 'online_status': is_online})

@monitoring_routes.route('/api/metrics/<int:id>', methods=['GET'])
def get_device_metrics(id):
    device = NetDevice.query.get_or_404(id)
    bandwidth = get_bandwidth_usage(device.ip_address)
    # Update in the database (optional)
    device.bandwidth_usage = bandwidth
    db.session.commit()
    return jsonify({'device': device.name, 'bandwidth_usage': bandwidth})
