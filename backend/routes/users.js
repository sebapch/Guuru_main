const router = require("express").Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/user.model");


//const registerUser = re...

router.post("/register", async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName, saldo } = req.body;

    // validate

    if (!email || !password || !passwordCheck)
      return res.status(400).json({ msg: "Not all fields have been entered." });
    if (password.length < 5)
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long." });
    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ msg: "Enter the same password twice for verification." });

    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });

    if (!displayName) displayName = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      displayName,
      saldo,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." });

    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    console.log("token",token);
    res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        saldo: user.saldo,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/api/:id', function(req, res, next) {
  User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

//CONSEGUIR USUARIO
router.get('/api/edit/:id', function(req, res, next) {
  User.findById(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  }
  );
});

router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, ']x"_w%n.^kGC(/]M5A6\:+xyV{v^jy?vq?%?sHQ{$(>uQ7,E5B');
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json(user);
});

router.post("/api/edit/:id", /* auth,  */async (req,res)=>{
  
  const {userId} = req.body

  User.findByIdAndUpdate(userId,{ saldo : req.body.saldo })
  .then(user => res.json(user))
  .catch(err => res.status(500).json({error: err.message}))
})

router.post("/api/edit/", /* auth,  */async (req,res)=>{
  
  const {userId} = req.body

  User.findByIdAndUpdate(userId,{ saldo : req.body.saldo })
  .then(user => res.json(user))
  .catch(err => res.status(500).json({error: err.message}))
})


router.post("/api/vaults", /* auth,  */async (req,res)=>{
  
  const {userId,...newVault} = req.body

  User.findByIdAndUpdate(userId,{ $push : { vaults : newVault } })
  .then(user => res.json(user))
  .catch(err => res.status(500).json({error: err.message}))

  //new Vault(newVault)

})

router.get("/api/vaults",/* auth, */ async (req,res)=>{
  const users = await User.find()
  res.json(users)
})

router.get("/api/getvaults", /* auth, */ async (req, res) => {
  const user = await User.findById(req.user);
  res.json(user);
});

//SET VAULT ACTIVATED TRUE
router.post("/api/activate/:id/:vaultid", /* auth,  */async (req,res)=>{
  const { id } = req.params
  const { vaultId, endDate } = req.body
  User.updateOne({id, 'vaults._id': vaultId},{ '$set': {'vaults.$.activated': true, 'vaults.$.endDate': endDate}}, {
    new: true
  })
  .then(user => res.json(user))
  .catch(err => res.status(500).json({error: err.message}))
});




//GET SPECIFIC VAULT FROM DB
router.get("/api/vaults/:id/:vaultid", /* auth,  */async (req,res)=>{
  const { id, vaultid } = req.params

  User.findOne({id, 'vaults._id': vaultid})
  .then(user => res.json(user))
  .catch(err => res.status(500).json({error: err.message}))
});

//get last vault created from db
router.get("/api/vaults/:id", /* auth,  */async (req,res)=>{
  const { id } = req.params
  
  User.findOne({'_id' : id}, {'vaults': {$slice: -1}})
  .then(user => res.json(user))
  .catch(err => res.status(500).json({error: err.message})) 

});

//delete last vault created from db
router.delete("/api/vaults/:id", /* auth,  */async (req,res)=>{
  const { id } = req.params
  
  User.updateOne({'_id' : id}, {'vaults': {$pop: 1}})
  .then(user => res.json(user))
  .catch(err => res.status(500).json({error: err.message})) 

});
  
  
//save ada and bnb in vaults inside user account
router.post("/api/vaults/:id/:vaultid", /* auth,  */async (req,res)=>{
  const { id, vaultid } = req.params
  const { coins } = req.body

  User.updateOne({id, 'vaults._id': vaultid},{ '$set': {'vaults.$.coins': coins}}, {
    new: true
  })
  .then(user => res.json(user))
  .catch(err => res.status(500).json({error: err.message}))
}
);



module.exports = router;