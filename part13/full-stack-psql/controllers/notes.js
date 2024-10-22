const router = require("express").Router()
const { Op } = require("sequelize")

const { Note, User } = require("../models")
const { tokenExtractor } = require("../util/middleware")

const noteFinder = async (req, res, next) => {
  req.note = await Note.findByPk(req.params.id, {
    include: {
      model: User,
      attributes: ["username", "name", "id"],
    },
    attributes: {
      exclude: ["userId"],
    },
  })
  next()
}

router.get("/", async (req, res) => {
  const where = {}

  if (req.query.important) {
    where.important = req.query.important === "true"
  }

  if (req.query.search) {
    where.content = {
      [Op.iLike]: `%${req.query.search}%`,
    }
  }

  const notes = await Note.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
    order: [
      ['content', 'ASC']
    ]
  })

  res.json(notes)
})

router.get("/:id", noteFinder, async (req, res) => {
  if (req.note) {
    res.json(req.note)
  } else {
    res.status(404).end()
  }
})

router.post("/", tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)

    // === Create a note using the 'build' method ===
    // create a note without saving it yet
    // const note = Note.build({ ...req.body, date: new Date() })
    // put the user id in the userId property of the created note
    // note.userId = user.id
    // store the note object in the database
    // await note.save()

    const note = await Note.create({
      ...req.body,
      userId: user.id,
      date: new Date(),
    })
    res.json(note)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.delete("/:id", noteFinder, tokenExtractor, async (req, res) => {
  if (req.note) {
    if (req.note.user.id === req.decodedToken.id) {
      await req.note.destroy()
    } else {
      return res.status(401).json({ error: "Wrong user" })
    }
  }
  res.status(204).end()
})

router.put("/:id", noteFinder, async (req, res) => {
  if (req.note) {
    req.note.important = req.body.important
    await req.note.save()
    res.json(req.note)
  } else {
    res.status(404).end()
  }
})

module.exports = router
