from fastapi import HTTPException
from sqlalchemy.orm import Session

from ...db_init import Game, Mod


def read_mod_db(mod_id: int, db: Session):
    mod = db.query(Mod).filter(Mod.id == mod_id).first()
    if mod is None:
        raise HTTPException(status_code=404, detail="Mod not found")
    return mod


def read_mods_db(game_id: int, db: Session):
    game = db.query(Game).filter(Game.id == game_id).first()
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")

    return db.query(Mod).filter(Mod.game_id == game_id).all()
