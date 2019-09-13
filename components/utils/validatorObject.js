module.exports = {
    // Profile
    name: /\[Name\]:[^\s].*/g,
    bio: /\[Bio\]:[^\s].*/g,
    //
    health: /\[Health\]:(Healthy|Injured|Dead)$/g,
    sanity: /\[Sanity\]:[0-5]/g,
    initiative: /\[Initiative\]:[1-3]/g,
    // Passive Skills
    endurance: /\[Endurance\]:[1-3]/g,
    wits: /\[Wits\]:[1-3]/g,
    speed: /\[Speed\]:[1-3]/g,
    // Active Skills
    combat_melee: /\[Combat \(melee\)\]:[0-6]/g,
    combat_ranged: /\[Combat \(ranged\)\]:[0-6]/g,
    communication: /\[Communication\]:[0-6]/g,
    orientation: /\[Orientation\]:[0-6]/g,
    stealth: /\[Stealth\]:[0-6]/g,
    profiling: /\[Profiling\]:[0-6]/g,
    science: /\[Science\]:[0-6]/g,
    occult: /\[Occult\]:[0-6]/g,
    faith: /\[Faith\]:[0-6]/g,
    clearence_level: /\[Clearence Level\]:[0-6]/g,
    // Active Skills
    lucky_shots: /\[Lucky Shots\]:[0-6]/g
};
