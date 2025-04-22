from app import app, db
from flask_migrate import upgrade
import os

def migrate_database():
    # Create migrations directory if it doesn't exist
    if not os.path.exists('migrations'):
        os.makedirs('migrations')
        os.makedirs('migrations/versions')
    
    # Copy our migration script to versions directory
    with open('migrations/add_is_deleted.py', 'r') as source:
        with open('migrations/versions/1_add_is_deleted.py', 'w') as target:
            target.write(source.read())
    
    # Apply migration
    with app.app_context():
        upgrade()

if __name__ == '__main__':
    migrate_database()
    print("Migration completed successfully!") 