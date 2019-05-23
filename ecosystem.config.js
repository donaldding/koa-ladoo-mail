module.exports = {
    apps: [{
      name: "app",
      script: "index.js",
      node_args: 'node -r dotenv/config index.js'
    }],
    deploy: {
      // "production" is the environment name
      production: {
        user: "root",
        // SSH host
        host: ["47.112.137.116"],
        // SSH options with no command-line flag, see 'man ssh' 
        // can be either a single string or an array of strings
        ssh_options: "StrictHostKeyChecking=no",
        // GIT remote/branch
        ref: "origin/master",
        // GIT remote
        repo: "git@github.com:donaldding/koa-ladoo-mail.git",
        // path in the server
        path: "/var/www/koa-mail-serivce",
        "post-deploy" : "npm install && pm2 startOrRestart ecosystem.config.js --env production"    // 部署后执行的命令，本案例：先安装依赖再启动

      }
    }
  }