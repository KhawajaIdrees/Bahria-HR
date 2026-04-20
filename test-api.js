async function run() {
    const login = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@faculty.com', password: 'Admin@123' })
    });
    const loginData = await login.json();
    const token = loginData.token;
    
    // Fetch apps/1
    const appsRes = await fetch('http://localhost:5000/api/admin/applications/1', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log("App/1 status:", appsRes.status);
    console.log(await appsRes.text());
}
run();
