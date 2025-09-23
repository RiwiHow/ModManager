from pathlib import Path

from fastapi import HTTPException
from utils.file_utils import (
    BACKEND_DIR,
    install_mod_to_game_directory,
    uninstall_mod_from_game_directory,
)


def enable_mod(mod_name, game):
    MOD_STORAGE_DIR = BACKEND_DIR / "data" / "mods" / str(game.name) / mod_name

    if not MOD_STORAGE_DIR.exists():
        raise HTTPException(status_code=404, detail="Mod files not found in storage")

    try:
        install_mod_to_game_directory(MOD_STORAGE_DIR, Path(game.mod_path))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to enable mod: {str(e)}")


def disable_mod(mod_name, game):
    MOD_STORAGE_DIR = BACKEND_DIR / "data" / "mods" / str(game.name) / mod_name

    if not MOD_STORAGE_DIR.exists():
        raise HTTPException(status_code=404, detail="Mod files not found in storage")

    try:
        uninstall_mod_from_game_directory(MOD_STORAGE_DIR, Path(game.mod_path))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to disable mod: {str(e)}")
