$keyPath = "C:\Users\abhis\.ssh\aivi_digitalocean_ed25519"
$vpsHost = "root@187.127.134.92"

Write-Host "Creating web root on VPS..."
ssh -i $keyPath -o StrictHostKeyChecking=no $vpsHost "mkdir -p /var/www/staging-aivi-campus/html"

Write-Host "Uploading dist assets to STAGING ONLY (/var/www/staging-aivi-campus/html)..."
scp -i $keyPath -o StrictHostKeyChecking=no -r c:\Users\abhis\OneDrive\Documents\GitHub\aivi-career\dist\* "${vpsHost}:/var/www/staging-aivi-campus/html/"

Write-Host "Setting permissions and reloading Nginx..."
ssh -i $keyPath -o StrictHostKeyChecking=no $vpsHost "chmod -R 755 /var/www/staging-aivi-campus && chown -R www-data:www-data /var/www/staging-aivi-campus && systemctl reload nginx"

Write-Host "VPS STAGING Deployment completed!"
