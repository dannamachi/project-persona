const getStartSceneName = (script) => { return script.meta__startName.slice(7); }
const getEndSceneName = (script) => { return script.meta__endName.slice(7); }

const getStartLineName = (scene) => { return scene.meta__startName.slice(6); }
const getEndLineName = (scene) => { return scene.meta__endName.slice(6); }

const getSectionName = (sect) => { return sect.meta__id; }

const getPlayerName = (sections) => {
    // assume first section has name
    var sect = sections[0]
    // static...
    for (var nick of sect.nicks) {
        if (nick.name == 'morelle') {
            return nick.nick
        }
    }
    return null
}

const getPlayerPronoun = (sections) => {
    // assume first section has name
    var sect = sections[0]
    // static...
    for (var nick of sect.nicks) {
        if (nick.name == 'morelle') {
            return nick.pronoun
        }
    }
    return null
}

const getPlayerPossessive = (sections) => {
    // assume first section has name
    var sect = sections[0]
    // static...
    for (var nick of sect.nicks) {
        if (nick.name == "someone's") {
            return nick.nick
        }
    }
    return null
}

const getPlayerTitle = (sections) => {
    // assume first section has name
    var sect = sections[0]
    // static...
    for (var nick of sect.nicks) {
        if (nick.name == "young someone") {
            return nick.nick.slice(6)
        }
    }
    return null
}

const setPlayerName = (sections, nameToSet) => {
    // static
    for (var sect of sections) {
        for (var nick of sect.nicks) {
            if (nick.name == 'morelle') {
                nick.nick = nameToSet
            }
        }
    }
    return sections
}

const setPlayerPronoun = (sections, pronounToSet) => {
    // static
    for (var sect of sections) {
        for (var nick of sect.nicks) {
            if (nick.name == 'morelle' || nick.name == 'gray') {
                nick.pronoun = pronounToSet
            }
        }
    }
    return sections
}

const setPlayerPossessive = (sections, poss) => {
    // static
    for (var sect of sections) {
        for (var nick of sect.nicks) {
            if (nick.name == "someone's") {
                nick.nick = poss
                nick.pronoun = poss
            }
            if (nick.name == 'gray') {
                nick.pronoun = poss
            }
            if (nick.name == 'someself') {
                nick.nick = poss + 'self'
                nick.pronoun = poss + 'self'
            }
        }
    }
    return sections
}

const setPlayerTitle = (sections, titleToSet) => {
    // static
    for (var sect of sections) {
        for (var nick of sect.nicks) {
            if (nick.name == 'young someone') {
                nick.nick = 'young ' + titleToSet
            }
        }
    }
    return sections
}

const setNickableSpeaker = (sections, nickName, newNickValue) => {
    for (var i=0; i< sections.length; i++) {
        var sect = sections[i]
        for (const [key, value] of Object.entries(sect)) {
            if (key.startsWith('scene__')) {
                for (const [key1, value1] of Object.entries(value)) {
                    if (key1.startsWith('line__')) {
                        if (value1.speaker.isNick && value1.speaker.keyName == nickName) {
                            sections[i][key][key1].speaker = {
                                keyName: nickName,
                                name: newNickValue,
                                isNick: true,
                                defaultName: value1.speaker.defaultName
                            }
                        }
                    }
                }
            }
        }
    }
    return sections
}

export { getEndSceneName, getStartSceneName, getStartLineName, getEndLineName, getSectionName, getPlayerName, getPlayerTitle, getPlayerPronoun, getPlayerPossessive, setPlayerName, setPlayerPossessive, setPlayerPronoun, setPlayerTitle, setNickableSpeaker };