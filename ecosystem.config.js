module.exports = {
    apps: [
        {
            name: "boilerplate-nodejs",
            script: "dist/server.js",
            // Mode production
            exec_mode: "fork",
            instances: 1,

            // Restart policy
            autorestart: true,
            watch: false,
            max_memory_restart: "500M",

            // Env
            env: {
                NODE_ENV: "development",
                PORT: 3000
            },

            env_production: {
                NODE_ENV: "production",
                PORT: 3001
            },

            // Logs (PM2 level)
            out_file: "logs/pm2-out.log",
            error_file: "logs/pm2-error.log",
            log_date_format: "YYYY-MM-DD HH:mm:ss"
        }
    ]
};
