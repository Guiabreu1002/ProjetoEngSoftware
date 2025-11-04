const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/users', userController.createUser);
router.get('/users', userController.getUsers);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

router.post('/verify', async (req, res) => {
    try {
    const { email, password } = req.body;
    await require('../db/conection')();

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });
    if (user.verified === false) return res.status(403).json({ message: 'Conta não verificada' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Credenciais inválidas' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, email: user.email, username: user.username } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;