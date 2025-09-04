from typing import List, Optional

import uvicorn
from db.db_create import Game, Mod, get_db, init_db
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

init_db()
app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for request/response
class GameBase(BaseModel):
    name: str
    path: str


class GameCreate(GameBase):
    pass


class GameResponse(GameBase):
    id: int

    class Config:
        from_attributes = True


class ModBase(BaseModel):
    name: str
    folder_name: str
    description: Optional[str] = None
    version: Optional[str] = None
    enabled: int = 1


class ModCreate(ModBase):
    pass


class ModResponse(ModBase):
    id: int
    game_id: int

    class Config:
        from_attributes = True


@app.get("/api/test")
async def test_connection():
    return {"message": "Connected successfully!"}


# Game endpoints
@app.post("/api/games", response_model=GameResponse)
def create_game(game: GameCreate, db: Session = Depends(get_db)):
    db_game = Game(name=game.name, path=game.path)
    db.add(db_game)
    db.commit()
    db.refresh(db_game)
    return db_game


@app.get("/api/games", response_model=List[GameResponse])
def get_games(db: Session = Depends(get_db)):
    return db.query(Game).all()


@app.get("/api/games/{game_id}", response_model=GameResponse)
def get_game(game_id: int, db: Session = Depends(get_db)):
    db_game = db.query(Game).filter(Game.id == game_id).first()
    if db_game is None:
        raise HTTPException(status_code=404, detail="Game not found")
    return db_game


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
        folder_name=mod.folder_name,
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
