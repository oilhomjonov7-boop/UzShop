const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const PORT = 5001;

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom mock auth endpoint
server.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = router.db; // Lowdb instance
  const user = db.get('users').find({ email }).value();

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Email yoki parol noto'g'ri kiritildi" });
  }

  // Generate mock JWT token
  const token = `mock-jwt-token-${user.id}-${Date.now()}`;
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    user: userWithoutPassword,
    token
  });
});

server.post('/auth/register', (req, res) => {
  const { name, email, password, phone } = req.body;
  const db = router.db;

  const existing = db.get('users').find({ email }).value();
  if (existing) {
    return res.status(400).json({ message: "Ushbu email allaqachon ro'yxatdan o'tgan" });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password: password || 'password123',
    role: 'User',
    phone: phone || '+998900000000'
  };

  db.get('users').push(newUser).write();
  const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
  const { password: _, ...userWithoutPassword } = newUser;

  res.status(201).json({
    user: userWithoutPassword,
    token
  });
});

server.use(router);

server.listen(PORT, () => {
  console.log(`UzShop Mock Server is running on http://localhost:${PORT}`);
});
