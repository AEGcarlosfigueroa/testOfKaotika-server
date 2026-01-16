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
            player.attributes.constitution *= 0.6;
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

export function reapplySicknesses(player: any) {

    for(let i=0; i<player.statusEffects.length; i++)
    {
        const diseaseApplied = player.statusEffects[i];
        if (diseaseApplied === deadlyEffects.ethaziumCurse) {
            player.attributes[0].strength *= 0.6;
            player.attributes[0].dexterity *= 0.6;
            player.attributes[0].intelligence *= 0.6;
            player.attributes[0].constitution *= 0.6;
        }
        else if(diseaseApplied === deadlyEffects.medulaApocalypse){
            player.attributes[0].constitution *= 0.7;
        }
        else if (diseaseApplied === deadlyEffects.putridPlague){
            player.attributes[0].intelligence *= 0.25
        }
        else if (diseaseApplied === deadlyEffects.epicWeakness){
            player.attributes[0].strength *= 0.4
        }
    }
}

function ApplyMaladies(player: any, diseaseApplied: any) {

    console.log("applying maladies...");
    console.log(player.attributes);

    if (diseaseApplied === deadlyEffects.ethaziumCurse) {
        player.attributes[0].strength *= 0.6;
        player.attributes[0].dexterity *= 0.6;
        player.attributes[0].intelligence *= 0.6;
        player.attributes[0].constitution *= 0.6;
    }
    else if (diseaseApplied === deadlyEffects.medulaApocalypse) {
        player.attributes[0].constitution *= 0.7;
    }
    else if (diseaseApplied === deadlyEffects.putridPlague) {
        player.attributes[0].intelligence *= 0.25
    }
    else {
        player.attributes[0].strength *= 0.4
    }
}


