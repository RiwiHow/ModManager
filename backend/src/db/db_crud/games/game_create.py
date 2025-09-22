from sqlalchemy.orm import Session
from utils.game_detect import mod_path_detect

from ...db_init import Game
from ..pydantic import GameCreate


def create_game_db(game: GameCreate, db: Session):
    mod_path = mod_path_detect(game.exe_path)

    db_game = Game(name=game.name, exe_path=game.exe_path, mod_path=mod_path)

    db.add(db_game)
    db.commit()
    db.refresh(db_game)

    return db_game
