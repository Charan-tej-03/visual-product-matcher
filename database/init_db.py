'''
This module is used to initialize the database and create a table.
'''

import os
from sqlalchemy import create_engine
from model import Base
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def main():
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    print("DB initialized at:", DATABASE_URL)

if __name__ == "__main__":
    main()

