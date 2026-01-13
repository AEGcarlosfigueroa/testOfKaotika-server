import { deadlyEffects } from "../globalVariables";

export async function RevertStatusEffects(player: any, disease: string) {

    if (disease === deadlyEffects.ethaziumCurse) return; // do nothing for the curse

    // Also make sure this disease exists on the player
    if (!player.statusEffects.includes(disease)) return;

    player.statusEffects = player.statusEffects.filter(d => d !== disease);

    restorationCalculation(player, disease)

    await player.save();

}

function restorationCalculation(player: any, disease: string) {
    // Revert attribute effect of this disease
    if (disease === deadlyEffects.putridPlague) {
        player.attributes.intelligence /= 0.25;
    } else if (disease === deadlyEffects.medulaApocalypse) {
        player.attributes.constitution /= 0.7;
    } else if (disease === deadlyEffects.epicWeakness) {
        player.attributes.strength /= 0.4;
    }

}