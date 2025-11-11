import nodemailer from "nodemailer";
let tenantId = process.env.tenantId; // Get from Azure App Registration
let clientId = process.env.clientId; // Get from Azure App Registration
let clientSecret = process.env.clientSecret;
let oAuthToken = "";
import * as msal from "@azure/msal-node";

import fetch, { Headers } from "node-fetch";

const aadEndpoint = "https://login.microsoftonline.com";
const graphEndpoint = "https://graph.microsoft.com";

const msalConfig = {
  auth: {
    clientId,
    clientSecret,
    authority: aadEndpoint + "/" + tenantId,
  },
};

const tokenRequest = {
  scopes: [graphEndpoint + "/.default"],
};

const cca = new msal.ConfidentialClientApplication(msalConfig);
const tokenInfo = await cca.acquireTokenByClientCredential(tokenRequest);
const headers = new Headers();
const bearer = `Bearer ${tokenInfo.accessToken}`;

headers.append("Authorization", bearer);
headers.append("Content-Type", "application/json");

export async function sendRegistrationEmail(mailOptions) {
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ message: mailOptions, saveToSentItems: false }),
  };

  const res = await fetch(
    graphEndpoint + "/v1.0/users/BusinessReg@localeapplive.com/sendMail",
    options
  );
  return res.status == 202;
}

export async function sendSupportEmail(mailOptions) {
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ message: mailOptions, saveToSentItems: false }),
  };

  const res = await fetch(
    graphEndpoint + "/v1.0/users/support@localeapplive.com/sendMail",
    options
  );
  return res.status == 202;
}
