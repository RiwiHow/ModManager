from pathlib import Path

SUPPORTED_GAMES = {
    "Stellar Blade": {
        "exe": "SB.exe",
        "mod_path": "SB/Content/Paks/~mods",
    },
}


def mod_path_detect(game_path):
    path = Path(game_path)
    for _, info in SUPPORTED_GAMES.items():
        exe_path = path / info["exe"]
        if exe_path.exists():
            return str(path / info["mod_path"])
    return None
