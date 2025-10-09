export const playerRole = {

    "classcraft.daw2@aeg.eus" : "ISTVAN",
    "ozarate@aeg.eus" : "VILLANO",
    "oskar.calvo@aeg.eus" : "MORTIMER"

}

export const roles = {
    istvan: "classcraft.daw2@aeg.eus",
    villano: "ozarate@aeg.eus",
    mortimer: "oskar.calvo@aeg.eus"
}
const DEFAULT = "ACOLITO" //this is for students 
export function getRoleByEmail(playerEmail: string)
{
    const role = playerRole[playerEmail] || DEFAULT;
    return role;
}
