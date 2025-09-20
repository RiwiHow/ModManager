import shutil
import zipfile
from pathlib import Path
from typing import Optional


def is_supported_format(filename: str):
    filename_lower = filename.lower()
    return any(filename_lower.endswith(fmt) for fmt in [".zip", ".7z"])


def extract_compressed_file(file_path: str, extract_to: str):
    try:
        file_path_obj = Path(file_path)
        extract_to_obj = Path(extract_to)

        extract_to_obj.mkdir(parents=True, exist_ok=True)

        filename_lower = file_path.lower()

        if filename_lower.endswith(".zip"):
            with zipfile.ZipFile(file_path_obj, "r") as zip_ref:
                zip_ref.extractall(extract_to_obj)

        elif filename_lower.endswith(".7z"):
            import py7zr

            with py7zr.SevenZipFile(str(file_path_obj), mode="r") as z:
                z.extractall(str(extract_to_obj))

        else:
            return False

        return True

    except Exception as e:
        print(f"Error extracting file {file_path}: {str(e)}")
        return False


def detect_mod_structure(extracted_path: str) -> Optional[str]:
    extracted_path_obj = Path(extracted_path)

    # Check if there's a single directory containing the mod
    items = list(extracted_path_obj.iterdir())

    # If there's only one directory, it might be the mod folder
    if len(items) == 1 and items[0].is_dir():
        return str(items[0])

    # If there are multiple items or files, the extracted_path is the mod directory
    return str(extracted_path_obj)


def install_mod_to_game_directory(
    temp_mod_path: str, game_path: str, mod_name: str
) -> str:
    """
    Install mod from temporary location to game directory

    Args:
        temp_mod_path: Temporary path where mod was extracted
        game_path: Game installation directory
        mod_name: Name for the mod directory

    Returns:
        str: Final mod installation path
    """
    game_path_obj = Path(game_path)

    # Create mods directory in game path if it doesn't exist
    mods_dir = game_path_obj / "mods"
    mods_dir.mkdir(exist_ok=True)

    # Create specific mod directory
    mod_install_path = mods_dir / mod_name

    # Remove existing mod directory if it exists
    if mod_install_path.exists():
        shutil.rmtree(mod_install_path)

    # Move mod files to final location
    shutil.copytree(temp_mod_path, mod_install_path)

    return str(mod_install_path)


def get_mod_info_from_directory(mod_path: str) -> dict:
    """
    Try to extract mod information from directory structure or files

    Args:
        mod_path: Path to mod directory

    Returns:
        dict: Mod information with name, description, version
    """
    mod_path_obj = Path(mod_path)
    mod_info = {"name": mod_path_obj.name, "description": None, "version": None}

    # Look for common mod info files
    info_files = [
        "mod.txt",
        "info.txt",
        "readme.txt",
        "README.md",
        "mod.json",
        "info.json",
    ]

    for info_file in info_files:
        info_file_path = mod_path_obj / info_file
        if info_file_path.exists():
            try:
                with open(info_file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()

                # Simple extraction of version from content
                import re

                version_match = re.search(
                    r"version\s*:?\s*([0-9]+\.[0-9]+(?:\.[0-9]+)?)",
                    content,
                    re.IGNORECASE,
                )
                if version_match:
                    mod_info["version"] = version_match.group(1)

                # Use first few lines as description if available
                lines = content.split("\n")
                description_lines = [line.strip() for line in lines[:3] if line.strip()]
                if description_lines:
                    mod_info["description"] = " ".join(description_lines)[
                        :200
                    ]  # Limit to 200 chars

                break
            except Exception:
                continue

    return mod_info
