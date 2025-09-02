import os
import sys
from pathlib import Path


def get_app_data_dir():
    # First check if the data directory is specified by environment variable
    # This will be set by the Electron app
    env_data_dir = os.environ.get("MOD_MANAGER_DATA_DIR")
    if env_data_dir:
        return Path(env_data_dir)

    # When running as a packaged application
    if getattr(sys, "frozen", False):
        # Get the directory where the executable is located
        base_dir = Path(os.path.dirname(sys.executable))
        # Use a data directory within the application directory
        return base_dir / "data"
    else:
        # During development, use the current directory
        return Path(os.path.dirname(os.path.abspath(__file__))) / "../../data"


BASE_DIR = get_app_data_dir()
DATABASE_URL = f"sqlite:///{BASE_DIR / 'mod_manager.db'}"

# # Application settings
# API_HOST = "127.0.0.1"
# API_PORT = 8000
