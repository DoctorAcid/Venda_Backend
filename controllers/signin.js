const handleSignin = (db, bcrypt) => (req, res) => {
    if (req.body.email !== "" && req.body.password !== "") {
        console.log(req.body);
        db.select('email', 'hash').from('login')
            .where('email', '=', req.body.email)
            .then(data => {
                  const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
                  if (isValid) {
                    return db.select('*').from('users')
                        .where('email', '=', req.body.email)
                        .then(user => {
                            res.json(user[0])
                        })
                        .catch(err => res.status(400).json('no such user'))
                  } else {
                    res.status(400).json('wrong password')
                  }
            })
            .catch(err => res.status(400).json('invalid info'))
    } else {
        if (req.body.email === "" && req.body.password === "") {
            res.status(400).json("enter email and password");
        } else {
            if (req.body.email === "") {
                res.status(400).json("enter email");
            } else {
                res.status(400).json("enter password");
            }
        }
    }
}

module.exports = {
    handleSignin: handleSignin
}