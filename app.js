const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const redis = require('redis');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { promisify } = require('util');

const app = express();
const PORT = process.env.PORT || 3000;

// Redis client setup
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

// Promisify Redis commands
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:8000'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'DoktorAI Integration API',
            version: '1.0.0',
            description: 'Integration layer for DoktorAI Mobile and Backend services',
            contact: {
                name: 'DoktorAI Team',
                email: 'support@doktorai.com'
            }
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./routes/*.js', './app.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Authentication middleware
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

// Cache middleware
const cacheMiddleware = (duration = 300) => {
    return async (req, res, next) => {
        const key = `cache:${req.originalUrl}`;
        
        try {
            const cachedData = await getAsync(key);
            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            }
            
            res.originalJson = res.json;
            res.json = async (data) => {
                await setAsync(key, JSON.stringify(data), 'EX', duration);
                res.originalJson(data);
            };
            
            next();
        } catch (error) {
            console.error('Cache error:', error);
            next();
        }
    };
};

// Health check endpoint
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the integration service
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 services:
 *                   type: object
 *                   properties:
 *                     redis:
 *                       type: string
 *                       example: "connected"
 *                     backend:
 *                       type: string
 *                       example: "reachable"
 */
app.get('/health', async (req, res) => {
    try {
        const healthStatus = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
                redis: redisClient.connected ? 'connected' : 'disconnected',
                backend: 'reachable' // You can add actual backend health check here
            }
        };
        
        res.json(healthStatus);
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            error: error.message
        });
    }
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', authenticateToken, require('./routes/users'));
app.use('/api/predictions', authenticateToken, require('./routes/predictions'));
app.use('/api/analytics', authenticateToken, cacheMiddleware(600), require('./routes/analytics'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: `The requested endpoint ${req.originalUrl} does not exist`
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    redisClient.quit();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    redisClient.quit();
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 DoktorAI Integration Server running on port ${PORT}`);
    console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
    console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
});

module.exports = app; 