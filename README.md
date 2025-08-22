# DoktorAI Integration

## 🔗 AI-Powered Medical Assistant Integration Layer

DoktorAI Integration, yapay zeka destekli tıbbi asistan sisteminin entegrasyon katmanıdır. Bu proje, backend AI servisleri ile mobil uygulama arasındaki iletişimi sağlar ve sistem entegrasyonunu yönetir.

## 🚀 Özellikler

- **API Gateway**: Merkezi API yönetimi
- **Authentication**: Güvenli kimlik doğrulama
- **Rate Limiting**: API kullanım sınırlaması
- **Load Balancing**: Yük dengeleme
- **Monitoring**: Sistem izleme ve loglama
- **Caching**: Performans optimizasyonu
- **Error Handling**: Hata yönetimi
- **Documentation**: API dokümantasyonu

## 🛠️ Teknolojiler

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **Redis**: Cache ve session yönetimi
- **JWT**: Token tabanlı authentication
- **Swagger**: API dokümantasyonu
- **Docker**: Containerization
- **Kubernetes**: Orchestration
- **Prometheus**: Monitoring
- **Grafana**: Visualization

## 📦 Kurulum

```bash
# Repository'yi klonlayın
git clone https://github.com/ersoz12/DoktorAI-Integration.git
cd DoktorAI-Integration

# Bağımlılıkları yükleyin
npm install

# Environment dosyasını oluşturun
cp .env.example .env

# Uygulamayı başlatın
npm start
```

## 🔧 Konfigürasyon

1. `.env` dosyasını düzenleyin:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
REDIS_URL=redis://localhost:6379
MONGODB_URI=mongodb://localhost:27017/doktorai

# Authentication
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h

# API Configuration
BACKEND_URL=http://localhost:8000
MOBILE_API_URL=http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100

# Monitoring
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001
```

2. Docker ile çalıştırın:
```bash
# Docker Compose ile tüm servisleri başlatın
docker-compose up -d

# Sadece integration servisini başlatın
docker run -p 3000:3000 doktorai-integration
```

## 🚀 Çalıştırma

```bash
# Development modu
npm run dev

# Production modu
npm start

# Test modu
npm test

# Docker ile
docker-compose up
```

## 📊 Mimari

```
src/
├── config/           # Konfigürasyon dosyaları
├── middleware/       # Express middleware'leri
├── routes/          # API route'ları
├── services/        # İş mantığı servisleri
├── utils/           # Yardımcı fonksiyonlar
├── models/          # Veri modelleri
├── controllers/     # Route controller'ları
└── docs/            # API dokümantasyonu
```

## 🔐 Güvenlik

- **JWT Authentication**: Token tabanlı kimlik doğrulama
- **Rate Limiting**: API kullanım sınırlaması
- **CORS**: Cross-origin resource sharing
- **Helmet**: Güvenlik header'ları
- **Input Validation**: Girdi doğrulama
- **SQL Injection Protection**: SQL enjeksiyon koruması

## 📈 Monitoring

### Prometheus Metrics
- Request count
- Response time
- Error rate
- Active connections
- Memory usage

### Grafana Dashboards
- Real-time monitoring
- Performance metrics
- Error tracking
- User analytics

## 🧪 Test

```bash
# Unit testler
npm run test:unit

# Integration testler
npm run test:integration

# E2E testler
npm run test:e2e

# Coverage raporu
npm run test:coverage
```

## 📚 API Dokümantasyonu

### Authentication
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "password123"
}
```

### Health Check
```http
GET /api/health
Authorization: Bearer <token>
```

### Rate Limiting
- **Free Tier**: 100 requests/hour
- **Premium Tier**: 1000 requests/hour
- **Enterprise**: Unlimited

## 🔄 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy Integration Layer

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: docker build -t doktorai-integration .
      - run: docker push doktorai-integration
```

## 📊 Performans

- **Response Time**: < 100ms
- **Throughput**: 1000+ requests/second
- **Uptime**: 99.9%
- **Error Rate**: < 0.1%

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📞 İletişim

- **Geliştirici**: Ersoz
- **Email**: ersoz@example.com
- **GitHub**: [@ersoz12](https://github.com/ersoz12)

## 🙏 Teşekkürler

- Node.js ekibine
- Express.js ekibine
- Redis ekibine
- Açık kaynak topluluğuna katkıları için

## 🔄 Güncellemeler

### v1.0.0 (2024-01-15)
- İlk sürüm
- Temel API gateway
- Authentication sistemi
- Rate limiting

### v1.1.0 (2024-02-01)
- Monitoring entegrasyonu
- Caching sistemi
- Error handling iyileştirmeleri

### v1.2.0 (2024-03-01)
- Load balancing
- Advanced security
- Performance optimizations 