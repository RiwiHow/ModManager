from typing import Optional

from pydantic import BaseModel


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
