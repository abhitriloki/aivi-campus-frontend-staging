import paramiko

VPS_HOST = "187.127.134.92"
VPS_USER = "root"
VPS_PASS = "AbhiDev@222020"

def main():
    print(f"Connecting to VPS {VPS_HOST} to issue Let's Encrypt SSL certificates...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, port=22, username=VPS_USER, password=VPS_PASS, timeout=60)
    print("Connected!")

    # 1. Issue SSL for campus.aivilabs.com
    cmd1 = "certbot --nginx -d campus.aivilabs.com --non-interactive --agree-tos --email hello@aivilabs.com --redirect"
    print(f"Executing: {cmd1}")
    stdin, stdout, stderr = ssh.exec_command(cmd1)
    out1 = stdout.read().decode()
    err1 = stderr.read().decode()
    print("OUT:", out1)
    print("ERR:", err1)

    # 2. Issue SSL for campus.staging.aivilabs.com
    cmd2 = "certbot --nginx -d campus.staging.aivilabs.com --non-interactive --agree-tos --email hello@aivilabs.com --redirect"
    print(f"Executing: {cmd2}")
    stdin, stdout, stderr = ssh.exec_command(cmd2)
    out2 = stdout.read().decode()
    err2 = stderr.read().decode()
    print("OUT:", out2)
    print("ERR:", err2)

    # 3. Reload Nginx
    stdin, stdout, stderr = ssh.exec_command("nginx -t && systemctl reload nginx")
    print("Reload STDOUT:", stdout.read().decode())
    print("Reload STDERR:", stderr.read().decode())

    ssh.close()
    print("\nSSL Certificate Generation & Nginx binding complete!")

if __name__ == "__main__":
    main()
