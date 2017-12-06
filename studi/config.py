import os


database_uri = os.environ.get("DATABASE_URL", "sqlite:///studi_data.db")

secret_key = os.environ.get("SECRET_KEY", "please-change-this")

if secret_key == "please-change-this":
    print("secret-key not set. Hopefully you're in debug.")
