from fastapi import HTTPException
from sqlalchemy.orm import Session

from ...db_init import Game


def delete_game_db(game_id: int, db: Session) -> bool:
    db_game = db.query(Game).filter(Game.id == game_id).first()

    if db_game is None:
        raise HTTPException(status_code=404, detail="Game not found")

    # db.query(Mod).filter(Mod.game_id == game_id).delete()

    db.delete(db_game)
    db.commit()
    return True
