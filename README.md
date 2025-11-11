[![Node.js CI/CD on Amazon Linux](https://github.com/owenhilll/Locale-Backend/actions/workflows/nodejs.yml/badge.svg?branch=main)](https://github.com/owenhilll/Locale-Backend/actions/workflows/nodejs.yml)

# Https without custom domain.
## Caddy and Nip.IO
Used in conjunction, these two services allow the backend 
server to be TLS certified, resolving the domain name to the ec2 IP.
This saves having to purchase and manage a custom domain.

## Running service on ec2
Pretty straightforward setup. Currently, only one ec2 
instance is running the backend server, but may expand if traffic calls for it.
### setup
clone repo, install nvm and then npm. create a service 
called locale.service. enable service to start on reboot. 
edit service configuration file to point to the project dir.
#### MYSQL plans
if more than one server is spun up, 
were gonna need to create a centralized datastore. 
right now, mysql is running on server1 and is the primary datastore.
It makes sense at the moment for cost purposes, but may need to be 
revisted and moved to a centralized approach in the future.

# CI/CD
Currently configured to update Server1 and restart service, using Github actions. 
Will need more configuration if additional servers are spun up.
