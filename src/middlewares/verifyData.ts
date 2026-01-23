import * as authentication from '../firebase.ts'

export async function verifyFirebaseToken(req: any, res: any, next: Function) 
{
  const authHeader = req.headers.authorization;

  console.log("enter verifyFirebaseToken");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try 
  {
    const decodedToken = await authentication.authentication.verifyIdToken(idToken);

    req.user = decodedToken;

    if (!decodedToken.email_verified) {
      return res.status(403).json({ error: "Email not verified" });
    }

    next(); 
  } 
  catch (error) 
  {
    console.log(error);

    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}


