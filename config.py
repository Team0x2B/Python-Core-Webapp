import os


def __get_or_default(var, default):
    if var in os.environ:
        return os.environ[var]
    else:
        return default


database_uri = __get_or_default(var="DATABASE_URL", default="sqlite:///studi_data.db")

secret_key = __get_or_default(var="SECRET_KEY", default=None)

