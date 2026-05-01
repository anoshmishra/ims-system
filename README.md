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

| Storage System | Purpose                                                        |
| -------------- | -------------------------------------------------------------- |
| PostgreSQL     | Transactional storage for incidents, lifecycle states, and RCA |
| MongoDB        | High-volume storage for raw signal payloads                    |
| Redis          | In-memory cache for real-time dashboard data                   |

---

### Workflow Engine

The incident lifecycle is governed using formal design patterns:

* State Pattern:

```
OPEN → INVESTIGATING → RESOLVED → CLOSED
```

* Strategy Pattern: Determines alert severity and handling logic based on component type.

---

### Mandatory Root Cause Analysis (RCA)

An incident cannot transition to the CLOSED state without a valid RCA. This constraint is enforced at the service layer.

---

### Mean Time To Repair (MTTR)

MTTR is automatically calculated as:

```
MTTR = end_time - start_time
```

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

```
docker-compose up --build
```

---

## API Endpoints

### Signal Ingestion

```
POST /signal
```

### Incident Management

```
GET    /incidents
GET    /incident/:id
PATCH  /incident/:id/status
POST   /incident/:id/rca
```

---

## Synthetic Telemetry Generation (Testing the System)

The following command can be used to simulate real-world signal ingestion and validate system behavior:

```
curl -X POST http://localhost:5000/api/signals \
-H "Content-Type: application/json" \
-d '{
  "source": "network-gateway-04",
  "title": "Unusual Data Exfiltration",
  "description": "Outbound traffic spike detected on port 443 to an unknown external IP.",
  "severity": "CRITICAL"
}'
```

### What This Validates

#### 1. Signal Ingestion and Orchestration

* Sends a real telemetry signal to the backend system
* Triggers asynchronous processing via the Redis queue
* Stores raw signal data in MongoDB (audit log)
* Creates or updates an incident in PostgreSQL

---

#### 2. Incident Creation and Classification

* Validates severity mapping (e.g., CRITICAL classification)
* Ensures correct incident creation through debouncing logic
* Confirms linkage between signals and incidents

---

#### 3. Workflow Initialization and MTTR Tracking

* Establishes the initial timestamp (`start_time`)
* Enables full lifecycle testing from OPEN to CLOSED
* Forms the basis for MTTR calculation

---

#### 4. Stress and Performance Testing

* This command can be executed repeatedly or in parallel
* Allows validation of:

  * Queue throughput
  * Worker scalability
  * System stability under high load conditions

---

## Observability

### Health Endpoint

```
GET /health
```

### Metrics

* Signals processed per second
* Worker throughput

---

## Verifying MTTR and RCA

```
docker exec -it ims-postgres psql -U user -d ims_db
```

```
SELECT id, status, start_time, end_time, mttr
FROM incidents
WHERE status = 'CLOSED';
```

---

## Technology Stack

* Backend: Node.js, Express
* Queue: BullMQ (Redis)
* Databases: PostgreSQL, MongoDB
* Cache: Redis
* Frontend: React, Tailwind
* Containerization: Docker

---

## Performance Characteristics

* Handles high-throughput ingestion using async queue architecture
* Ensures low-latency responses via Redis caching
* Maintains system stability using backpressure mechanisms

---

## Assignment Requirement Coverage

* Asynchronous processing
* Debouncing logic
* Multi-database architecture
* Workflow engine (State Pattern)
* Alert strategy
* Mandatory RCA enforcement
* MTTR calculation
* Observability and rate limiting

---

## Author

Anosh Mishra
Computer Science and Engineering

---

## Future Improvements

* Distributed streaming integration (Kafka)
* Real-time updates via WebSockets
* Horizontal worker scaling
* Advanced anomaly detection

---
