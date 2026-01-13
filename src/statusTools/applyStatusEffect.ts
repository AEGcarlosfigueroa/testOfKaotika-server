export function ApplyStatusEffect(player : any, diseaseApplied : String) {

    if (!player.statusEffects.includes(diseaseApplied)) {

        player.statusEffects.push(diseaseApplied);
    }

    await player.save();

    socket.emit("confirmation", "ok")

    const acolyteSO = await io.in(player.socketId).fetchSockets();

    console.log(acolyteSO[0].id);

    acolyteSO[0].emit("updated player", player);
}
