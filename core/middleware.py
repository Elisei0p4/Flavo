import uuid
import time
import logging
from typing import Callable
from django.http import HttpRequest, HttpResponse
import contextvars


request_id_ctx: contextvars.ContextVar[str] = contextvars.ContextVar("request_id", default="-")

logger = logging.getLogger(__name__)


class RequestIdMiddleware:
    """Ensures every request has a request id and exposes it for logging.

    - Reads X-Request-ID header if client sent it
    - Otherwise generates a new UUID4
    - Sets the header on the response
    - Stores the value in a contextvar so logging filters can include it
    """

    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]):
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        incoming_id = request.headers.get("X-Request-ID")
        rid = incoming_id or str(uuid.uuid4())
        request_id_ctx.set(rid)

        response = self.get_response(request)
        response["X-Request-ID"] = rid
        return response


class RequestResponseLoggingMiddleware:
    """Логирует запросы и ответы для отладки и мониторинга, фокусируясь на ошибках."""

    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]):
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        start_time = time.time()
        response = self.get_response(request)
        duration = time.time() - start_time

        if response.status_code >= 400:
            log_level = logger.error
        else:
            log_level = logger.info

        log_level(
            "Request completed: %s %s -> %d in %.3fs",
            request.method,
            request.get_full_path(),
            response.status_code,
            duration
        )
        
        return response



