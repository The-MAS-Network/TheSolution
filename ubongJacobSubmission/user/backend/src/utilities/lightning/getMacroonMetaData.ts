import fs from "fs";

const MACAROON_PATH = "./src/assets/admin.macaroon";

const getMacroonMetaData = () => {
  return fs.readFileSync(MACAROON_PATH).toString("hex");
};

export default getMacroonMetaData;
