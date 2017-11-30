import os


database_uri = os.environ.get("DATABASE_URL", "sqlite:///studi_data.db")

secret_key = os.environ.get("SECRET_KEY", "maybe-dont-use-this")

