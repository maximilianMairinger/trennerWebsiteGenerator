import * as Ftp from "ftp-deploy";
import * as path from "path"
const ftp = new Ftp();






let remote = "projekte.tgm.ac.at"
let remoteDir = "/htdocs"
let port = 22

export default async function(dir: string, options: {username: string, password: string}) {
  // let config = {
  //   user: options.username,
  //   password: options.password,
  //   host: remote,
  //   port: port,
  //   localRoot: path.join(__dirname, "../test"),
  //   remoteRoot: remoteDir,
  //   include: ['*'],
  //   deleteRemote: false,
  //   forcePasv: true
  // }

  // try {
  //   console.log("upppp");
  //   console.log("suc" + await ftp.deploy(config));
    
  // } catch (error) {
  //   console.log("err", error);
    
  // }
  
}