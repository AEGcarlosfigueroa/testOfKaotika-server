const { initializeApp } = require('firebase-admin/app');

const app = initializeApp();

async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);

    req.user = decodedToken;

    if (!decodedToken.email_verified) {
      return res.status(403).json({ error: "Email not verified" });
    }

    next(); // ✅ token is valid, continue
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}
