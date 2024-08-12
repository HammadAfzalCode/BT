const Joi = require("joi");

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
})
  .required()
  .options({ allowUnknown: false });

const createUserSchema = Joi.object({
  email: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.number().required(),
}).options({ allowUnknown: false });

const forgotPasswordSchema = Joi.object({
  email: Joi.string().required(),
}).options({ allowUnknown: false });

const verifyOtpSchema = Joi.object({
  email: Joi.string().required(),
  otp: Joi.number().required(),
}).options({ allowUnknown: false });

const updatePasswordSchema = Joi.object({
  new_password: Joi.string().required(),
}).options({ allowUnknown: false });

const createUserBody = {
  body: {
    type: "object",
    properties: {
      email: { type: "string" },
      first_name: { type: "string" },
      last_name: { type: "string" },
      password: {
        type: "string",
        pattern: "^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})",
      },
      role: { type: "string" },
      workplace_type: { type: "string" },
      workplace_id: { type: "string" },
    },
    required: [
      "email",
      "first_name",
      "last_name",
      "password",
      "role",
      "workplace_type",
      "workplace_id",
    ],
  },
};

const loginUserBody = {
  body: {
    type: "object",
    properties: {
      email: { type: "string" },
      password: { type: "string" },
    },
    required: ["email", "password"],
  },
};

const forgotPasswordBody = {
  body: {
    type: "object",
    properties: {
      email: { type: "string" },
    },
    required: ["email"],
  },
};

const verifyOtpBody = {
  body: {
    type: "object",
    properties: {
      email: { type: "string" },
      otp: { type: "string" },
    },
    required: ["email", "otp"],
  },
};

const updatePasswordBody = {
  body: {
    type: "object",
    properties: {
      new_password: {
        type: "string",
        pattern: "^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})",
      },
    },
    required: ["new_password"],
  },
};

module.exports = {
  createUserBody,
  loginUserBody,
  forgotPasswordBody,
  verifyOtpBody,
  updatePasswordBody,
};
