from typing import Optional

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from utils.file_utils import (
    is_supported_format,
)
from utils.mod_manager.mod_install import mod_installer

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


async def install_mod_from_file(
    game_id: int,
    file: UploadFile,
    mod_name: Optional[str],
    db: Session,
) -> Mod:
    game = db.query(Game).filter(Game.id == game_id).first()
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")

    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided.")

    if not is_supported_format(file.filename.lower()):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format. Supported formats: {', '.join(['zip', '7z'])}",
        )

    try:
        EXTRACTED_FOLDER_NAME = await mod_installer(mod_name, file, game)

        # Create mod entry in database
        mod_create = ModCreate(
            name=EXTRACTED_FOLDER_NAME,
            description="",
            version="",
            enabled=1,
        )

        db_mod = create_mod_db(game_id, mod_create, db)

        return db_mod

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to install mod: {str(e)}")
