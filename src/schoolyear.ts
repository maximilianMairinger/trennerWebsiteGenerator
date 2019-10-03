let newSchoolYear = new Date("Sa, 03. Jul 2021")


export default function (at: Date = new Date()) {
  let currentYear = at.getFullYear()
  newSchoolYear.setFullYear(at.getFullYear())
  
  
  if (at > newSchoolYear) return currentYear + "/" + (currentYear + 1)
  else return (currentYear + 1) + "/" + currentYear
}