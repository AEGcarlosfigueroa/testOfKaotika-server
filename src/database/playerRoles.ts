export const playerRole = {

    "classcraft.daw2@aeg.eus" : "ISTVAN",
    // "eneko.azkue@ikasle.aeg.eus" : "MORTIMER",
    "oskar.calvo@aeg.eus" : "MORTIMER",
    "ozarate@aeg.eus" : "VILLANO",
    

}

export const roles = {
    istvan: "classcraft.daw2@aeg.eus",
    villano: "ozarate@aeg.eus",
    // villano: "carlos.palacio@ikasle.aeg.eus",
    mortimer: "oskar.calvo@aeg.eus",
    // mortimer: "eneko.azkue@ikasle.aeg.eus"
}
const DEFAULT = "ACOLITO" //this is for students 
export function getRoleByEmail(playerEmail: string) {
  if (playerEmail === roles.istvan) {
    return 'ISTVAN';
  }
  else if (playerEmail === roles.mortimer) {
    return 'MORTIMER';
  }
  else if (playerEmail === roles.villano) {
    return 'VILLANO';
  }
  else {
    return 'ACOLITO'; // default for students
  }
}

