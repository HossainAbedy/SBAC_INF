from flask import Blueprint, jsonify
from app.models.inventory_models.devicelog import DeviceLog

report_routes = Blueprint('report_routes', __name__)

@report_routes.route('/report/<int:device_id>', methods=['GET'])
def get_device_report(device_id):
    logs = DeviceLog.query.filter_by(device_id=device_id).order_by(DeviceLog.timestamp.desc()).limit(10).all()
    return jsonify([log.to_dict() for log in logs])
