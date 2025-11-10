import nodemailer from "nodemailer";
let tenantId = process.env.tenantId; // Get from Azure App Registration
let clientId = process.env.clientId; // Get from Azure App Registration
let clientSecret = process.env.clientSecret;
let oAuthToken = "";
const transporter = nodemailer.createTransport({
  service: "hotmail",

  auth: {
    user: process.env.BUSINESS_REG,
    pass: process.env.BUSINESS_REG_PW,
  },
});

export async function sendRegistrationEmail(mailOptions) {
  try {
    const info = await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
let msgPayload = {
  //Ref: https://learn.microsoft.com/en-us/graph/api/resources/message#properties
  message: {
    subject: "Test",
    body: {
      contentType: "HTML",
      content: "Test123",
    },
    toRecipients: [
      { emailAddress: { address: "meganb@contoso.onmicrosoft.com" } },
    ],
  },
};
let userFrom = "support@localeapplive.com";
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
