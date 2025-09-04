from sqlalchemy.orm import Session

from ...db_init import Game
from ..pydantic import GameCreate


def create_game_db(game: GameCreate, db: Session) -> Game:
    db_game = Game(name=game.name, path=game.path)
    db.add(db_game)
    db.commit()
    db.refresh(db_game)
    return db_game
