from fastapi import HTTPException
from utils.file_utils import (
    copy_archive_to_temp_path,
    create_managed_path_of_each_mod,
    extract_archive_to_managed_path,
    install_mod_to_game_directory,
)


async def mod_installer(mod_name, file, game):
    # Archive places here temporarily
    TEMP_ARCHIVE_PATH = await copy_archive_to_temp_path(file)

    # files in archive place here
    EXTRACTED_FOLDER_NAME, MOD_STORAGE_DIR = create_managed_path_of_each_mod(
        mod_name, file, game
    )

    # Extract the archive
    if not extract_archive_to_managed_path(
        str(TEMP_ARCHIVE_PATH), str(MOD_STORAGE_DIR)
    ):
        raise HTTPException(status_code=400, detail="Failed to extract compressed file")

    # Install mod to game directory (copy from our storage to game directory)
    install_mod_to_game_directory(MOD_STORAGE_DIR, game.mod_path)

    # Clean up the compressed file after extraction
    TEMP_ARCHIVE_PATH.unlink()

    return EXTRACTED_FOLDER_NAME
