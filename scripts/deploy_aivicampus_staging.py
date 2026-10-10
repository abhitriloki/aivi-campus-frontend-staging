"""
One-shot SFTP deploy script — uploads entire dist/ to aivicampus.com Staging VPS.
Run: python scripts/deploy_aivicampus_staging.py
"""
import paramiko
import os
import sys

VPS_HOSTS = ["187.127.134.92", "2a02:4780:63:881a::1"]
VPS_PORT = 22
VPS_USER = "root"
VPS_PASS = os.environ.get("AIVI_VPS_PASSWORD", "")
SSH_KEY_CANDIDATES = [
    os.path.expanduser("~/.ssh/aivi_hostinger_ed25519"),
    os.path.expanduser("~/.ssh/aivi_digitalocean_ed25519"),
    os.path.expanduser("~/.ssh/id_ed25519_aivi"),
]
LOCAL_DIST = os.path.join(os.path.dirname(__file__), "..", "dist")
REMOTE_ROOT = "/var/www/aivicampus-staging/html"

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

def upload_campus_index_html(sftp, remote_root):
    index_path = os.path.join(LOCAL_DIST, "index.html")
    if not os.path.exists(index_path):
        return
    with open(index_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Inject AIVI Campus specific SEO & AIO/AEO metadata
    html = html.replace(
        "<title>AIVI Labs | AI Career Intelligence Platform</title>",
        "<title>AIVI Campus — AI Employability OS for Colleges, Universities & T&P Cells</title>"
    )
    html = html.replace(
        'content="AIVI (AIVI Intelligence Private Limited) is India\'s premier AI-powered career intelligence platform. Optimize your resume, job fit, skill gaps, and vernacular voice interview readiness."',
        'content="India\'s premier AI-powered Employability Operating System for higher education institutions. Vernacular voice AI mock interviews in Hindi & English, live AES scores, QR-verified resume vaults, and 1-click NAAC/NIRF Criterion 5 evidence generation."'
    )
    html = html.replace(
        'content="https://aivilabs.com/"',
        'content="https://staging.aivicampus.com/"'
    )
    html = html.replace(
        'href="https://aivilabs.com/"',
        'href="https://staging.aivicampus.com/"'
    )
    html = html.replace(
        'content="AIVI Career OS — AI Career Intelligence for Bharat"',
        'content="AIVI Campus — AI Employability OS for Colleges, Universities & T&P Cells"'
    )
    html = html.replace(
        'content="AIVI Intelligence"',
        'content="AIVI Campus"'
    )

    temp_campus_index = os.path.join(os.path.dirname(LOCAL_DIST), ".campus_index_staging.html")
    with open(temp_campus_index, "w", encoding="utf-8") as f:
        f.write(html)

    sftp.put(temp_campus_index, remote_root + "/index.html")
    try:
        os.remove(temp_campus_index)
    except Exception:
        pass
    print("  Uploaded customized AIVI Campus staging index.html (Technical SEO / AIO / AEO ready)!")

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    connected = False
    active_host = None
    for host in VPS_HOSTS:
        print(f"Connecting to Staging VPS host {host} for staging.aivicampus.com...")
        for key_path in SSH_KEY_CANDIDATES:
            if os.path.exists(key_path):
                try:
                    print(f"Attempting SSH key on {host}: {key_path}")
                    ssh.connect(host, port=VPS_PORT, username=VPS_USER, key_filename=key_path, timeout=5)
                    connected = True
                    active_host = host
                    print(f"Connected to {host} using SSH key: {key_path}")
                    break
                except Exception as e:
                    print(f"Host {host} Key {key_path} skipped: {e}")
        if connected:
            break

    if not connected and VPS_PASS:
        for host in VPS_HOSTS:
            try:
                print(f"Using password authentication from AIVI_VPS_PASSWORD on {host}...")
                ssh.connect(host, port=VPS_PORT, username=VPS_USER, password=VPS_PASS, timeout=5)
                connected = True
                active_host = host
                break
            except Exception as e:
                print(f"Password auth on {host} failed: {e}")

    if not connected:
        raise ValueError("No authentication method succeeded. Either configure ~/.ssh keys or set AIVI_VPS_PASSWORD environment variable.")
    print(f"Connected successfully to {active_host}!")

    sftp = ssh.open_sftp()
    print(f"Uploading dist/ -> {REMOTE_ROOT} ...")
    sftp_put_dir(sftp, os.path.abspath(LOCAL_DIST), REMOTE_ROOT)
    upload_campus_index_html(sftp, REMOTE_ROOT)
    sftp.close()

    print("Reloading Nginx...")
    stdin, stdout, stderr = ssh.exec_command("systemctl reload nginx")
    stdout.channel.recv_exit_status()
    print("Nginx reloaded!")

    ssh.close()
    print("\nAIVICAMPUS STAGING DEPLOYMENT COMPLETE! Live at https://staging.aivicampus.com")

if __name__ == "__main__":
    main()
