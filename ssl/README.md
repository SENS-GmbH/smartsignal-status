# Self-signed SSL Certificate with OpenSSL

This guide will walk you through the steps to create a self-signed SSL certificate using OpenSSL. OpenSSL is an open-source software that enables encryption and authentication on the internet.

## Prerequisites

Before you begin, you will need to have OpenSSL installed on your computer.

## Steps

1. Open your terminal or command prompt and navigate to a directory where you want to save the certificate.
2. Navigate to this folder using this command:
`cd YOUR/PATH/ssl`
"YOUR PATH" sould be the path where the package.json is located.
3. Generate a private key by entering the following command in this folder:
`openssl genrsa -out server.key 2048`
This command will create a private key file named server.key with a length of 2048 bits.
4. Create a Certificate Signing Request (CSR) by entering the following command:
`openssl req -new -key server.key -out server.csr`
This command will create a CSR file named server.csr. You will need to fill in the fields in this file to obtain the certificate.
5. Fill out the CSR file by completing the fields.
6. Generate a self-signed SSL certificate by entering the following command:
`openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt`
This command will create a self-signed certificate named server.crt that is valid for 365 days.
7. Start your app with `npm run https`

Congratulations! You now have a server.crt and server.key file that you can use to start your React app on a local server with HTTPS.
