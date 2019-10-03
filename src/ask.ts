import * as inquirer from "inquirer";


export default async function () {
  let ans: {name: string, teachers: string, year: number, upload: boolean, username: string, password: string} = await inquirer.prompt([
    {name: "name", message: "Full name"},
    {name: "jahrgang", message: "year", type: "number", choices: [1,2,3,4,5]},
    {name: "teacher", message: "teacher(s) given json"},
    {name: "upload", message: "Would you like to upload the result?", type: "confirm"}
  ])

  if (ans.upload) {
    let ans2 = await inquirer.prompt([
      {name: "username"},
      {name: "password", type: "password", mask: true},
    ])
    ans.username = ans2.password
    ans.password = ans2.password
    return ans
  }
  else return ans
}

