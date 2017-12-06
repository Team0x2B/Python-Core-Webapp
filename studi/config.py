import os
from base64 import b64decode


database_uri = os.environ.get("DATABASE_URL", "sqlite:///studi_data.db")

if "SECRET_KEY" in os.environ:
    secret_key = b64decode(os.environ["SECRET_KEY"], 'utf-8')
else:
    secret_key = "please-change-this"
    print("secret-key not set. Hopefully you're in debug.")
