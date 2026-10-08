import os

import psycopg
from psycopg.rows import dict_row


def connect():
    url = os.environ.get("DATABASE_URL")
    if not url:
        raise RuntimeError("Set DATABASE_URL; see backend/.env.example")
    return psycopg.connect(url, row_factory=dict_row, connect_timeout=5)


def initialize_database():
    # A single table is enough for this sample. Larger apps need migrations.
    with connect() as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS maintenance_requests (
                id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                property VARCHAR(200) NOT NULL,
                unit VARCHAR(200) NOT NULL,
                title VARCHAR(200) NOT NULL,
                priority VARCHAR(10) NOT NULL
                    CHECK (priority IN ('Low', 'Medium', 'High')),
                status VARCHAR(20) NOT NULL DEFAULT 'Open'
                    CHECK (status IN ('Open', 'In Progress', 'Completed'))
            )
        """)
