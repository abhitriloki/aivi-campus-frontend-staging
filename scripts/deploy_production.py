"""
One-shot SFTP deploy script — uploads entire dist/ to Production VPS via password auth.
Run: python scripts/deploy_production.py
"""
import paramiko
import os
import sys

VPS_HOST = "187.127.134.92"
VPS_PORT = 22
VPS_USER = "root"
VPS_PASS = os.environ.get("AIVI_VPS_PASSWORD", "")
SSH_KEY_CANDIDATES = [
    os.path.expanduser("~/.ssh/aivi_digitalocean_ed25519"),
    os.path.expanduser("~/.ssh/id_ed25519_aivi"),
]
LOCAL_DIST = os.path.join(os.path.dirname(__file__), "..", "dist")
REMOTE_ROOT = "/var/www/aivi-campus/html"

def ensure_remote_dir(sftp, remote_dir):
    dirs = remote_dir.split('/')
    path = ""
    for d in dirs:
        if not d:
            continue
        path += "/" + d
        try:
            sftp.stat(path)
        except IOError:
            try:
                sftp.mkdir(path)
            except Exception:
                pass

def sftp_put_dir(sftp, local_dir, remote_dir):
    ensure_remote_dir(sftp, remote_dir)
    for item in os.listdir(local_dir):
        local_path = os.path.join(local_dir, item)
        remote_path = remote_dir + "/" + item
        if os.path.isdir(local_path):
            sftp_put_dir(sftp, local_path, remote_path)
        else:
            sftp.put(local_path, remote_path)
            print(f"  uploaded: {item}")

def main():
    print(f"Connecting to Production VPS {VPS_HOST}...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    connected = False
    for key_path in SSH_KEY_CANDIDATES:
        if os.path.exists(key_path):
            try:
                print(f"Attempting SSH key: {key_path}")
                ssh.connect(VPS_HOST, port=VPS_PORT, username=VPS_USER, key_filename=key_path, timeout=30)
                connected = True
                print(f"Connected using SSH key: {key_path}")
                break
            except Exception as e:
                print(f"Key {key_path} skipped: {e}")
                
    if not connected and VPS_PASS:
        print("Using password authentication from AIVI_VPS_PASSWORD...")
        ssh.connect(VPS_HOST, port=VPS_PORT, username=VPS_USER, password=VPS_PASS, timeout=30)
        connected = True

    if not connected:
        raise ValueError("No authentication method succeeded. Either configure ~/.ssh keys or set AIVI_VPS_PASSWORD environment variable.")
    print("Connected to Production VPS!")

    sftp = ssh.open_sftp()
    print(f"Uploading dist/ -> {REMOTE_ROOT} ...")
    sftp_put_dir(sftp, os.path.abspath(LOCAL_DIST), REMOTE_ROOT)
    sftp.close()

    print("Reloading Nginx on Production VPS...")
    stdin, stdout, stderr = ssh.exec_command("systemctl reload nginx")
    stdout.channel.recv_exit_status()
    print("Nginx reloaded successfully!")

    ssh.close()
    print("\nPRODUCTION DEPLOYMENT COMPLETE! Live at https://aivilabs.com and https://campus.aivilabs.com")

if __name__ == "__main__":
    main()
