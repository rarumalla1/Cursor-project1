from flask import Flask, render_template, request, redirect, url_for, send_from_directory, jsonify
from flask_migrate import Migrate
from models import db, Note
from models.database import init_db
from datetime import datetime

app = Flask(__name__, static_url_path='/static')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///notes.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db.init_app(app)
migrate = Migrate(app, db)

# Create tables
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    notes = Note.query.filter_by(is_archived=False, is_deleted=None).order_by(Note.created_at.desc()).all()
    return render_template('index.html', notes=notes)

@app.route('/add_note', methods=['POST'])
def add_note():
    try:
        data = request.get_json()
        title = data.get('title', '').strip()
        content = data.get('content', '').strip()
        color = data.get('color', 'default')

        if not content:
            return jsonify({'success': False, 'error': 'Content is required'})

        new_note = Note(
            title=title if title else None,
            content=content,
            color=color
        )
        db.session.add(new_note)
        db.session.commit()

        # Return the new note data in the response
        return jsonify({
            'success': True,
            'note': {
                'id': new_note.id,
                'title': new_note.title or '',
                'content': new_note.content,
                'color': new_note.color,
                'created_at': new_note.created_at.strftime('%Y-%m-%d %H:%M')
            }
        })

    except Exception as e:
        db.session.rollback()
        print(f"Error saving note: {str(e)}")
        return jsonify({'success': False, 'error': str(e)})

@app.route('/update_note_color', methods=['POST'])
def update_note_color():
    try:
        data = request.get_json()
        note_id = data.get('note_id')
        color = data.get('color', 'default')
        
        note = Note.query.get_or_404(note_id)
        note.color = color
        db.session.commit()
        
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)})

@app.route('/get_note/<int:id>')
def get_note(id):
    try:
        note = Note.query.get_or_404(id)
        return jsonify({
            'success': True,
            'note': {
                'id': note.id,
                'title': note.title,
                'content': note.content,
                'color': note.color
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/delete_note/<int:id>', methods=['POST'])
def delete_note(id):
    try:
        note = Note.query.get_or_404(id)
        note.is_deleted = datetime.utcnow()
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)})

@app.route('/archive_note/<int:id>', methods=['POST'])
def archive_note(id):
    try:
        note = Note.query.get_or_404(id)
        note.is_archived = True
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)})

@app.route('/edit_note/<int:id>', methods=['POST'])
def edit_note(id):
    try:
        note = Note.query.get_or_404(id)
        data = request.get_json()
        
        note.title = data.get('title', '').strip()
        note.content = data.get('content', '').strip()
        note.color = data.get('color', 'default')
        
        if not note.content:
            return jsonify({'success': False, 'error': 'Content is required'})
        
        db.session.commit()
        
        # Return the updated note data
        return jsonify({
            'success': True,
            'note': {
                'id': note.id,
                'title': note.title or '',
                'content': note.content,
                'color': note.color,
                'created_at': note.created_at.strftime('%Y-%m-%d %H:%M')
            }
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)})

@app.route('/archived')
def archived_notes():
    notes = Note.query.filter_by(is_archived=True).order_by(Note.created_at.desc()).all()
    return render_template('archived.html', notes=notes)

@app.route('/trash')
def trash():
    notes = Note.query.filter(Note.is_deleted.isnot(None)).order_by(Note.is_deleted.desc()).all()
    return render_template('trash.html', notes=notes)

@app.route('/restore/<int:id>')
def restore_note(id):
    note = Note.query.get_or_404(id)
    note.is_deleted = None
    db.session.commit()
    return redirect(url_for('trash'))

@app.route('/permanent_delete/<int:id>')
def permanent_delete_note(id):
    note = Note.query.get_or_404(id)
    db.session.delete(note)
    db.session.commit()
    return redirect(url_for('trash'))

@app.route('/empty_trash')
def empty_trash():
    Note.query.filter(Note.is_deleted.isnot(None)).delete()
    db.session.commit()
    return redirect(url_for('trash'))

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(debug=True) 