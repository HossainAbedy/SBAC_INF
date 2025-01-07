from app import create_app, db
from app.models.role import Role

app = create_app()

with app.app_context():
    # Seed default roles
    if not Role.query.filter_by(name='admin').first():
        admin_role = Role(name='admin')
        db.session.add(admin_role)
    
    if not Role.query.filter_by(name='user').first():
        user_role = Role(name='user')
        db.session.add(user_role)
    
    db.session.commit()
    print("Roles seeded successfully.")
