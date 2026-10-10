import paramiko
import os

VPS_HOST = "187.127.134.92"
VPS_PORT = 22
VPS_USER = "root"
KEY_PATH = os.path.expanduser("~/.ssh/aivi_hostinger_ed25519")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(VPS_HOST, port=VPS_PORT, username=VPS_USER, key_filename=KEY_PATH, timeout=10)
sftp = ssh.open_sftp()

aivicampus_cfg = """# Host Canonicalization 301 Redirect (www -> apex)
server {
    listen 80;
    listen [::]:80;
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name www.aivicampus.com;

    ssl_certificate /etc/letsencrypt/live/aivicampus.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aivicampus.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://aivicampus.com$request_uri;
}

# Main Apex Production Server Block
server {
    server_name aivicampus.com *.aivicampus.com;

    root /var/www/aivicampus-prod/current;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    listen [::]:443 ssl;
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/aivicampus.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aivicampus.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    listen 80;
    listen [::]:80;
    server_name aivicampus.com *.aivicampus.com;
    return 301 https://$host$request_uri;
}
"""

isolation_cfg = """server {
    listen 80;
    listen [::]:80;
    server_name isolation-staging.aivicampus.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name isolation-staging.aivicampus.com;

    ssl_certificate /etc/letsencrypt/live/isolation-staging.aivicampus.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/isolation-staging.aivicampus.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /var/www/aivi-campus-isolation-staging/current;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    add_header X-Robots-Tag "noindex, nofollow" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-AIVI-Environment "isolation-staging" always;

    location / {
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
        add_header X-Robots-Tag "noindex, nofollow" always;
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
        add_header X-Robots-Tag "noindex, nofollow" always;
    }
}
"""

staging_cfg = """server {
    listen 80;
    listen [::]:80;
    server_name staging.aivicampus.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name staging.aivicampus.com;

    ssl_certificate /etc/letsencrypt/live/aivicampus.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aivicampus.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /var/www/aivicampus-staging/html;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    add_header X-Robots-Tag "noindex, nofollow" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-AIVI-Environment "staging" always;

    location / {
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
        add_header X-Robots-Tag "noindex, nofollow" always;
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
        add_header X-Robots-Tag "noindex, nofollow" always;
    }
}
"""

# Write nginx configs
with sftp.open("/etc/nginx/sites-available/aivicampus.com", "w") as f:
    f.write(aivicampus_cfg)

with sftp.open("/etc/nginx/sites-available/isolation-staging.aivicampus.com", "w") as f:
    f.write(isolation_cfg)

with sftp.open("/etc/nginx/sites-available/staging.aivicampus.com", "w") as f:
    f.write(staging_cfg)

print("Nginx configs written.")

# Disallow robots.txt for staging
disallow_robots = """User-agent: *
Disallow: /
"""

for p in ["/var/www/aivi-campus-isolation-staging/current/robots.txt", "/var/www/aivicampus-staging/html/robots.txt"]:
    try:
        with sftp.open(p, "w") as f:
            f.write(disallow_robots)
        print("Updated " + p)
    except Exception as e:
        print("Error on " + p + ":", e)

# Upload clean sitemap.xml to prod and staging
clean_sitemap = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://aivicampus.com/</loc><lastmod>2026-09-29</lastmod><priority>1.0</priority></url>
  <url><loc>https://aivicampus.com/for-colleges</loc><lastmod>2026-09-29</lastmod><priority>0.9</priority></url>
  <url><loc>https://aivicampus.com/features/voice-interviews</loc><lastmod>2026-09-29</lastmod><priority>0.8</priority></url>
  <url><loc>https://aivicampus.com/contact</loc><lastmod>2026-09-29</lastmod><priority>0.7</priority></url>
  <url><loc>https://aivicampus.com/dpa</loc><lastmod>2026-09-29</lastmod><priority>0.5</priority></url>
</urlset>
"""

for s in ["/var/www/aivicampus-prod/current/sitemap.xml", "/var/www/aivicampus-staging/html/sitemap.xml"]:
    try:
        with sftp.open(s, "w") as f:
            f.write(clean_sitemap)
        print("Updated " + s)
    except Exception as e:
        print("Error on " + s + ":", e)

# Test and reload nginx
stdin, stdout, stderr = ssh.exec_command("nginx -t && systemctl reload nginx")
out = stdout.read().decode()
err = stderr.read().decode()
print("Nginx test & reload stdout:", out)
print("Nginx test & reload stderr:", err)

sftp.close()
ssh.close()
