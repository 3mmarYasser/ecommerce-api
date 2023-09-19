exports.excludeProps = (obj, props=[]) => {
    const newObj = {};
    Object.keys(obj).forEach((key) => {
        if (!props.includes(key)) newObj[key] = obj[key];
    });
    return newObj;
}

exports.includeProps = (obj, props=[]) => {
    if (props.length === 0) return obj;
    const newObj = {};
    Object.keys(obj).forEach((key) => {
        if (props.includes(key)) newObj[key] = obj[key];
    });
    return newObj;
}