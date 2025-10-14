'''
This module serves as the main entry point for the backend.
'''

# app.py (replace previous)
import os, io, numpy as np
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.model import Product, Base
from models.embedder import Embedder
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from sklearn.metrics.pairwise import cosine_similarity
import requests
from io import BytesIO

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
BASE_DIR = os.path.dirname(__file__)
STATIC_IMAGES = os.path.join(BASE_DIR, "static","images")
EMBED_PATH = os.path.join(BASE_DIR, "database","embeddings.npy")
IDS_PATH = os.path.join(BASE_DIR, "database","product_ids.npy")
ALLOWED_EXT = {"png","jpg","jpeg"}

os.makedirs(STATIC_IMAGES, exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "database"), exist_ok=True)

engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

# Ensure tables exist
Base.metadata.create_all(bind=engine)

app = Flask(__name__)
CORS(app)

embedder = Embedder()
# load embeddings if exist
if os.path.exists(EMBED_PATH) and os.path.exists(IDS_PATH):
    embeddings = np.load(EMBED_PATH)
    product_ids = np.load(IDS_PATH)
else:
    embeddings = None
    product_ids = np.array([], dtype=int)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".",1)[1].lower() in ALLOWED_EXT

@app.route("/health")
def health():
    return jsonify({"ok": True, "products_count": session.query(Product).count()})

@app.route("/products")
def list_products():
    prods = session.query(Product).all()
    out = []
    for p in prods:
        out.append({
            "id": p.id,
            "name": p.name,
            "category": p.category,
            "price": p.price,
            "description": p.description,
            "image_url": f"/images/{p.image_filename}"
        })
    return jsonify(out)

@app.route("/images/<path:filename>")
def serve_image(filename):
    return send_from_directory(STATIC_IMAGES, filename)

@app.route("/search", methods=["POST"])
def search():
    try:
        img = None

        # Case 1: File upload
        if "image" in request.files and request.files["image"].filename != "":
            img = Image.open(request.files["image"].stream).convert("RGB")

        # Case 2: Image URL
        elif "image_url" in request.form and request.form["image_url"].strip() != "":
            image_url = request.form["image_url"].strip()
            resp = requests.get(image_url, timeout=10)
            if resp.status_code != 200:
                return jsonify({"error": "Failed to fetch image from URL"}), 400
            img = Image.open(BytesIO(resp.content)).convert("RGB")

        else:
            return jsonify({"error": "Provide an image file or image_url"}), 400

        # Embedding logic remains the same
        q_emb = embedder.embed_pil(img).reshape(1, -1)
        if embeddings is None:
            return jsonify({"error": "Embeddings not built. Run precompute_embeddings.py"}), 500

        sims = cosine_similarity(q_emb, embeddings)[0]
        k = int(request.args.get("k", 10))
        min_score = float(request.args.get("min_score", 0.0))
        idx_sorted = sims.argsort()[::-1]

        results = []
        for idx in idx_sorted:
            score = float(sims[idx])
            if score < min_score:
                continue
            prod_id = int(product_ids[idx])
            p = session.query(Product).filter_by(id=prod_id).first()
            if not p:
                continue
            results.append({
                "id": p.id,
                "name": p.name,
                "category": p.category,
                "price": p.price,
                "image_url": f"/images/{p.image_filename}",
                "score": round(score, 4)
            })
            if len(results) >= k:
                break

        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/add-product", methods=["POST"])
def add_product():
    """
    multipart/form-data:
      - image: file
      - name: str
      - category: str
      - price: float
      - description: str (optional)
    """
    try:
        if "image" not in request.files:
            return jsonify({"error":"No image file provided"}), 400
        image = request.files["image"]
        if not allowed_file(image.filename):
            return jsonify({"error":"Invalid file type"}), 400
        name = request.form.get("name")
        category = request.form.get("category")
        price = request.form.get("price", None)
        description = request.form.get("description", None)
        if not name or not category or price is None:
            return jsonify({"error":"Provide name, category and price"}), 400
        filename = secure_filename(image.filename)
        save_path = os.path.join(STATIC_IMAGES, filename)
        image.save(save_path)

        p = Product(name=name, category=category, image_filename=filename, price=float(price), description=description)
        session.add(p)
        session.commit()

        # compute embedding and append
        emb = embedder.embed_pil(Image.open(save_path))
        global embeddings, product_ids
        if embeddings is None:
            embeddings = emb.reshape(1,-1)
            product_ids = np.array([p.id])
        else:
            embeddings = np.vstack([embeddings, emb.reshape(1,-1)])
            product_ids = np.append(product_ids, p.id)
        np.save(EMBED_PATH, embeddings)
        np.save(IDS_PATH, product_ids)
        return jsonify({"success": True, "id": p.id})
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
