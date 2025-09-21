import shutil
import zipfile
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[2]


async def copy_archive_to_temp_path(file):
    # Archive places here temporarily
    ARCHIVE_DIR = BACKEND_DIR / "data" / "mods" / "Archive"
    ARCHIVE_DIR.mkdir(parents=True, exist_ok=True)

    TEMP_ARCHIVE_PATH = Path(ARCHIVE_DIR / (file.filename))

    with open(TEMP_ARCHIVE_PATH, "wb") as temp_file:
        content = await file.read()
        temp_file.write(content)

    return TEMP_ARCHIVE_PATH


def create_managed_path_of_each_mod(mod_name, file, game):
    EXTRACTED_FOLDER_NAME = mod_name or Path(file.filename).stem

    MOD_STORAGE_DIR = (
        BACKEND_DIR / "data" / "mods" / str(game.name) / EXTRACTED_FOLDER_NAME
    )

    MOD_STORAGE_DIR.mkdir(parents=True, exist_ok=True)

    return EXTRACTED_FOLDER_NAME, MOD_STORAGE_DIR


def extract_archive_to_managed_path(file_path: str, extract_to: str):
    try:
        filename_lower = file_path.lower()

        if filename_lower.endswith(".zip"):
            with zipfile.ZipFile(Path(file_path), "r") as zip_ref:
                zip_ref.extractall(Path(extract_to))

        elif filename_lower.endswith(".7z"):
            import py7zr

            with py7zr.SevenZipFile(file_path, mode="r") as z:
                z.extractall(extract_to)

        else:
            return False

        return True

    except Exception:
        return False


def install_mod_to_game_directory(managed_mod_path, game_path: str):
    game_path_obj = Path(game_path)

    try:
        shutil.copytree(managed_mod_path, game_path_obj, dirs_exist_ok=True)
    except Exception:
        raise


def is_supported_format(filename: str):
    return any(filename.endswith(fmt) for fmt in [".zip", ".7z"])
