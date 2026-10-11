Task 8: Login as a registered user

Command:
```powershell
$body = @{ username = "meenal"; password = "test123" } | ConvertTo-Json -Compress; Invoke-RestMethod -Uri "http://localhost:5000/customer/login" -Method Post -ContentType "application/json" -Body $body
```

Output:
```text
message          username token
-------          -------- -----
Login successful meenal   session-meenal
```