const jwt = require('jsonwebtoken');
const User = require('../schema/userSchema');

module.exports = async function(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token ausente' });
        }

        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.id);
        if (!user) 
          return res.status(401).json({ message: 'Usuário inválido' })
        ;

        if (!user.verified) 
          return res.status(403).json({ message: 'Conta não verificada' });

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
};