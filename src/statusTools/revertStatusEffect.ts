import { deadlyEffects } from "../globalVariables.ts";

export async function RevertDiseaseEffects(player: any, disease: string) {

    if (disease === deadlyEffects.ethaziumCurse) return; // do nothing for the curse

    // Also make sure this disease exists on the player
    if (!player.statusEffects.includes(disease)) return;

    player.statusEffects = player.statusEffects.filter(d => d !== disease);

    DRestorationCalculation(player, disease)

    await player.save();

}

export async function RevertCurse(player: any, curse: string) {

    if (curse !== deadlyEffects.ethaziumCurse) return;

    if (!player.statusEffects.includes(curse)) return;

    player.statusEffects = player.statusEffects.filter(c => c !== curse);

    CRestorationCalculation(player)

    await player.save();
}

function CRestorationCalculation(player: any) {
    // Restore stats
    player.attributes.strength /= 0.6;
    player.attributes.dexterity /= 0.6;
    player.attributes.intelligence /= 0.6;
    player.attributes.constitution /= 0.6;
}


function DRestorationCalculation(player: any, disease: string) {
    // Revert attribute effect of this malady
    if (disease === deadlyEffects.putridPlague) {
        player.attributes.intelligence /= 0.25;
    } else if (disease === deadlyEffects.medulaApocalypse) {
        player.attributes.constitution /= 0.7;
    } else if (disease === deadlyEffects.epicWeakness) {
        player.attributes.strength /= 0.4;
    }
}