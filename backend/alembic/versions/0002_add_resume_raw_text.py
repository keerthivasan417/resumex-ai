"""Add extracted raw text storage to resumes.

Revision ID: 0002_add_resume_raw_text
Revises: 0001_initial_core_schema
Create Date: 2026-09-15
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0002_add_resume_raw_text"
down_revision: Union[str, Sequence[str], None] = "0001_initial_core_schema"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("resumes", sa.Column("raw_text", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("resumes", "raw_text")
