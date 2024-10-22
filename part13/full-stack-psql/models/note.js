const { Model, DataTypes } = require("sequelize")

const { sequelize } = require("../util/db")

class Note extends Model {}

Note.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    important: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
    },
    // === We could define the model with foreign key as follows ===
    // userId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: { model: 'users', key: 'id' }
    // }
    // === Defining at the class level of the model as above is usually unnecessary ===
    // as we alreay define the one-to-many (or other) relationships in the index.js model file
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "note",
  }
)

module.exports = Note
