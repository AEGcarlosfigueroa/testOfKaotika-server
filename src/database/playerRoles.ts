export const playerRole = {

    // "classcraft.daw2@aeg.eus" : "ISTVAN",
    "ignacio.ayaso@ikasle.aeg.eus" : "ISTVAN",
    "oskar.calvo@aeg.eus" : "MORTIMER",
    "carlos.palacio@ikasle.aeg.eus" : "VILLANO",
    

}

export const roles = {
    // istvan: "classcraft.daw2@aeg.eus",
    // villano: "ozarate@aeg.eus",
    villano: "carlos.palacio@ikasle.aeg.eus",
    mortimer: "oskar.calvo@aeg.eus",
    istvan: "ignacio.ayaso@ikasle.aeg.eus"
}
const DEFAULT = "ACOLITO" //this is for students 
export function getRoleByEmail(playerEmail: string) {
  if (playerEmail === roles.istvan) return 'ISTVAN';

  if (playerEmail === roles.mortimer) return 'MORTIMER';

  if (playerEmail === roles.villano) return 'VILLANO';

  return DEFAULT;
}

