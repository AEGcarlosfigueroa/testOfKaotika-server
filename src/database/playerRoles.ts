export const playerRole = {

    // "classcraft.daw2@aeg.eus" : "ISTVAN",
    // "oskar.calvo@aeg.eus" : "MORTIMER",
    "carlos.figueroa@ikasle.aeg.eus" : "ISTVAN",
    "ozarate@aeg.eus" : "VILLANO",
    "ignacio.ayaso@ikasle.aeg.eus" : "MORTIMER",
    // "carlos.palacio@ikasle.aeg.eus" : "ACOLITO"

}

export const roles = {
    istvan: "carlos.figueroa@ikasle.aeg.eus",
    villano: "ozarate@aeg.eus",
    mortimer: "ignacio.ayaso@ikasle.aeg.eus",
    // acolito: "carlos.palacio@ikasle.aeg.eus"
}
const DEFAULT = "ACOLITO" //this is for students 
export function getRoleByEmail(playerEmail: String) {
  if(playerEmail === roles.istvan)
  {
    return 'ISTVAN';
  }
  else if(playerEmail === roles.mortimer)
  {
    return 'MORTIMER';
  }
  else{
    return 'ACOLITO';

  }

}


