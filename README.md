# Python Notes App

A simple note-taking application built with Python Flask and SQLite.

## Features

- Create new notes with title and content
- View all notes on the homepage
- Delete notes
- Responsive design using Bootstrap
- SQLite database for data storage

## Setup

1. Install uv (if not already installed):
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

2. Create a virtual environment and install dependencies:
```bash
uv venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
uv pip install -r requirements.txt
```

3. Run the application:
```bash
python app.py
```

4. Open your browser and navigate to `http://localhost:5000`

## Project Structure

- `app.py`: Main application file with routes and database models
- `templates/`: Directory containing HTML templates
  - `base.html`: Base template with common layout
  - `index.html`: Homepage template showing all notes
  - `add_note.html`: Form template for adding new notes
- `requirements.txt`: List of Python dependencies
- `notes.db`: SQLite database file (created automatically)

## Why uv?

We use `uv` instead of `pip` because:
- It's significantly faster (10-100x) than pip
- Has reliable dependency resolution
- Creates reproducible environments
- Written in Rust for better performance
- Maintains compatibility with pip's interface 