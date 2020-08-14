async function checkCreateFields(req, res, next) {
  const { displayName, email, password, image } = req.body;

  const validName = displayName && typeof displayName === 'string' && displayName.length > 7;
  const validEmail = email && typeof email === 'string' && /\S+@\S+/.test(email);
  const validPassword = password && password.toString().length === 6;
  const validImage = image && typeof image === 'string';

  if (!validName || !validEmail || !validPassword || !validImage) {
    return res.status(400).json({
      message: 'dados inválidos: Preencha todos os campos / seu nome deve conter ao menos 8 caracteres / sua senha deve ter 6 caracteres',
    });
  }

  next();
}

module.exports = {
  checkCreateFields,
};
