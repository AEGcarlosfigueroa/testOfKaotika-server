export const playerRole = {

    "carlos.figueroa@ikasle.aeg.eus" : "ISTVAN",
    "oskar.calvo@aeg.eus" : "MORTIMER",
    "ozarate@aeg.eus" : "VILLANO",

}

export const roles = {
    // istvan: "classcraft.daw2@aeg.eus",
    istvan: "carlos.figueroa@ikasle.aeg.eus",
    villano: "ozarate@aeg.eus",
    mortimer: "oskar.calvo@aeg.eus",
}
const DEFAULT = "ACOLITO" //this is for students 
export function getRoleByEmail(playerEmail: string) {
  if (playerEmail === roles.istvan) return 'ISTVAN';


  if (playerEmail === roles.mortimer) return 'MORTIMER';


  if (playerEmail === roles.villano) return 'VILLANO';


  return DEFAULT;
}

