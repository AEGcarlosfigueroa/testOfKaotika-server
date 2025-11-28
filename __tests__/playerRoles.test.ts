import {roles, getRoleByEmail} from "./../src/database/playerRoles.ts";

describe("input the email of the player and return its associated role", () => {

    test('Istvan email to output istvan role', () => {
        const resultIstvan = getRoleByEmail(roles.istvan);
        expect(resultIstvan).toBe('ISTVAN');
    });

    test('Mortimer email to output mortimer role', () => {
        const resultMortimer = getRoleByEmail(roles.mortimer);
        expect(resultMortimer).toBe('MORTIMER');
    });

    test('Villain email to output villain role', () => {
        const resultVillain = getRoleByEmail(roles.villano);
        expect(resultVillain).toBe('VILLANO');
    });

    test('Any email not associated with any role output acolyte role', () => {
        const resultAcolyte = getRoleByEmail('kjcb2ioubfciu');
        expect(resultAcolyte).toBe('ACOLITO');
    })
    
})