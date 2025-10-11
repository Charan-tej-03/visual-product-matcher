'''
This module serves as the main entry point for the backend.
'''

import os
from flask import Flask, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv() 

DATABASE_URL = os.getenv("DATABASE_URL")

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Attach DB engine and session factory to app for easy access
    engine = create_engine(DATABASE_URL, future=True)
    SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    app.config["ENGINE"] = engine
    app.config["DB_SESSION"] = SessionLocal

    @app.route("/health")
    def health():
        return jsonify({"ok": True})

    return app

if __name__ == "__main__":
    create_app().run(host="0.0.0.0", port=5000, debug=True)
