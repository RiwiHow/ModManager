from typing import Optional

from pydantic import BaseModel, ConfigDict


# Pydantic models for request/response
class GameBase(BaseModel):
    name: str
    exe_path: str
    mod_path: Optional[str] = None


class GameCreate(GameBase):
    pass


class GameResponse(GameBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class ModBase(BaseModel):
    name: str
    description: Optional[str] = None
    version: Optional[str] = None
    enabled: int = 1


class ModCreate(ModBase):
    pass


class ModUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    version: Optional[str] = None
    enabled: Optional[int] = None


class ModResponse(ModBase):
    id: int
    game_id: int

    model_config = ConfigDict(from_attributes=True)
