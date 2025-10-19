export const playerRole = {

    // "classcraft.daw2@aeg.eus" : "ISTVAN",
    // "oskar.calvo@aeg.eus" : "MORTIMER",
    "carlos.figueroa@ikasle.aeg.eus" : "ISTVAN",
    "ozarate@aeg.eus" : "VILLANO",
    "carlos.palacio@ikasle.aeg.eus" : "MORTIMER",

}

export const roles = {
    istvan: "carlos.figueroa@ikasle.aeg.eus",
    villano: "ozarate@aeg.eus",
    mortimer: "carlos.palacio@ikasle.aeg.eus",
}
const DEFAULT = "ACOLITO" //this is for students 
export function getRoleByEmail(playerEmail: string) {
  if (playerEmail === roles.istvan) 
    {
      return 'ISTVAN';
    }
  else if (playerEmail === roles.mortimer){
    return 'MORTIMER';
  } 
  else if (playerEmail === roles.villano) 
    {
      return 'VILLANO';
    }
  else {
    return 'ACOLITO'; // default for students
}
}

