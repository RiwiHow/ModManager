import os
import tempfile
from typing import Optional

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from utils.file_utils import (
    detect_mod_structure,
    extract_compressed_file,
    get_mod_info_from_directory,
    install_mod_to_game_directory,
    is_supported_format,
)

from ...db_init import Game, Mod
from ..pydantic import ModCreate
from .mod_create import create_mod_db


async def install_mod_from_file(
    game_id: int,
    file: UploadFile,
    mod_name: Optional[str],
    db: Session,
) -> Mod:
    """
    Install a mod from an uploaded compressed file

    Args:
        game_id: ID of the game to install the mod for
        file: Uploaded compressed file
        mod_name: Optional custom name for the mod
        db: Database session

    Returns:
        Mod: Created mod instance

    Raises:
        HTTPException: If game not found, file format not supported, or installation fails
    """
    game = db.query(Game).filter(Game.id == game_id).first()
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")

    if not is_supported_format(file.filename or ""):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format. Supported formats: {', '.join(['zip', '7z'])}",
        )

    # Create temporary directory for extraction
    with tempfile.TemporaryDirectory() as temp_dir:
        print(temp_dir)
        try:
            # Save uploaded file to temporary location
            temp_file_path = os.path.join(temp_dir, file.filename or "temp_mod")

            with open(temp_file_path, "wb") as temp_file:
                content = await file.read()
                temp_file.write(content)

            # Extract the compressed file
            extract_dir = os.path.join(temp_dir, "extracted")
            if not extract_compressed_file(temp_file_path, extract_dir):
                raise HTTPException(
                    status_code=400, detail="Failed to extract compressed file"
                )

            # Detect mod structure
            mod_dir = detect_mod_structure(extract_dir)
            if not mod_dir:
                raise HTTPException(
                    status_code=400, detail="Could not detect mod structure"
                )

            # Get mod info from directory or use provided name
            mod_info = get_mod_info_from_directory(mod_dir)

            # Use provided mod name or fallback to detected/filename
            final_mod_name = (
                mod_name
                or mod_info.get("name")
                or os.path.splitext(file.filename or "unknown")[0]
            )

            # Install mod to game directory
            install_mod_to_game_directory(mod_dir, str(game.path), final_mod_name)

            # Create mod entry in database
            mod_create = ModCreate(
                name=final_mod_name,
                description=mod_info.get("description"),
                version=mod_info.get("version"),
                enabled=1,
            )

            db_mod = create_mod_db(game_id, mod_create, db)

            return db_mod

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Failed to install mod: {str(e)}"
            )
