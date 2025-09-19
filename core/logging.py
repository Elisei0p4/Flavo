import logging
from typing import Any
from .middleware import request_id_ctx


class RequestIdFilter(logging.Filter):
    """Injects request_id from contextvar into log records."""

    def filter(self, record: logging.LogRecord) -> bool:
        try:
            record.request_id = request_id_ctx.get()
        except Exception:
            record.request_id = "-"
        return True





