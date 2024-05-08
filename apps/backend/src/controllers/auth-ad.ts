import { Router } from "express";
import logger from "../helper/logger";
import ldap from "ldapjs";
import ActiveDirectory from "activedirectory2";

const authADController = Router();

authADController.post("/ldapjs", async (req, res) => {
  try {
    const { username, password } = req.body;
    logger.info(`/auth-ad/ldapjs ${username}`);

    const LDAP_URL = "ldap://corp.dohaoasis.com";
    const LDAP_BASE_DN = "dc=corp,dc=dohaoasis,dc=com";
    const LDAP_USER = username;
    const LDAP_PASSWORD = password;

    const client = ldap.createClient({
      url: LDAP_URL,
    });

    client.bind(`cn=${LDAP_USER},${LDAP_BASE_DN}`, LDAP_PASSWORD, (err) => {
      if (err) {
        console.log("Authentication failed from LDAP", err);
        throw new Error(err.message);
      } else {
        res.status(200).json({ message: "Authenticated" });
      }
    });
  } catch (error) {
    logger.info(`Error at auth-ad/ldapjs: ${(error as any)?.message}`);
    res.status(500).json({ message: "Error authenticatin" });
  }
});

authADController.post("/activedirector2", async (req, res) => {
  try {
    const { username, password } = req.body;
    logger.info(`/auth-ad/activedirector2 ${username}`);

    const LDAP_URL = "ldap://corp.dohaoasis.com";
    const LDAP_BASE_DN = "dc=corp,dc=dohaoasis,dc=com";
    const LDAP_USER = username;
    const LDAP_PASSWORD = password;

    const ad = new ActiveDirectory({
      url: LDAP_URL,
      baseDN: LDAP_BASE_DN,
      username: LDAP_USER,
      password: LDAP_PASSWORD,
    });

    ad.authenticate(username, password, function (err, auth) {
      if (err) {
        console.log("ERROR: " + JSON.stringify(err));
        res
          .status(500)
          .json({ message: `Authentication error from AD ${JSON.stringify(err)}` });
        return;
      }

      if (auth) {
        res.status(401).json({ message: `Authentication failed from AD` });
      } else {
        res.status(200).json({ message: "Authenticated" });
      }
    });
  } catch (error) {
    logger.info(`Error at auth-ad/activedirector2: ${(error as any)?.message}`);
    res.status(500).json({ message: "Error authenticatin" });
  }
});

export default authADController;
