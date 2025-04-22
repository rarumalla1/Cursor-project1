"""add is_deleted column

Revision ID: 1
Create Date: 2024-03-19 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '1'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Add is_deleted column
    op.add_column('notes', sa.Column('is_deleted', sa.DateTime, nullable=True))

def downgrade():
    # Remove is_deleted column
    op.drop_column('notes', 'is_deleted') 