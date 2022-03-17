# Getting Started

Clone the repository to desired location.
```git
git clone https://github.com/EE5-IoT16/ee5-huzza.git
```
Then cd into the project.

NVM: https://github.com/coreybutler/nvm-windows
We are using 16.14.0 version
to use it:
```powershell
nvm install 16
nvm use 16.14.0
```
(keep in mind to use these commands you need to run it with administrator rights.)

To run the software you need to install dependencies and then execute node index.js file.

```powershell
npm install
node index.js
```

Before starting to develop a certain part of the project create a branch and work on it. After you finish create a merge request. This will be added to the main repository by another teammate.

After the newly added feature merged to the main branch it needs to be deployed to Heroku to host it in our live platform.
