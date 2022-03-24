// const SETTER_FLAGS = ['flag', 'score', 'value', 'inc', 'dec']
// const REQ_FLAGS = ['flag', 'score', 'value', 'more', 'less', 'diff']

const isOfFlagType = (flag, ft) => {
    switch (ft) {
        case "flag": return flag.type == 'flag';
        case "score": return ['score', 'inc', 'dec', 'more', 'less'].includes(flag.type);
        case "value": return ['value', 'diff'].includes(flag.type)
    }
    return false
}

const updateScoreFlag = (ofl, nfl, ft) => {
    switch (ft) {
        case "score":
            ofl.score = nfl.score;
            break;
        case "inc":
            ofl.score += nfl.score;
            break;
        case "dec":
            ofl.score -= nfl.score;
            break;
    }
    return ofl;
}

const updateValueFlag = (ofl, nfl) => {
    ofl.value = nfl.value
    return ofl;
}

const setFlag = (flags, flagToSet) => {
    var hasFlag = false
    var fl;
    for (var i=0; i<flags.length; i++) {
        fl = flags[i];
        if (isEqualFlag(fl, flagToSet)) {
            if (isOfFlagType(flagToSet, "score")) flags[i] = updateScoreFlag(fl, flagToSet, flagToSet.type)
            else if (isOfFlagType(flagToSet, "value")) flags[i] = updateValueFlag(fl, flagToSet)
            hasFlag = true
        }
    }
    if (!hasFlag) {
        flags.push(flagToSet)
    }
    return flags;
}

const checkScoreFlag = (current, req, ft) => {
    switch (ft) {
        case "score":
            return current.score == req.score;
        case "more":
            return current.score >= req.score;
        case "less":
            return current.score < req.score;
    }
    return false;
}

const checkValueFlag = (current, req, ft) => {
    switch (ft) {
        case "value":
            return current.value == req.value;
        case "diff":
            return current.value != req.value;
    }
    return false;
}

const hasFlag = (flags, reqFlag) => {
    var fl;
    for (var i=0; i<flags.length; i++) {
        fl = flags[i];
        if (isEqualFlag(fl, reqFlag)) {
            if (isOfFlagType(reqFlag, "score")) {
                if (checkScoreFlag(fl, reqFlag, reqFlag.type)) return true
            } 
            else if (isOfFlagType(reqFlag, "value")) {
                if (checkValueFlag(fl, reqFlag, reqFlag.type)) return true
            }
            else if (isOfFlagType(reqFlag, "flag")) return true
        }
    }
    return false
}

const hasFlags = (flags, requiredList) => {
    for (var fl of requiredList) {
        if (!hasFlag(flags, fl)) return false
    }
    return true
}

const isEqualFlag = (flag1, flag2) => {
    if (flag1.name != flag2.name) { return false }
    for (var ft of ["flag", "score", "value"]) {
        if (isOfFlagType(flag1, ft) && isOfFlagType(flag2, ft)) return true;
    }
    return false;
}

export { setFlag, isEqualFlag, hasFlag, hasFlags };