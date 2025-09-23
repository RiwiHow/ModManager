from typing import Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session
from utils.mod_manager.mod_toggle import disable_mod, enable_mod

from ...db_init import Mod
from ..pydantic import ModUpdate


def update_mod_db(mod_id: int, update_detail: ModUpdate, db: Session) -> Optional[Mod]:
    db_mod = db.query(Mod).filter(Mod.id == mod_id).first()

    if not db_mod:
        raise HTTPException(status_code=404, detail="Mod not found")

    update_data = update_detail.model_dump(exclude_unset=True)

    if "enabled" in update_data:
        # Get the game object (assuming there's a relationship)
        game = db_mod.game  # Adjust this based on your actual relationship

        if update_data["enabled"] == 1:
            enable_mod(db_mod.name, game)
        elif update_data["enabled"] == 0:
            disable_mod(db_mod.name, game)

    for field, value in update_data.items():
        if hasattr(db_mod, field):
            setattr(db_mod, field, value)

    db.commit()
    db.refresh(db_mod)

    return db_mod
