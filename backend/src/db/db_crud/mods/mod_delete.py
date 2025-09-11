from fastapi import HTTPException
from sqlalchemy.orm import Session

from ...db_init import Mod


def delete_mod_db(mod_id: int, db: Session):
    db_mod = db.query(Mod).filter(Mod.id == mod_id).first()

    if db_mod is None:
        raise HTTPException(status_code=404, detail="Mod not found")

    db.delete(db_mod)
    db.commit()

    return db_mod
