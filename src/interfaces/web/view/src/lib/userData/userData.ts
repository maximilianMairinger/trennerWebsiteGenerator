import setData, {DataBase} from "front-db";

let USERDATA: DataBase<UserData>;

let defaultAvatar = "avatars/default-avatar.png";
let defaultUsername = "Username";

set({username: localStorage.username || defaultUsername, avatar: localStorage.avatar || apiUrl + defaultAvatar});
export async function set(data: UserData) {
  USERDATA = setData(data);
  return USERDATA;
}

export async function setUsername(username: string = defaultUsername) {
  localStorage.username = username;
  USERDATA.set("username", username);
}

export async function setAvatar(avatar: string = defaultAvatar) {
  localStorage.avatar = avatar;
  USERDATA.set("avatar", avatar);
}

export default function getData() {
  return USERDATA;
}

interface UserData {
  username: string;
  avatar: string;
}
