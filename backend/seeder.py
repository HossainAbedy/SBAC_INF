from app import create_app, db
from app.models.role import Role
from app.models.inventory_models.location import Location
from app.models.inventory_models.device import Device
from app.models.inventory_models.device_details import DeviceDetails
from datetime import date
import random

app = create_app()

with app.app_context():
    # Seed default roles
    if not Role.query.filter_by(name='admin').first():
        admin_role = Role(name='admin')
        db.session.add(admin_role)

    if not Role.query.filter_by(name='user').first():
        user_role = Role(name='user')
        db.session.add(user_role)

    # Commit roles first
    db.session.commit()
    print("Roles seeded successfully.")

    # Seed locations
    locations = [
        {"name": "DC", "sub_branch_code": "5555"},
        {"name": "DR", "sub_branch_code": "4444"},
        {"name": "Head Office", "sub_branch_code": "0001"},
        {"name": "Principal Branch", "sub_branch_code": "0002"},
        {"name": "Hemayetpur Branch", "sub_branch_code": "0003"},
        {"name": "Agrabad Branch", "sub_branch_code": "0004"},
        {"name": "Bhatiary Branch", "sub_branch_code": "0005"},
        {"name": "Khulna Branch", "sub_branch_code": "0006"},
        {"name": "Katakhali Branch", "sub_branch_code": "0007"},
        {"name": "Keranigonj Branch", "sub_branch_code": "0008"},
        {"name": "Uttara Branch", "sub_branch_code": "0009"},
        {"name": "Gulshan Branch", "sub_branch_code": "0010"},
        {"name": "Velanagar Branch", "sub_branch_code": "0011"},
        {"name": "Imamgonj Branch", "sub_branch_code": "0012"},
        {"name": "Ashulia Branch", "sub_branch_code": "0013"},
        {"name": "SBAC Card Division", "sub_branch_code": "0014"},
        {"name": "Dhanmondi Branch", "sub_branch_code": "0015"},
        {"name": "Sylhet Branch", "sub_branch_code": "0016"},
        {"name": "Mawna Branch", "sub_branch_code": "0017"},
        {"name": "Jubilee Road Branch", "sub_branch_code": "0018"},
        {"name": "Bogra Branch", "sub_branch_code": "0019"},
        {"name": "Islampur Branch", "sub_branch_code": "0020"},
        {"name": "Gazipur Branch", "sub_branch_code": "0021"},
        {"name": "Modhunaghat Branch", "sub_branch_code": "0022"},
        {"name": "Shyamnagar Branch", "sub_branch_code": "0023"},
        {"name": "Moynamoti Branch", "sub_branch_code": "0024"},
        {"name": "Bangla Bazar Branch", "sub_branch_code": "0025"},
        {"name": "Banani Branch", "sub_branch_code": "0026"},
        {"name": "Chuknagar Branch", "sub_branch_code": "0027"},
        {"name": "Satkhira Branch", "sub_branch_code": "0028"},
        {"name": "Barisal Branch", "sub_branch_code": "0029"},
        {"name": "Sarbolokkhona Branch", "sub_branch_code": "0030"},
        {"name": "Rajshahi Branch", "sub_branch_code": "0031"},
        {"name": "Nawabpur Branch", "sub_branch_code": "0032"},
        {"name": "Mirpur Branch", "sub_branch_code": "0033"},
        {"name": "Shibu Market Branch", "sub_branch_code": "0034"},
        {"name": "Ghonapara Branch", "sub_branch_code": "0035"},
        {"name": "Digraj Branch", "sub_branch_code": "0036"},
        {"name": "Baburhat Branch", "sub_branch_code": "0037"},
        {"name": "Narayanganj Branch", "sub_branch_code": "0038"},
        {"name": "Bijoy Nagar Branch", "sub_branch_code": "0039"},
        {"name": "Rangpur Branch", "sub_branch_code": "0040"},
        {"name": "Jessore Branch", "sub_branch_code": "0041"},
        {"name": "Takerhat Branch", "sub_branch_code": "0042"},
        {"name": "Fatikchhari Branch", "sub_branch_code": "0043"},
        {"name": "Nasirabad Branch", "sub_branch_code": "0044"},
        {"name": "Bhomra Branch", "sub_branch_code": "0045"},
        {"name": "Morrelganj Branch", "sub_branch_code": "0046"},
        {"name": "Hasnabad Branch", "sub_branch_code": "0047"},
        {"name": "Kharabad Baintola Branch", "sub_branch_code": "0048"},
        {"name": "Chalakchor Branch", "sub_branch_code": "0049"},
        {"name": "Panthapath Branch", "sub_branch_code": "0050"},
        {"name": "Mouchak Branch", "sub_branch_code": "0051"},
        {"name": "Maligram Branch", "sub_branch_code": "0052"},
        {"name": "Dinajpur Branch", "sub_branch_code": "0054"},
        {"name": "KDA C/A Branch", "sub_branch_code": "0055"},
        {"name": "Natore Branch", "sub_branch_code": "0056"},
        {"name": "Feni Branch", "sub_branch_code": "0057"},
        {"name": "Labonchora Branch", "sub_branch_code": "0059"},
        {"name": "Khatungonj Branch", "sub_branch_code": "0061"},
        {"name": "Amin Bazar Branch", "sub_branch_code": "0062"},
        {"name": "Banari Para Branch", "sub_branch_code": "0063"},
        {"name": "Faltita Branch", "sub_branch_code": "0064"},
        {"name": "Adda Bazar Branch", "sub_branch_code": "0065"},
        {"name": "Jibannagar Branch", "sub_branch_code": "0066"},
        {"name": "SBAC Corporate Branch", "sub_branch_code": "0067"},
        {"name": "Abdullahpur Branch", "sub_branch_code": "0068"},
        {"name": "Bhulta Branch", "sub_branch_code": "0069"},
        {"name": "Mymensingh Branch", "sub_branch_code": "0070"},
        {"name": "Birganj Branch", "sub_branch_code": "0071"},
        {"name": "Nazipur Branch", "sub_branch_code": "0072"},
        {"name": "Mehendiganj Branch", "sub_branch_code": "0073"},
        {"name": "Cumilla Branch", "sub_branch_code": "0074"},
        {"name": "Bhola Branch", "sub_branch_code": "0075"},
        {"name": "Bashundhara Branch", "sub_branch_code": "0076"},
        {"name": "Babubazar Branch", "sub_branch_code": "0077"},
        {"name": "Ramganj Branch", "sub_branch_code": "0078"},
        {"name": "Kaliganj Branch", "sub_branch_code": "0079"},
        {"name": "Palashbari Branch", "sub_branch_code": "0080"},
        {"name": "Mohakhali Branch", "sub_branch_code": "0081"},
        {"name": "Bhandaria Branch", "sub_branch_code": "0082"},
        {"name": "Benapole Branch", "sub_branch_code": "0083"},
        {"name": "Lohagara Branch", "sub_branch_code": "0084"},
        {"name": "KhanJahan Ali Mazar Branch", "sub_branch_code": "0085"},
        {"name": "Tejgaon Link Road Branch", "sub_branch_code": "0086"},
        {"name": "Narsingdi Branch", "sub_branch_code": "0087"},
        {"name": "Darus Salam Road Branch", "sub_branch_code": "0088"},
        {"name": "Cox's Bazar Branch", "sub_branch_code": "0089"},
        {"name": "Bhairab Branch", "sub_branch_code": "0090"},
        {"name": "Hossainpur Branch", "sub_branch_code": "0091"},
        {"name": "Tangail Branch", "sub_branch_code": "0092"},
        {"name": "Gopalgonj Sub Branch", "sub_branch_code": "2001"},
        {"name": "Jatrabari Sub Branch", "sub_branch_code": "2002"},
        {"name": "Rayenda Bazar Sub Branch", "sub_branch_code": "2003"},
        {"name": "Rupatoli Sub Branch", "sub_branch_code": "2004"},
        {"name": "Pacchor Sub Branch", "sub_branch_code": "2005"},
        {"name": "Muladi Sub Branch", "sub_branch_code": "2006"},
        {"name": "Hatirpul Sub Branch", "sub_branch_code": "2007"},
        {"name": "Laxmipur Sub Branch", "sub_branch_code": "2008"},
        {"name": "Yousuf Market Sub Branch", "sub_branch_code": "2009"},
        {"name": "Dupchanchia Sub Branch", "sub_branch_code": "2010"},
        {"name": "Gopalpur Sub Branch", "sub_branch_code": "2011"},
        {"name": "Thermax Shilpo Sub Branch", "sub_branch_code": "2012"},
        {"name": "Pirganj Sub Branch", "sub_branch_code": "2013"},
        {"name": "Trunk Road Sub-Branch", "sub_branch_code": "2014"},
        {"name": "Barura Sub-Branch", "sub_branch_code": "2015"},
        {"name": "Madhabdi Sub-Branch", "sub_branch_code": "2016"},
        {"name": "Bagerhat Sub-Branch", "sub_branch_code": "2017"},
        {"name": "Dania Sub-Branch", "sub_branch_code": "2018"},
        {"name": "Reazuddin Bazar Sub-Branch", "sub_branch_code": "2019"},
        {"name": "Kalaroa Sub-Branch", "sub_branch_code": "2020"},
        {"name": "Mongla Sub-Branch", "sub_branch_code": "2021"},
        {"name": "Indira Road Sub-Branch", "sub_branch_code": "2022"},
        {"name": "Fakirhat Sub-Branch", "sub_branch_code": "2023"},
        {"name": "Tanbazar Sub-Branch", "sub_branch_code": "2024"},
        {"name": "Pirojpur Sub-Branch", "sub_branch_code": "2025"},
        {"name": "Shahi Eidgah Sub Branch", "sub_branch_code": "2026"},
        {"name": "Charfesson Sub Branch", "sub_branch_code": "2027"},
        {"name": "Sherpur Sub-Branch", "sub_branch_code": "2028"},
        {"name": "Bateshwar Sub-Branch", "sub_branch_code": "2029"},
        {"name": "Aftabganj Sub Branch", "sub_branch_code": "2030"},
        {"name": "Paduar Bazar Biswha Road Sub-Branch", "sub_branch_code": "2031"}
    ]

    for loc in locations:
        if not Location.query.filter_by(name=loc["name"]).first():
            new_location = Location(name=loc["name"], sub_branch_code=loc["sub_branch_code"])
            db.session.add(new_location)

    # Commit locations first
    db.session.commit()
    print("Locations seeded successfully.")

    # Seed devices
    locations = Location.query.all()
    for loc in locations:
        if not Device.query.filter_by(name="Cisco Router", location_id=loc.id).first():
            router = Device(name="Cisco Router", type="Router", location_id=loc.id)
            db.session.add(router)

        if not Device.query.filter_by(name="Cisco Switch", location_id=loc.id).first():
            switch = Device(name="Cisco Switch", type="Switch", location_id=loc.id)
            db.session.add(switch)

    # Commit devices first
    db.session.commit()
    print("Devices seeded successfully.")

    # Seed device details
    devices = Device.query.all()
    for dev in devices:
        if not DeviceDetails.query.filter_by(device_id=dev.id).first():
            serial_number = f"SN-{random.randint(100000000, 999999999)}"  # Generate unique serial number
            details = DeviceDetails(
                device_id=dev.id,
                oem="Cisco",
                serial_number=serial_number,
                firmware_version="v1.0.0",
                installation_date=date.today(),
                bandwidth_usage=0,
                uptime=0
            )
            db.session.add(details)
    
    def add_devices(location_name, device_type, count):
        location = Location.query.filter_by(name=location_name).first()
        if location:
            for _ in range(count):
                device = Device(name=f"{device_type}", type=device_type, location_id=location.id)
                db.session.add(device)

    # Adding required devices to specific locations
    add_devices("DC", "Server", 3)
    add_devices("DC", "Storage", 3)
    add_devices("DC", "Firewall", 3)

    add_devices("DR", "Server", 2)
    add_devices("DR", "Storage", 2)
    add_devices("DR", "Firewall", 2)

    add_devices("Head Office", "Server", 10)

    # Commit devices
    db.session.commit()
    print("Devices seeded successfully.")

    # Seed device details
    devices = Device.query.all()
    for dev in devices:
        if not DeviceDetails.query.filter_by(device_id=dev.id).first():
            serial_number = f"SN-{random.randint(100000000, 999999999)}"  # Generate unique serial number
            details = DeviceDetails(
                device_id=dev.id,
                oem="Generic",
                serial_number=serial_number,
                firmware_version="v1.0.0",
                installation_date=date.today(),
                bandwidth_usage=0,
                uptime=0
            )
            db.session.add(details)

    db.session.commit()
    print("Device details seeded successfully.")
