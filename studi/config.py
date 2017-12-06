import os


database_uri = os.environ.get("DATABASE_URL", "sqlite:///studi_data.db")

secret_key = os.environ.get("SECRET_KEY", "maybe-dont-use-this")

if secret_key == "maybe-dont-use-this":
    print("SECRET_KEY not properly set -- hopefully this is debug")
