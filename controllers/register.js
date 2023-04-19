const handleRegister = (db, bcrypt) => (req, res) => {
    const { name, email, password } = req.body;
    if ( email && password && name ) {
        const hash = bcrypt.hashSync(password, 8);
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('invalid info'))
    } else {
        if ( email === "" && password === "" && name === "" ) {
            res.status(400).json("enter email and password and name");
        }
        if ( name === " ") {
            res.status(400).json("enter name");
        }
        if ( email === "" ) {
            res.status(400).json("enter email");
        }
        if ( password === "" ) {
            res.status(400).json("enter password");
        }
    }
}

module.exports = {
    handleRegister: handleRegister
}