import { hasFlags } from "./flags"

const getCurrentScene = (script, sceneName) => {
    return script['scene__' + sceneName]
}
const getCurrentLine = (script, sceneName, lineName) => {
    // console.log(sceneName)
    return script['scene__' + sceneName]['line__' + lineName]
}

const getSpeakerName = (script, sceneName, lineName) => {
    var speaker = getCurrentLine(script, sceneName, lineName).speaker
    if (speaker.keyName == '__narrator') return ''
    else return speaker.name
}

const getFirstSection = (sections, flags) => {
    for (var i=0; i<sections.length; i++) {
      if (hasFlags(flags, sections[i].meta__flagList)) return sections[i]
    }
    return null
}

const getSectionByName = (sections, sectionName) => {
  for (var sect of sections) {
    if (sect.meta__id == sectionName) return sect;
  }
  return null
}

const getSceneByName = (section, sceneName) => {
  return section['scene__' + sceneName]
}

const getNextSection = (script, sections, flags) => {
    for (var sect of sections) {
      if (sect.meta__id != script.meta__id && sect.meta__previous == script.meta__id) {
        if (hasFlags(flags, sect.meta__flagList)) return sect
      }
    }
    return null
}

const getNextScene = (script, flags, nextScene) => {
    if (nextScene == '' || nextScene == null) return null
    else {
      if (hasFlags(flags, script['scene__' + nextScene].meta__flagRList)) return nextScene
      else return getNextScene(script, flags, script['scene__' + nextScene].next)
    }
}

const getEligibleOptions = (script, flags) => {
    var options = []
    for (var opt of script.choice.options) {
      if (hasFlags(flags, opt.required)) options.push(opt)
    }
    return options;
}

const getCurrentText = (script, sceneName, lineName) => {
    var text = parseNick(script, parseNick(script, getCurrentLine(script, sceneName, lineName).text), 'p')
    if (text.length > 1) return text[0].toUpperCase() + text.substring(1)
    else if (text.length > 0) return text.toUpperCase()
    else return '---'
}

const getMatchingNick = (script, thing) => {
    for (var nick of script.nicks) {
      if (nick.name == thing) return nick
    }
    return null
}

const parseNick = (script, line, type='n') => {
    var startSym = '{@'
    var endSym = '@}'
    if (type == 'p') {
      startSym = '{!'
      endSym = '!}'
    }
    var position1 = line.search(startSym);
    var position2 = -1
    if (position1 != -1) position2 = line.substring(position1).search(endSym)
    if (position1 == -1 || position2 == -1) return line

    var text = line
    var nick
    var newLine = ''
    var someCond = true
    while (someCond) {
      nick = text.substring(position1 + 2, position1 + position2)
      var matchingNick = getMatchingNick(script, nick)
      if (matchingNick != null) {
        if (type == 'p') newLine += text.substring(0, position1) + matchingNick.pronoun
        else newLine += text.substring(0, position1) + matchingNick.nick
      } else {
        newLine += text.substring(0, position1)
      }
      // console.log('text:' + text)
      // console.log('newline:' + newLine)
      text = text.substring(position1 + position2 + 2)
      position1 = text.search(startSym);
      if (position1 != -1) position2 = text.substring(position1).search(endSym)
      if (position1 == -1 || position2 == -1) {
        newLine += text
        someCond = false
      }
    }
    // console.log(newLine)
    return newLine
}

const haveChoice = (script, flags) => {
    var choice = script.choice
    for (var opt of choice.options) {
        // main dialogue data: saved in App
        // always have a bookmark loaded/new bookmark created
        // check if any eligible options
        if (hasFlags(flags, opt.required)) return true;
    }
    return false
}

const getChoicePrompt = (script) => { return script.choice.prompt; }

export { getCurrentScene, getCurrentLine, getSpeakerName, getFirstSection, getNextSection, getNextScene, getEligibleOptions, getCurrentText, haveChoice, getChoicePrompt, getSectionByName, getSceneByName };