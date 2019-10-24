import * as inquirer from "inquirer";


async function askCompetencie(teacherName: string, another: boolean) {
  let ans = await inquirer.prompt([
    {name: "competence", message: "Enter " + (another ? "another" : "one") + " competence " + teacherName + " has"},
    {name: "anotherOne", message: "Does " + teacherName + " has another one", type: "confirm"}
  ])
  return ans
}


async function askTeacher(teacherIndex: number) {
  let ans: any = await inquirer.prompt([
    {name: "name", message: (1 + teacherIndex) + ". teacher name"},
  ])
  let competencie = await askCompetencie(ans.name, false)
  ans.competencies = [competencie]
  
  let anotherOne = competencie.anotherOne
  while (anotherOne) {
    competencie = await askCompetencie(ans.name, true)
    ans.competencies.add(competencie)
    anotherOne = competencie.anotherOne
  }
  return ans
}

export default async function() {
  let ans: any = await inquirer.prompt([
    {name: "name", message: "Full name"},
    {name: "year", message: "Year (1|2|3|4|5)", type: "number"},
    {name: "username", message: "Username"},
    {name: "password", type: "password", mask: true, message: "TGM-Password (This is optional! If youd like the result to be uploaded automatically, enter your TGM password.)"},
  ])

  ans.teachers = {}
  for (let i = 0; i < 3; i++) {
    ans.teachers[i] = await askTeacher(i)
  }

  return ans
}

