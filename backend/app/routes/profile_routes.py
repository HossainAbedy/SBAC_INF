from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.models.user import User

profile_routes = Blueprint('profile_routes', __name__)

@profile_routes.route('/profile/<getemail>')
@jwt_required() 
def my_profile(getemail):
    print(getemail)
    if not getemail:
        return jsonify({"error": "Unauthorized Access"}), 401
       
    user = User.query.filter_by(email=getemail).first()
  
    response_body = {
        "id": user.id,
        "name": user.username,
        "email": user.email,
        "role" : user.role_id
    }
  
    return response_body
