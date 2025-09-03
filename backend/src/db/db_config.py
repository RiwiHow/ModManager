import os
import sys
from pathlib import Path


def get_app_data_dir():
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
