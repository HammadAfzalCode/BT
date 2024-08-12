module.exports = {
    apps: [{
        name: 'brake_time',
        script: './server.js',
        instance: 1,
        interpreter: 'node@20.11.0',
        exec_mode: 'fork',
        env_debug: {
            NODE_ENV: 'debug'
        },
        env_development: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }]
};

