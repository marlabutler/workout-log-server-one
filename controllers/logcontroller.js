const Express = require("express");
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");

// Import the Wol Model
const { WolModel } = require("../models");

router.get("/practice", validateJWT, (req, res) => {
    res.send("Hey!! This is a practice route!")
});

/*
======================
Log Create
======================
*/
router.post("/create", validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const { id } = req.user;
    const WolEntry = {
        description,
        definition,
        result,
        owner_id: id 
    }
    try {
        const newWol = await WolModel.create(WolEntry);
        res.status(200).json(newWol);
    } catch (err) {
        res.status(500).json({ error: err });
    }

    
});

/*
======================
Get all Logs
======================
*/
router.get("/", async (req, res) => {
    try {
        const entries = await WolModel.findAll();
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
======================
Get Logs by User
======================
*/
router.get("/mine", validateJWT, async (req, res) => {
    const { id } = req.user;
    try {
        const userWols = await WolModel.findAll({
            where: {
                owner_id: id 
            }
        });
        res.status(200).json(userWols);
    } catch (err) {
        res.status(500).json({ error: err});
    }
});


/*
======================
Update a Log
======================
*/
router.put("/update/:entryID", validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const WolId = req.params.entryID;
    const userId = req.user.id;

    const query = {
        where: {
            id: WolId,
            owner_id: userId
        }
    };

    const updatedWol = {
        description: description,
        definition: definition,
        result: result 
    };

    try {
        const update = await WolModel.update(updatedWol, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
======================
Delete a Log
======================
*/
router.delete("/delete/:id", validateJWT, async (req, res) =>{
    const ownerId = req.user.id;
    const WolId = req.params.id;

    try {
        const query = {
            where: {
                id: WolId,
                owner_id: ownerId
            }
        };

        await WolModel.destroy(query);
        res.status(200).json({ message: "Workout Entry Removed" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
router.get('/about', (req, res) => {
    res.send("This is the about route!");
});

module.exports = router;