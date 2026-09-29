# Bel Cerdas Cermat - Docker

## Jalankan
```bash
docker compose up -d --build
```

## Cek
```bash
docker compose ps
docker compose logs -f
```

Peserta: `http://IP-SERVER:3000/`
Juri: `http://IP-SERVER:3000/judge.html`

## Stop
```bash
docker compose down
```

## Update
```bash
docker compose up -d --build
```

Jika memakai UFW:
```bash
sudo ufw allow 3000/tcp
```
