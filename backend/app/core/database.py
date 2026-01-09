"""
Database connection and session management
"""
import ssl
from typing import AsyncGenerator
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel

from app.core.config import settings


def get_database_url_and_ssl():
    """
    Process DATABASE_URL for asyncpg compatibility.
    Removes sslmode from URL and returns proper SSL context.
    """
    url = settings.DATABASE_URL
    connect_args = {}

    # Parse URL to check for sslmode
    parsed = urlparse(url)
    query_params = parse_qs(parsed.query)

    # Check if SSL is required
    ssl_mode = query_params.pop('sslmode', [None])[0]

    if ssl_mode in ('require', 'verify-ca', 'verify-full'):
        # Create SSL context for Neon PostgreSQL
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        connect_args['ssl'] = ssl_context

    # Rebuild URL without sslmode
    new_query = urlencode(query_params, doseq=True)
    new_parsed = parsed._replace(query=new_query)
    clean_url = urlunparse(new_parsed)

    return clean_url, connect_args


# Get clean URL and SSL config
database_url, connect_args = get_database_url_and_ssl()

# Create async engine
engine = create_async_engine(
    database_url,
    echo=settings.DEBUG,
    future=True,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    connect_args=connect_args,
)

# Create async session factory
async_session = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def init_db() -> None:
    """Initialize database tables"""
    try:
        async with engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)
        print("Database connected successfully!")
    except Exception as e:
        print(f"Warning: Database connection failed: {e}")
        print("Server will start but database features won't work.")


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Dependency to get database session"""
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
