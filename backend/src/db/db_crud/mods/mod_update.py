from typing import Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session

from ...db_init import Mod
from ..pydantic import ModUpdate


def update_mod_db(mod_id: int, mod_update: ModUpdate, db: Session) -> Optional[Mod]:
    db_mod = db.query(Mod).filter(Mod.id == mod_id).first()

    if not db_mod:
        raise HTTPException(status_code=404, detail="Mod not found")

    update_data = mod_update.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        if hasattr(db_mod, field):
            setattr(db_mod, field, value)

    db.commit()
    db.refresh(db_mod)

    return db_mod
