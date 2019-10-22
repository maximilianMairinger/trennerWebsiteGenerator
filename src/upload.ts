import * as Client from "ssh2-sftp-client";
import * as path from "path"
import * as fs from "fs";










let remote = "projekte.tgm.ac.at"
let remoteDir = "/htdocs/test123"
let port = 22

export default async function(dir: string, options: {username: string, password: string}) {


  // let sftp = new Client();
  //
  // sftp.connect({
  //   host: remote,
  //   port,
  //   username: options.username,
  //   password: options.password
  // }).then(() => {
  //   return path.join(__dirname, "../test");
  // }).then(data => {
  //   console.log(data, 'the data info');
  // }).catch(err => {
  //   console.log(err, 'catch error');
  // });

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
  //
  // } catch (error) {
  //   console.log("err", error);
  //
  // }

}
