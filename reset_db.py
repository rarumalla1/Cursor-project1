import os
from app import app, db

def reset_database():
    # Get the database file path
    db_path = os.path.join('instance', 'notes.db')
    
    # Delete existing database if it exists
    if os.path.exists(db_path):
        try:
            os.remove(db_path)
            print(f"Deleted existing database: {db_path}")
        except Exception as e:
            print(f"Error deleting database: {e}")
            return False
    
    # Create new database with updated schema
    with app.app_context():
        try:
            db.create_all()
            print("Successfully created new database with updated schema")
            return True
        except Exception as e:
            print(f"Error creating database: {e}")
            return False

if __name__ == "__main__":
    print("Starting database reset...")
    if reset_database():
        print("Database reset completed successfully!")
    else:
        print("Database reset failed!") 