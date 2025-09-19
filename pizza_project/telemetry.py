"""
OpenTelemetry configuration for the Pizza Project.
"""
import os
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.instrumentation.django import DjangoInstrumentor
from opentelemetry.instrumentation.celery import CeleryInstrumentor
from opentelemetry.instrumentation.psycopg2 import Psycopg2Instrumentor
from opentelemetry.instrumentation.redis import RedisInstrumentor
from opentelemetry.sdk.resources import Resource
from urllib.parse import urlparse


def setup_telemetry():
    """Initialize OpenTelemetry instrumentation."""
    
    resource = Resource.create({
        "service.name": "pizza-project",
        "service.version": "1.0.0",
        "service.namespace": os.getenv("OTEL_NAMESPACE", "development"),
    })
    
    trace.set_tracer_provider(TracerProvider(resource=resource))
    tracer = trace.get_tracer(__name__)
    
    jaeger_endpoint = os.getenv('JAEGER_ENDPOINT', 'http://jaeger:14268/api/traces')
    
    jaeger_agent_host = os.getenv('JAEGER_AGENT_HOST')
    jaeger_agent_port = os.getenv('JAEGER_AGENT_PORT')
    
    if not jaeger_agent_host and jaeger_endpoint:
        try:
            parsed_url = urlparse(jaeger_endpoint)
            jaeger_agent_host = parsed_url.hostname or 'jaeger'
        except Exception:
            jaeger_agent_host = 'jaeger'
    
    if not jaeger_agent_port:
        jaeger_agent_port = '6831'
    
    jaeger_exporter = JaegerExporter(
        agent_host_name=jaeger_agent_host,
        agent_port=int(jaeger_agent_port),
    )
    
    span_processor = BatchSpanProcessor(jaeger_exporter)
    trace.get_tracer_provider().add_span_processor(span_processor)
    
    DjangoInstrumentor().instrument()
    
    CeleryInstrumentor().instrument()
    
    Psycopg2Instrumentor().instrument()
    
    RedisInstrumentor().instrument()
    
    return tracer