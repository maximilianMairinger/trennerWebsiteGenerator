import { Validator } from "jsonschema"


var v = new Validator();

let teacherSchema = {
  id: "/teacher",
  type: "object",
  properties: {
    name: {type: "string"},
    competencies: {
      type: "array",
      items: {type: "string"}
    },
  },
  required: ["name", "competencies"]
}

// Address, to be embedded on Person
let optionsSchema = {
  type: "object",
  properties: {
    name: {type: "string"},
    year: {type: "number"},
    username: {type: "string"},
    password: {type: "string"},
    teachers: {
      type: "object",
      properties: {
        0: {$ref: "/teacher"},
        1: {$ref: "/teacher"},
        2: {$ref: "/teacher"},
      },
      required: ["0", "1", "2"]
    },
  },
  required: ["name", "year", "username"]
};


v.addSchema(teacherSchema, '/teacher');

export default function (data: any) {
  return v.validate(data, optionsSchema).errors
}

