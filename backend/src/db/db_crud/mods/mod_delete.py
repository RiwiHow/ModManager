from fastapi import HTTPException
from sqlalchemy.orm import Session
from utils.mod_manager.mod_delete import mod_delete

from ...db_init import Mod


def delete_mod_db(mod_id: int, db: Session):
    db_mod = db.query(Mod).filter(Mod.id == mod_id).first()

    if db_mod is None:
        raise HTTPException(status_code=404, detail="Mod not found")

    game = db_mod.game
    mod_delete(db_mod.name, game)

    db.delete(db_mod)
    db.commit()

    return db_mod
