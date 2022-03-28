const getStartSceneName = (script) => { return script.meta__startName.slice(7); }
const getEndSceneName = (script) => { return script.meta__endName.slice(7); }

const getStartLineName = (scene) => { return scene.meta__startName.slice(6); }
const getEndLineName = (scene) => { return scene.meta__endName.slice(6); }

const getSectionName = (sect) => { return sect.meta__id; }

export { getEndSceneName, getStartSceneName, getStartLineName, getEndLineName, getSectionName };