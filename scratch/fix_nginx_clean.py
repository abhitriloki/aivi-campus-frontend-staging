import paramiko

VPS_HOST = "187.127.134.92"
VPS_USER = "root"
VPS_PASS = "AbhiDev@222020"

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, port=22, username=VPS_USER, password=VPS_PASS, timeout=30)

    staging_conf = """server {
    server_name staging.aivilabs.com campus.staging.aivilabs.com;
    root /var/www/staging-aivi-campus/html;
    index index.html;

    location / {
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
        try_files $uri $uri/ /index.html;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/campus.staging.aivilabs.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/campus.staging.aivilabs.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    listen 80;
    server_name staging.aivilabs.com campus.staging.aivilabs.com;
    return 301 https://$host$request_uri;
}
"""

    sftp = ssh.open_sftp()
    with sftp.open("/etc/nginx/sites-available/staging-aivi-campus", "w") as f:
        f.write(staging_conf)
    sftp.close()

    stdin, stdout, stderr = ssh.exec_command("nginx -t && systemctl reload nginx")
    out = stdout.read().decode()
    err = stderr.read().decode()
    print("STDOUT:", out)
    print("STDERR:", err)

    ssh.close()
    print("Nginx reload complete!")

if __name__ == "__main__":
    main()
