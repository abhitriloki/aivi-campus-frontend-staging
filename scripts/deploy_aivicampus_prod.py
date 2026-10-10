"""
One-shot SFTP deploy script — uploads entire dist/ to aivicampus.com Production VPS with atomic release symlink.
Run: python scripts/deploy_aivicampus_prod.py
"""
import paramiko
import os
import sys

VPS_HOST = "187.127.134.92"
VPS_PORT = 22
VPS_USER = "root"
VPS_PASS = os.environ.get("AIVI_VPS_PASSWORD", "")
SSH_KEY_CANDIDATES = [
    os.path.expanduser("~/.ssh/aivi_hostinger_ed25519"),
    os.path.expanduser("~/.ssh/aivi_digitalocean_ed25519"),
    os.path.expanduser("~/.ssh/id_ed25519_aivi"),
]
LOCAL_DIST = os.path.join(os.path.dirname(__file__), "..", "dist")
RELEASE_TAG = "20260929_seo_prod"
REMOTE_RELEASE_DIR = f"/var/www/aivicampus-prod/releases/{RELEASE_TAG}/html"
CURRENT_SYMLINK = "/var/www/aivicampus-prod/current"

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
        "<title>AIVI Campus — AI Employability OS for Colleges, Universities & TPO Cells</title>"
    )
    html = html.replace(
        'content="AIVI (AIVI Intelligence Private Limited) is India\'s premier AI-powered career intelligence platform. Optimize your resume, job fit, skill gaps, and vernacular voice interview readiness."',
        'content="India\'s premier AI-powered Employability Operating System for higher education institutions. Vernacular voice AI mock interviews in Hindi & English, live AES scores, QR-verified resume vaults, and 1-click NAAC/NIRF Criterion 5 evidence generation."'
    )
    html = html.replace('content="https://aivilabs.com/"', 'content="https://aivicampus.com/"')
    html = html.replace('href="https://aivilabs.com/"', 'href="https://aivicampus.com/"')
    html = html.replace(
        'content="AIVI Career OS — AI Career Intelligence for Bharat"',
        'content="AIVI Campus — AI Employability OS for Colleges, Universities & TPO Cells"'
    )
    html = html.replace('content="AIVI Intelligence"', 'content="AIVI Campus"')

    temp_campus_index = os.path.join(os.path.dirname(LOCAL_DIST), ".campus_index_prod.html")
    with open(temp_campus_index, "w", encoding="utf-8") as f:
        f.write(html)

    sftp.put(temp_campus_index, remote_root + "/index.html")
    try:
        os.remove(temp_campus_index)
    except Exception:
        pass
    print("  Uploaded customized AIVI Campus production index.html (Technical SEO / AIO / AEO ready)!")

def main():
    print(f"Connecting to Production VPS {VPS_HOST} for aivicampus.com...")
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
    print("Connected!")

    sftp = ssh.open_sftp()
    print(f"Uploading dist/ -> {REMOTE_RELEASE_DIR} ...")
    sftp_put_dir(sftp, os.path.abspath(LOCAL_DIST), REMOTE_RELEASE_DIR)
    upload_campus_index_html(sftp, REMOTE_RELEASE_DIR)
    
    # Also upload to legacy html fallback
    try:
        print("Mirroring to /var/www/aivicampus-prod/html ...")
        sftp_put_dir(sftp, os.path.abspath(LOCAL_DIST), "/var/www/aivicampus-prod/html")
        upload_campus_index_html(sftp, "/var/www/aivicampus-prod/html")
    except Exception as e:
        print(f"Mirror error: {e}")
    
    sftp.close()

    print("Setting permissions and activating atomic release symlink...")
    cmds = [
        f"chown -R www-data:www-data /var/www/aivicampus-prod/releases/{RELEASE_TAG}",
        f"ln -sfn {REMOTE_RELEASE_DIR} {CURRENT_SYMLINK}",
        "chown -h www-data:www-data /var/www/aivicampus-prod/current",
        "nginx -t && systemctl reload nginx",
    ]
    stdin, stdout, stderr = ssh.exec_command(" && ".join(cmds))
    exit_status = stdout.channel.recv_exit_status()
    out = stdout.read().decode()
    err = stderr.read().decode()
    print("Execution stdout:", out)
    print("Execution stderr:", err)

    if exit_status != 0:
        raise RuntimeError(f"Deployment commands failed with exit code {exit_status}: {err}")

    ssh.close()
    print("\nAIVICAMPUS PRODUCTION DEPLOYMENT COMPLETE! Live at https://aivicampus.com")

if __name__ == "__main__":
    main()
