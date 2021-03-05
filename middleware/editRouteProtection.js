

const checkForEmptyString = (req, res, next) => {
    const parameter = req.params.propname;
    if(req.body[parameter].trim() == "") return res.status(400).send({ err: 'Given property empty!'});
    next();
}

const checkIfParameterExists = (req, res, next) => {
    const parameter = req.params.propname;
    if(!req.body[parameter]) return res.status(400).send({ err: 'Property not provided'});
    next();
}

const checkForInvalidProperty = (req, res, next) => {
    const parameter = req.params.propname;
    const properties = ['city', 'state_province', 'country', 'lastname', 'firstname', 'birthday', 'biography', 'nationality', 'street_adress'];
    for(let property of properties) 
        if(property == parameter) return next();
    return res.status(404).send({ err: 'Bad route!'});

    
}

module.exports = { checkForEmptyString, checkIfParameterExists, checkForInvalidProperty }