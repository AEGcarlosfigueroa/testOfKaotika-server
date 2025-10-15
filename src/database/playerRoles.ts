export const playerRole = {

    // "classcraft.daw2@aeg.eus" : "ISTVAN",
    "carlos.palacio@ikasle.aeg.eus" : "ISTVAN",
    "ozarate@aeg.eus" : "VILLANO",
    "oskar.calvo@aeg.eus" : "MORTIMER"

}

export const roles = {
    istvan: "carlos.palacio@ikasle.aeg.eus",
    villano: "ozarate@aeg.eus",
    mortimer: "oskar.calvo@aeg.eus"
}
const DEFAULT = "ACOLITO" //this is for students 
export function getRoleByEmail(playerEmail: String) {
  console.log("email" + playerEmail);
  console.log("role:" + roles.istvan);
  if(playerEmail === roles.istvan)
  {
    return 'ISTVAN';
  }

  return 'ACOLITO';
}

