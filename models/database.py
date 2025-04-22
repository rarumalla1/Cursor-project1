from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os

db = SQLAlchemy()

def init_db(app):
    """Initialize the database with the Flask app"""
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///notes.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    
    # Initialize migrations
    Migrate(app, db)
    
    # Create tables for any models that don't exist
    with app.app_context():
        db.create_all() 