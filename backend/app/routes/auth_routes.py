import json
from flask import Blueprint, request, jsonify, session
from flask_jwt_extended import create_access_token, unset_jwt_cookies,create_access_token, get_jwt, create_access_token, get_jwt_identity
from datetime import datetime, timedelta, timezone
from app.models.user import User
from app.auth import register_user
from app import bcrypt



auth_routes = Blueprint('auth_routes', __name__)


@auth_routes.route("/register", methods=["POST"])
def register():
    """
    Register a new user.
    """
    data = request.get_json()

    if not data:
        return jsonify({"message": "No data provided"}), 400

    print(f"Received registration data: {data}")

    try:
        response, status_code = register_user(data)

        # Ensure response contains user data
        if status_code == 201 and isinstance(response, dict) and "user" in response:
            return jsonify(response), 201
        else:
            return jsonify({"message": "User registered successfully", "user": None}), 201

    except Exception as e:
        print(f"Error during registration: {str(e)}")
        return jsonify({"message": "An error occurred during registration"}), 500

 
@auth_routes.route('/logintoken', methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
  
    user = User.query.filter_by(email=email).first()
    
    if user is None:
        return jsonify({"error": "Wrong email or password"}), 401
      
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401

    # Create access token with the user role included in the payload
    access_token = create_access_token(identity=email, additional_claims={"role": user.role.name})

    # Store the user's ID in the session
    session['user_id'] = user.id  # Store the user ID for session management
  
    return jsonify({
        "email": email,
        "access_token": access_token
    })

 
@auth_routes.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response
 
@auth_routes.route("/logout", methods=["POST"])
def logout():
    session.pop('user_id', None)  # Remove the user ID from the session
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response