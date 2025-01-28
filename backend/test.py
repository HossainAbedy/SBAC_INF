from app.monitoring import check_online_status, get_bandwidth_usage

devices = [
    {"name": "Router 1", "ip_address": "172.19.100.177"},
    {"name": "Switch 1", "ip_address": "10.0.1.101"},
]

for device in devices:
    status = check_online_status(device["ip_address"])
    bandwidth = get_bandwidth_usage(device["ip_address"])
    print(f"{device['name']} - Online: {status}, Bandwidth: {bandwidth} Mbps")
