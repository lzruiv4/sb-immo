# sb-immo

# sb-immo-frontend

# sb-immo-backend

### Setup database

```bash
docker run -d \
--name dev-postgres-immo \
-e POSTGRES_USER=sa \
-e POSTGRES_PASSWORD=123 \
-e POSTGRES_DB=sb-immo \
-p 3031:5432 \
postgres:latest
```
