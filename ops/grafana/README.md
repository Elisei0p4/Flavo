Grafana Dashboards

This folder contains example Grafana dashboards for the application metrics exposed via django-prometheus and infrastructure.

- django_overview.json: Basic panels for request rate, error rate, response latency, db connections, cache ops.

Import these JSON files into Grafana (Dashboards -> Import) and select your Prometheus data source.




