$body = '{"email":"admin@faculty.com","password":"Admin@123"}'
$response = Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/login' -Method POST -ContentType 'application/json' -Body $body
Write-Host "Status:" $response.StatusCode
Write-Host "Content:" $response.Content