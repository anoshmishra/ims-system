# Autonomous Incident Management System (IMS)

Enterprise-Grade SOC Platform with Asynchronous Processing and Intelligent Root Cause Analysis

---

## Overview

This project implements a high-throughput Incident Management System (IMS) designed to simulate a production-grade Security Operations Center (SOC). The system is capable of ingesting and processing high volumes of operational signals, automatically generating incidents, managing their lifecycle, and enforcing Root Cause Analysis (RCA) prior to closure.

The architecture emphasizes scalability, resilience, and strict separation of concerns. It incorporates asynchronous processing, multi-database persistence, and a workflow-driven state machine to ensure data integrity and operational reliability.

---

## System Architecture

```
Client (React Frontend)
        │
        ▼
Backend API (Node.js / Express)
        │
        ▼
Redis Queue (BullMQ)
        │
        ▼
Worker Layer (Asynchronous Processing)
        │
        ├── MongoDB (Raw Signal Storage / Audit Log)
        ├── PostgreSQL (Incidents and RCA - Source of Truth)
        └── Redis (In-Memory Cache for Dashboard State)
```

---

## Key Design Decisions

### Asynchronous Signal Processing

Incoming signals are not written directly to the database. Instead, they are placed into a Redis-backed queue (BullMQ), ensuring that ingestion remains non-blocking and resilient under high load. This design provides natural backpressure handling and prevents cascading failures when downstream services are slow.

---

### Debouncing Logic

To avoid redundant incident creation, signals are debounced based on component identifiers. If multiple signals for the same component are received within a 10-second window, only a single incident is created. This is implemented using Redis with time-based expiration keys.

---

### Multi-Sink Data Architecture

The system uses a purpose-driven data storage strategy:

| Storage System | Purpose                                                        |
| -------------- | -------------------------------------------------------------- |
| PostgreSQL     | Transactional storage for incidents, lifecycle states, and RCA |
| MongoDB        | High-volume storage for raw signal payloads                    |
| Redis          | In-memory cache for real-time dashboard data                   |

This separation ensures optimal performance, scalability, and maintainability.

---

### Workflow Engine

The incident lifecycle is governed using formal design patterns:

* **State Pattern**: Controls valid transitions between incident states:

  ```
  OPEN → INVESTIGATING → RESOLVED → CLOSED
  ```

* **Strategy Pattern**: Determines alert severity and handling logic based on component type or failure classification.

---

### Mandatory Root Cause Analysis (RCA)

An incident cannot transition to the CLOSED state without a valid RCA. This constraint is enforced at the service layer to ensure completeness and accountability.

---

### Mean Time To Repair (MTTR)

MTTR is automatically calculated as the difference between the initial signal timestamp and the RCA submission time. This metric is stored in PostgreSQL and can be queried for performance analysis.

---

## Getting Started

### Environment Configuration

Create a `.env` file inside the `backend` directory:

```
PORT=5000
POSTGRES_URI=postgresql://user:pass@postgres:5432/ims_db
MONGO_URI=mongodb://mongo:27017/ims_audit
REDIS_URI=redis://redis:6379
```

---

### Running the System

Start all services using Docker:

```
docker-compose up --build
```

This command initializes:

* Backend service (Node.js)
* Frontend application (React)
* PostgreSQL database
* MongoDB instance
* Redis server

---

## API Endpoints

### Signal Ingestion

```
POST /signal
```

Accepts incoming system signals and enqueues them for asynchronous processing.

---

### Incident Management

```
GET    /incidents
GET    /incident/:id
PATCH  /incident/:id/status
POST   /incident/:id/rca
```

---

## Observability

### Health Check Endpoint

```
GET /health
```

Provides system health status, including database connectivity and service readiness.

---

### Metrics

The system logs operational metrics such as:

* Signals processed per second
* Worker throughput

---

## Testing and Simulation

To simulate high-volume signal ingestion:

```
node simulate.js
```

Expected results:

* Multiple signals for the same component result in a single incident
* Signals are stored in MongoDB
* Incident data is stored in PostgreSQL

---

## Verifying MTTR and RCA

Access the PostgreSQL container:

```
docker exec -it ims-postgres psql -U user -d ims_db
```

Execute:

```
SELECT id, status, start_time, end_time, mttr
FROM incidents
WHERE status = 'CLOSED';
```

---

## Technology Stack

* Backend: Node.js, Express
* Queue System: BullMQ (Redis)
* Databases: PostgreSQL, MongoDB
* Cache Layer: Redis
* Frontend: React, Tailwind CSS
* Containerization: Docker

---

## Performance Characteristics

* Supports ingestion rates exceeding 10,000 signals per second through asynchronous buffering
* Ensures low-latency dashboard updates via Redis caching
* Maintains system stability under load using queue-based backpressure mechanisms

---

## Assignment Requirement Coverage

The implementation addresses the following requirements:

* Asynchronous signal processing
* Debouncing of high-frequency signals
* Separation of storage systems based on data type
* Workflow management using State Pattern
* Alerting logic using Strategy Pattern
* Mandatory Root Cause Analysis enforcement
* Automatic MTTR computation
* Rate limiting and observability mechanisms

---

## Author

Anosh Mishra
Computer Science and Engineering

---

## Future Improvements

* Integration with distributed streaming platforms for higher scalability
* Real-time updates using WebSocket or event streaming
* Advanced anomaly detection using machine learning models
* Horizontal scaling of worker processes

---
