module.exports = {
    apps: [
        {
            name: "TronService",
            script: "npm",
            automation: false,
            args: "run start:dev",
            env: {
                NODE_ENV: "development"
            },
            env_production: {
                NODE_ENV: "production"
            }
        }
    ]
}