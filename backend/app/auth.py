from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from app.models import db, User, Role

app = Flask(__name__)
bcrypt = Bcrypt(app)

def register_user(data):
    """
    Register a new user with the provided data.
    """
    # Extract and validate the required fields
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role_id = data.get('role_id', '2')  # Default to 'user' if not specified

    if not username or not email or not password:
        return jsonify({"message": "Missing required fields: username, email, password"}), 400

    # Check if the email or username already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email is already registered"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username is already taken"}), 400
    
    # Fetch the 'user' role from the roles table
    user_role = Role.query.filter_by(name="user").first()

    # Hash the password before storing it
    hashed_password = bcrypt.generate_password_hash(password)

    # Create a new user and assign the default role (user)
    new_user = User(
        username=data['username'],
        email=data['email'],
        password=hashed_password,
        role_id=user_role.id  # Assigning 'user' role by default
    )

    try:
        # Add the user to the database
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500


def login_user(data):
    """
    Log in a user with the provided credentials.
    """
    # Extract and validate the required fields
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Missing required fields: email, password"}), 400

    # Find user by email
    user = User.query.filter_by(email=email).first()

    # Check if the user exists and the password matches
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials"}), 401

    # Create an access token with the user's identity
    try:
        access_token = create_access_token(identity={
            "id": user.id,
            "username": user.username,
            "role": user.role.name
        })
        return jsonify({"access_token": access_token}), 200
    except Exception as e:
        return jsonify({"message": f"An error occurred while creating token: {str(e)}"}), 500
