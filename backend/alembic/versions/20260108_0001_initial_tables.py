"""Create initial database tables

Revision ID: 0001
Revises:
Create Date: 2026-01-08

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '0001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

    # Create tasks table
    op.create_table(
        'tasks',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='pending'),
        sa.Column('priority', sa.String(length=10), nullable=False, server_default='medium'),
        sa.Column('due_date', sa.DateTime(), nullable=True),
        sa.Column('tags', postgresql.ARRAY(sa.Text()), nullable=True),
        sa.Column('is_recurring', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('recurrence_pattern', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_tasks_user_id', 'tasks', ['user_id'])
    op.create_index('ix_tasks_user_status', 'tasks', ['user_id', 'status'])
    op.create_index('ix_tasks_user_due_date', 'tasks', ['user_id', 'due_date'])
    op.create_index('ix_tasks_user_priority', 'tasks', ['user_id', 'priority'])

    # Create conversations table
    op.create_table(
        'conversations',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_conversations_user_id', 'conversations', ['user_id'])
    op.create_index('ix_conversations_user_created', 'conversations', ['user_id', 'created_at'])

    # Create messages table
    op.create_table(
        'messages',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('conversation_id', sa.UUID(), nullable=False),
        sa.Column('sender_type', sa.String(length=10), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['conversation_id'], ['conversations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_messages_conversation_id', 'messages', ['conversation_id'])
    op.create_index('ix_messages_conversation_created', 'messages', ['conversation_id', 'created_at'])


def downgrade() -> None:
    op.drop_index('ix_messages_conversation_created', 'messages')
    op.drop_index('ix_messages_conversation_id', 'messages')
    op.drop_table('messages')

    op.drop_index('ix_conversations_user_created', 'conversations')
    op.drop_index('ix_conversations_user_id', 'conversations')
    op.drop_table('conversations')

    op.drop_index('ix_tasks_user_priority', 'tasks')
    op.drop_index('ix_tasks_user_due_date', 'tasks')
    op.drop_index('ix_tasks_user_status', 'tasks')
    op.drop_index('ix_tasks_user_id', 'tasks')
    op.drop_table('tasks')

    op.drop_index('ix_users_email', 'users')
    op.drop_table('users')
