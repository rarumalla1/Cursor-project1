from flask import Flask, render_template, request, redirect, url_for, send_from_directory, jsonify
from models import db, Note
from models.database import init_db

app = Flask(__name__, static_url_path='/static')
init_db(app)

@app.route('/')
def index():
    notes = Note.query.filter_by(is_archived=False).order_by(Note.created_at.desc()).all()
    return render_template('index.html', notes=notes)

@app.route('/add_note', methods=['POST'])
def add_note():
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        color = request.form.get('color', 'default')
        new_note = Note(title=title, content=content, color=color)
        db.session.add(new_note)
        db.session.commit()
        return redirect(url_for('index'))

@app.route('/update_color/<int:id>', methods=['POST'])
def update_color(id):
    note = Note.query.get_or_404(id)
    color = request.form.get('color', 'default')
    note.color = color
    db.session.commit()
    return jsonify({'success': True})

@app.route('/delete/<int:id>')
def delete_note(id):
    note = Note.query.get_or_404(id)
    db.session.delete(note)
    db.session.commit()
    return redirect(url_for('index'))

@app.route('/archive/<int:id>')
def archive_note(id):
    note = Note.query.get_or_404(id)
    note.is_archived = True
    db.session.commit()
    return redirect(url_for('index'))

@app.route('/archived')
def archived_notes():
    notes = Note.query.filter_by(is_archived=True).order_by(Note.created_at.desc()).all()
    return render_template('archived.html', notes=notes)

@app.route('/edit/<int:id>', methods=['GET'])
def edit_note(id):
    note = Note.query.get_or_404(id)
    return render_template('edit.html', note=note)

@app.route('/update/<int:id>', methods=['POST'])
def update_note(id):
    note = Note.query.get_or_404(id)
    note.title = request.form['title']
    note.content = request.form['content']
    note.color = request.form.get('color', note.color)
    db.session.commit()
    return redirect(url_for('index'))

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(debug=True) 