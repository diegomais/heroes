const Hapi = require("@hapi/hapi");
const HapiSwagger = require("hapi-swagger");
const Inert = require("@hapi/inert");
const Joi = require("joi");
const Pack = require("./package");
const Sequelize = require("sequelize");
const Vision = require("@hapi/vision");

const failAction = async (request, h, err) => {
  console.error("Validation error: ", err);
  throw err;
};

const port = process.env.PORT || 3333;

const init = async () => {
  const server = new Hapi.Server({ port });

  if (!process.env.POSTGRES_HOST) {
    throw Error(
      "process.env.POSTGRES_HOST must be a: user:pass@ipService:port "
    );
  }
  const sequelize = new Sequelize(
    `postgres://${process.env.POSTGRES_HOST}/${process.env.POSTGRES_DB ||
      "heroes"}`,
    {
      ssl: process.env.POSTGRES_SSL,
      dialectOptions: { ssl: process.env.POSTGRES_SSL }
    }
  );
  await sequelize.authenticate();
  console.log("postgres is running");

  const Hero = sequelize.define("hero", {
    name: Sequelize.STRING,
    power: Sequelize.STRING
  });

  await Hero.sync({ force: true });

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: "Node.js with PostgreSQL",
          version: Pack.version
        }
      }
    }
  ]);

  server.route([
    {
      method: "GET",
      path: "/heroes",
      handler: () => Hero.findAll(),
      config: {
        description: "List all heroes",
        notes: "list all heroes from database",
        tags: ["api"]
      }
    },
    {
      method: "GET",
      path: "/heroes/{id}",
      handler: req => Hero.findAll({ where: { id: req.params.id } }),
      config: {
        description: "Show a hero",
        notes: "show a hero from database",
        tags: ["api"],
        validate: {
          failAction,
          params: Joi.object({ id: Joi.string().required() })
        }
      }
    },
    {
      method: "POST",
      path: "/heroes",
      config: {
        handler: req => {
          const { payload } = req;
          return Hero.create(payload);
        },
        description: "Create a hero",
        notes: "create a hero in database",
        tags: ["api"],
        validate: {
          failAction,
          payload: Joi.object({
            name: Joi.string().required(),
            power: Joi.string().required()
          })
        }
      }
    },
    {
      method: "PUT",
      path: "/heroes/{id}",
      config: {
        handler: req => {
          const { payload } = req;
          return Hero.update(payload, { where: { id: req.params.id } });
        },
        description: "Update a hero in database",
        notes: "update a hero in database",
        tags: ["api"],
        validate: {
          failAction,
          params: Joi.object({ id: Joi.string().required() }),
          payload: Joi.object({ name: Joi.string(), power: Joi.string() })
        }
      }
    },
    {
      method: "DELETE",
      path: "/heroes/{id}",
      config: {
        handler: req => Hero.destroy({ where: { id: req.params.id } }),
        description: "Delete a hero from database",
        notes: "delete a hero from database",
        tags: ["api"],
        validate: {
          failAction,
          params: Joi.object({ id: Joi.string().required() })
        }
      }
    }
  ]);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

init();
