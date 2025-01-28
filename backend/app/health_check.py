from app.models.inventory_models.netdevice import NetDevice, db
from .monitoring import check_online_status, get_bandwidth_usage
from datetime import datetime
from app.models.inventory_models.devicelog import DeviceLog

def perform_health_check():
    devices = NetDevice.query.all()
    for device in devices:
        online_status = check_online_status(device.ip_address)
        bandwidth_usage = get_bandwidth_usage(device.ip_address)

        # Save to DeviceLog
        log = DeviceLog(
            device_id=device.id,
            online_status=online_status,
            bandwidth_usage=bandwidth_usage
        )
        db.session.add(log)

        # Update current device status
        device.online_status = online_status
        device.bandwidth_usage = bandwidth_usage
        device.last_checked = datetime.now()

        db.session.commit()
        print(f"Logged {device.name}: Status = {online_status}, Bandwidth = {bandwidth_usage} Mbps")