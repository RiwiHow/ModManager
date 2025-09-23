import shutil

from utils.file_utils import BACKEND_DIR
from utils.mod_manager.mod_toggle import disable_mod


def mod_delete(mod_name, game):
    MOD_STORAGE_DIR = BACKEND_DIR / "data" / "mods" / str(game.name) / mod_name

    disable_mod(mod_name, game)
    shutil.rmtree(MOD_STORAGE_DIR)
