from datetime import timedelta

class Config:
    SECRET_KEY = 'SECRET_KEY'
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:root@localhost/inventory_db_test2'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)  # Set appropriate expiration time
