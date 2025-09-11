from typing import List

import uvicorn
from db.db_crud.games.game_create import create_game_db
from db.db_crud.games.game_delete import delete_game_db
from db.db_crud.games.game_read import read_games_db
from db.db_crud.pydantic import (
    GameCreate,
    GameResponse,
    ModCreate,
    ModResponse,
)
from db.db_init import Game, Mod, get_db, init_db
from db.db_test import db_test
from fastapi import Depends, FastAPI, HTTPException
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


@app.get("/api/test")
def test_connection():
    return db_test()


@app.post("/api/games", response_model=GameResponse)
def create_game(game: GameCreate, db: Session = Depends(get_db)):
    return create_game_db(game, db)


@app.get("/api/games", response_model=List[GameResponse])
def read_games(db: Session = Depends(get_db)):
    return read_games_db(db)


@app.get("/api/games/{game_id}", response_model=GameResponse)
def get_game(game_id: int, db: Session = Depends(get_db)):
    db_game = db.query(Game).filter(Game.id == game_id).first()
    if db_game is None:
        raise HTTPException(status_code=404, detail="Game not found")
    return db_game


@app.delete("/api/games/{game_id}")
def delete_game(game_id: int, db: Session = Depends(get_db)):
    success = delete_game_db(game_id, db)
    if not success:
        raise HTTPException(status_code=404, detail="Game not found")
    return {"message": f"Game with id {game_id} deleted successfully"}


# Mod endpoints
@app.post("/api/games/{game_id}/mods", response_model=ModResponse)
def create_mod(game_id: int, mod: ModCreate, db: Session = Depends(get_db)):
    # Check if game exists
    game = db.query(Game).filter(Game.id == game_id).first()
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")

    # Create mod
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


@app.get("/api/games/{game_id}/mods", response_model=List[ModResponse])
def get_mods(game_id: int, db: Session = Depends(get_db)):
    # Check if game exists
    game = db.query(Game).filter(Game.id == game_id).first()
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")

    return db.query(Mod).filter(Mod.game_id == game_id).all()


if __name__ == "__main__":
    uvicorn.run(app)
