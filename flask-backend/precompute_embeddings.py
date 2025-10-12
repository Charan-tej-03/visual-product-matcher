'''
This module will compute the already added images
'''
import os
import numpy as np
from PIL import Image
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.model import Product
from models.embedder import Embedder
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
BASE_DIR = os.path.dirname(__file__)
IMAGES_DIR = os.path.join(BASE_DIR, "static","images")
EMBED_PATH = os.path.join(BASE_DIR, "database","embeddings.npy")
IDS_PATH = os.path.join(BASE_DIR, "database","product_ids.npy")

engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

def main():
    embedder = Embedder()
    products = session.query(Product).all()
    embeddings = []
    ids = []
    for p in products:
        path = os.path.join(IMAGES_DIR, p.image_filename)
        if not os.path.exists(path):
            print("Missing image:", path)
            continue
        img = Image.open(path)
        emb = embedder.embed_pil(img)
        embeddings.append(emb)
        ids.append(p.id)
        print("Embedded:", p.id, p.name)
    if embeddings:
        np.save(EMBED_PATH, np.vstack(embeddings))
        np.save(IDS_PATH, np.array(ids))
        print("Saved embeddings:", EMBED_PATH)
    else:
        print("No embeddings to save.")

if __name__ == "__main__":
    main()
