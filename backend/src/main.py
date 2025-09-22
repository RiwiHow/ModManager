from typing import List

import uvicorn
from db.db_crud.games.game_create import create_game_db
from db.db_crud.games.game_delete import delete_game_db
from db.db_crud.games.game_read import read_games_db
from db.db_crud.mods.mod_create import install_mod_from_file
from db.db_crud.mods.mod_delete import delete_mod_db
from db.db_crud.mods.mod_read import read_mod_db, read_mods_db
from db.db_crud.mods.mod_update import update_mod_db
from db.db_crud.pydantic import (
    GameCreate,
    GameResponse,
    ModResponse,
    ModUpdate,
)
from db.db_init import get_db, init_db
from db.db_test import db_test
from fastapi import Depends, FastAPI, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

init_db()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Test Endpoint
@app.get("/api/test")
def test_connection():
    return db_test()


# Game Endponit
@app.post("/api/games/create", response_model=GameResponse)
def create_game(game: GameCreate, db: Session = Depends(get_db)):
    return create_game_db(game, db)


@app.get("/api/games/list", response_model=List[GameResponse])
def read_games(db: Session = Depends(get_db)):
    return read_games_db(db)


@app.delete("/api/games/{game_id}/delete")
def delete_game(game_id: int, db: Session = Depends(get_db)):
    return delete_game_db(game_id, db)


# Mod endpoints
@app.post("/api/games/{game_id}/mods/create", response_model=ModResponse)
async def install_mod(
    game_id: int,
    file: UploadFile,
    mod_name: str = Form(None),
    db: Session = Depends(get_db),
):
    return await install_mod_from_file(game_id, file, mod_name, db)


@app.get("/api/games/{game_id}/mods/list", response_model=List[ModResponse])
def get_mods(game_id: int, db: Session = Depends(get_db)):
    return read_mods_db(game_id, db)


@app.put("/api/games/{game_id}/mods/{mod_id}/update", response_model=ModResponse)
def update_mod(mod_id: int, mod_update: ModUpdate, db: Session = Depends(get_db)):
    return update_mod_db(mod_id, mod_update, db)


@app.get("/api/games/{game_id}/mods/{mod_id}/read", response_model=ModResponse)
def get_mod(mod_id: int, db: Session = Depends(get_db)):
    return read_mod_db(mod_id, db)


@app.delete("/api/games/{game_id}/mods/{mod_id}/delete")
def delete_mod(mod_id: int, db: Session = Depends(get_db)):
    return delete_mod_db(mod_id, db)


if __name__ == "__main__":
    uvicorn.run(app)
