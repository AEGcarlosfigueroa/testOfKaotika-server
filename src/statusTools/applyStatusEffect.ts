import { deadlyEffects } from "../globalVariables.ts";

export async function ApplyStatusEffect(player: any, diseaseApplied: string) {
    if (!player.statusEffects.includes(diseaseApplied)) {
        player.statusEffects.push(diseaseApplied);

        ApplyMaladies(player, diseaseApplied)
    }

    await player.save();

}

export function reapplyStatusEffects(player: any, dbPlayer: any) {

    for(let i=0; i<dbPlayer.statusEffects.length; i++)
    {
        const diseaseApplied = dbPlayer.statusEffects[i];
        if (diseaseApplied === deadlyEffects.ethaziumCurse) {
            player.attributes.strength *= 0.6;
            player.attributes.dexterity *= 0.6;
            player.attributes.intelligence *= 0.6;
        }
        else if(diseaseApplied === deadlyEffects.medulaApocalypse){
            player.attributes.constitution *= 0.7;
        }
        else if (diseaseApplied === deadlyEffects.putridPlague){
            player.attributes.intelligence *= 0.25
        }
        else if (diseaseApplied === deadlyEffects.epicWeakness){
            player.attributes.strength *= 0.4
        }
    }
}

function ApplyMaladies(player: any, diseaseApplied: any) {

    if (diseaseApplied === deadlyEffects.ethaziumCurse) {
        player.attributes.strength *= 0.6;
        player.attributes.dexterity *= 0.6;
        player.attributes.intelligence *= 0.6;
        player.attributes.constitution *= 0.6;
    }
    else if (diseaseApplied === deadlyEffects.medulaApocalypse) {
        player.attributes.constitution *= 0.7;
    }
    else if (diseaseApplied === deadlyEffects.putridPlague) {
        player.attributes.intelligence *= 0.25
    }
    else {
        player.attributes[0].strength *= 0.4
    }
}


