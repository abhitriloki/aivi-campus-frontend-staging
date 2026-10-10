import paramiko

VPS_HOST = "187.127.134.92"
VPS_USER = "root"
VPS_PASS = "AbhiDev@222020"

def main():
    print(f"Connecting to {VPS_HOST}...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, port=22, username=VPS_USER, password=VPS_PASS, timeout=30)
    print("Connected to VPS!")

    staging_conf = """server {
    server_name staging.aivilabs.com campus.aivilabs.com campus.staging.aivilabs.com;
    root /var/www/staging-aivi-campus/html;
    index index.html;

    location / {
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
        try_files $uri $uri/ /index.html;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/staging.aivilabs.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/staging.aivilabs.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    listen 80;
    server_name staging.aivilabs.com campus.aivilabs.com campus.staging.aivilabs.com;
    return 301 https://$host$request_uri;
}
"""

    prod_conf = """server {
    listen 80;
    listen [::]:80;
    server_name aivilabs.com www.aivilabs.com campus.aivilabs.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name aivilabs.com www.aivilabs.com campus.aivilabs.com;
    ssl_certificate /etc/letsencrypt/live/aivilabs.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aivilabs.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /var/www/aivi-campus/html;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=63072000" always;

    location / {
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
        try_files $uri $uri/ /index.html;
    }

    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
"""

    sftp = ssh.open_sftp()
    print("Writing /etc/nginx/sites-available/staging-aivi-campus...")
    with sftp.open("/etc/nginx/sites-available/staging-aivi-campus", "w") as f:
        f.write(staging_conf)

    print("Writing /etc/nginx/sites-available/aivi-campus...")
    with sftp.open("/etc/nginx/sites-available/aivi-campus", "w") as f:
        f.write(prod_conf)

    sftp.close()

    print("Testing Nginx config and reloading...")
    stdin, stdout, stderr = ssh.exec_command("nginx -t && systemctl reload nginx")
    out = stdout.read().decode()
    err = stderr.read().decode()
    print("STDOUT:", out)
    print("STDERR:", err)

    ssh.close()
    print("VPS Nginx configuration complete!")

if __name__ == "__main__":
    main()
