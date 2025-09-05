from sqlalchemy.orm import Session

from ...db_init import Game


def read_games_db(db: Session):
    return db.query(Game).all()
