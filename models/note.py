from datetime import datetime
from .database import db

class Note(db.Model):
    """
    Note Model for storing note-related details
    """
    __tablename__ = 'notes'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=True, index=True)
    content = db.Column(db.Text, nullable=False)
    color = db.Column(db.String(20), default='default')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_archived = db.Column(db.Boolean, default=False)

    def __init__(self, title=None, content=None, color='default'):
        self.title = title
        self.content = content
        self.color = color

    def __repr__(self):
        return f'<Note {self.title if self.title else "Untitled"}>'

    def to_dict(self):
        """Convert the model to a dictionary"""
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'color': self.color,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'is_archived': self.is_archived
        }

    @staticmethod
    def from_dict(data):
        """Create a new Note instance from a dictionary"""
        return Note(
            title=data.get('title'),
            content=data.get('content'),
            color=data.get('color', 'default')
        ) 