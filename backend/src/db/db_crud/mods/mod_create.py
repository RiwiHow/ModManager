from fastapi import HTTPException
from sqlalchemy.orm import Session

from ...db_init import Game, Mod
from ..pydantic import ModCreate


def create_mod_db(
    game_id: int,
    mod: ModCreate,
    db: Session,
):
    game = db.query(Game).filter(Game.id == game_id).first()
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")

    db_mod = Mod(
        name=mod.name,
        description=mod.description,
        version=mod.version,
        enabled=mod.enabled,
        game_id=game_id,
    )

    db.add(db_mod)
    db.commit()
    db.refresh(db_mod)

    return db_mod
