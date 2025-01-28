from icmplib import ping, ICMPLibError
from pysnmp.hlapi import *

def check_online_status(ip_address):
    try:
        host = ping(ip_address, count=2, timeout=2)
        return host.is_alive
    except ICMPLibError as e:
        print(f"Error pinging {ip_address}: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error pinging {ip_address}: {e}")
        return False

def get_bandwidth_usage(ip_address, community='public', oid='1.3.6.1.2.1.2.2.1.10.1'):
    try:
        iterator = getCmd(
            SnmpEngine(),
            CommunityData(community, mpModel=0),  # Use SNMPv1
            UdpTransportTarget((ip_address, 161), timeout=2),  # SNMP agent IP and port
            ContextData(),
            ObjectType(ObjectIdentity(oid))  # OID for bandwidth
        )
        
        error_indication, error_status, error_index, var_binds = next(iterator)

        if error_indication:
            print(f"Error retrieving bandwidth from {ip_address}: {error_indication}")
            return 0.0
        elif error_status:
            print(f"SNMP Error for {ip_address}: {error_status.prettyPrint()}")
            return 0.0

        # Extract the value of the OID
        for var_bind in var_binds:
            print(f"SNMP Response: {var_bind}")
            return int(var_bind[1]) / (1024 * 1024)  # Convert bytes to Mbps

    except Exception as e:
        print(f"Exception retrieving bandwidth from {ip_address}: {e}")
        return 0.0

# Example usage
# devices = ['172.19.100.177', '10.0.1.101']
# for ip in devices:
#     if check_online_status(ip):
#         bandwidth = get_bandwidth_usage(ip)
#         print(f"{ip} - Online: True, Bandwidth: {bandwidth:.2f} Mbps")
#     else:
#         print(f"{ip} - Online: False, Bandwidth: 0.0 Mbps")
