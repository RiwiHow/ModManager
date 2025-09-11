from db.db_config import BASE_DIR, DATABASE_URL
from sqlalchemy import Column, ForeignKey, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker

BASE_DIR.mkdir(exist_ok=True, parents=True)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    path = Column(String, unique=True)

    # Relationship: one game has many mods
    mods = relationship("Mod", back_populates="game")


class Mod(Base):
    __tablename__ = "mods"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    version = Column(String, nullable=True)
    enabled = Column(Integer, default=1)  # 1 for enabled, 0 for disabled

    # Foreign key to Game
    game_id = Column(Integer, ForeignKey("games.id"))

    # Relationships
    game = relationship("Game", back_populates="mods")


def init_db():
    Base.metadata.create_all(bind=engine)


# Get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
