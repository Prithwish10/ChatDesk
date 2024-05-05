<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
<!-- [![MIT License][license-shield]][license-url] -->

# <h1 align="center">Chatdesk</h1>

<!-- PROJECT LOGO -->
<br />
<!-- <div align="center">
  <a href="https://github.com/Prithwish10/Chatdesk">
    <img src="images/Chatdesk_logo.png" alt="Logo" width="100" height="100">
  </a>
</div> -->

<!-- TABLE OF CONTENTS -->
<details>
  <summary><h3>Table of Contents</h3></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#built-with">Built With</a></li>
        <!-- <li><a href="#how-the-services-work-together">How the services work together</a></li> -->
        <li><a href="#project-architecture">Project Architecture</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#Installations">Installations</a></li>
      </ul>
    </li>
<!--     <li><a href="#usage">Usage</a></li> -->
    <li><a href="#deployment">Deployment</a></li>
    <li><a href="#contributing">Contributing</a></li>
<!--     <li><a href="#license">License</a></li> -->
    <li><a href="#contact">Contact</a></li>
<!--     <li><a href="#acknowledgments">Acknowledgments</a></li> -->
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->

Chatdesk is a versatile messaging application that empower seamless communication with direct messaging and group chats. Manage group interactions effortlessly, from joining and leaving groups to adding or removing participants. Keep conversations alive with typing indicators and stay connected with user status updates. Built with Node.js, Express.js, TypeScript, Socket.io, MongoDB, Redis, Next.js, Docker, and Kubernetes in a microservices architecture, ensuring flexible scalability and efficient management of diverse functionalities, and uninterrupted growth as your user base expands.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Features
* Direct messaging: two users can chat with each other in real time.
* Group chat: users can participate in different group conversations in real time.
* Join/leave groups.
* Add/remove participants from a group (need to be a group admin for this).
* Typing indicator: when typing, the recipient/s gets notification.
* User status: whether user is online or offline.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* Backend
  
  * ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
  * ![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)
  * ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
  * ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
  * ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
  * ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
  * ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
  * ![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
  * NATS Streaming
* Frontend
  
  * ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
  * ![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)
  * ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
  * ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
  * ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
  * ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
  * ![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
  * ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
* Testing
  
  * ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
  * ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/Prithwish10/Chatdesk.svg?style=for-the-badge
[contributors-url]: https://github.com/Prithwish10/Chatdesk/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Prithwish10/Chatdesk.svg?style=for-the-badge
[forks-url]: https://github.com/Prithwish10/Chatdesk/network/members
[stars-shield]: https://img.shields.io/github/stars/Prithwish10/Chatdesk.svg?style=for-the-badge
[stars-url]: https://github.com/Prithwish10/Chatdesk/stargazers
[issues-shield]: https://img.shields.io/github/issues/Prithwish10/Chatdesk.svg?style=for-the-badge
[issues-url]: https://github.com/Prithwish10/Chatdesk/issues
[license-shield]: https://img.shields.io/github/license/Prithwish10/Chatdesk.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/prithwishdas60/
[product-screenshot]: images/screenshot.png


<!-- GETTING STARTED -->
## Getting Started

I'm working on Windows 11

### Installations

* Docker
  
  #### Windows:

  To install Docker with WSL2 on Windows 10/11, follow these steps:

  1. **Register for a DockerHub account:**
     
     Visit [DockerHub](https://hub.docker.com/signup) and register for a free account. You'll need this account to pull and push Docker images.
  
  2. **Download and install all pending Windows OS updates:**
  
     Make sure your Windows OS is up to date by installing all pending updates.
  
  3. **Run the WSL install script:**
  
     Open PowerShell as Administrator and run the following command:
     ```sh
     wsl --install
     ```
     This will enable and install all required features, as well as install Ubuntu. If you have previously enabled WSL, you may skip to step #6.

     Official documentation: [Install WSL Command](https://docs.microsoft.com/en-us/windows/wsl/install#install-wsl-command)
    
  4. **Reboot your computer:**
  
     After running the WSL install script, reboot your computer.
  
  5. **Set a Username and Password in Ubuntu:**
  
     After the reboot, Windows will auto-launch your new Ubuntu OS and prompt you to set a username and password.
  
  6. **Install Docker Desktop:**
  
      - Navigate to the [Docker Desktop installation page](https://docs.docker.com/desktop/install/windows-install/) and click the "Docker Desktop for Windows" button.
      - Download the Docker Desktop Installer from your Downloads folder.
      - Double-click the Docker Desktop Installer.
      - Click "Install anyway" if warned the app isn't Microsoft-verified.
      - Click "OK" to Add a shortcut to the Desktop.
      - Click "Close" when you see the "Installation succeeded" message.
      - Double-click the Docker Desktop icon on your Desktop.
      - Accept the Docker Service Agreement.
  
  7. **Open the WSL terminal:**
  
      Using the Windows Search feature in the toolbar, type `wsl` and click Open.
  
  8. **Check that Docker is working:**
  
      Using the WSL terminal, run the `docker` command. If all is well, you should see some helpful instructions in the output.
  
  9. **Log in to Docker:**
  
      Using the WSL terminal, run the following command and follow the prompts to enter your DockerHub account credentials:
      ```sh
      docker login
      ```
      Once you see "Login Succeeded," the setup is complete, and you are free to continue.

  #### macOS:

  This note provides detailed steps to install Docker and sign up for a DockerHub account on macOS.
  
  1. **Register for a DockerHub account:**
     
     Visit [DockerHub](https://hub.docker.com/signup) to register for a free account.
  
  2. **Navigate to the Docker Desktop installation page:**
     
     Visit the [Docker Desktop installation page](https://www.docker.com/products/docker-desktop/).
  
  3. **Select your Chip:**
     
     - Click the button corresponding to the chip of your computer. 
     - For M1 or M2 machines, click the "Mac with Apple Chip" button. 
     - For others, click the "Mac with Intel Chip" button.
  
  4. **Install Docker Desktop:**
     
     - Double-click the Docker.dmg file in your Downloads.
     - Drag and drop the Docker icon to the Applications folder.
     - Go to Applications and double-click the Docker icon.
     - Select "Open" in the "Are you Sure you want to open it" prompt.
     - Click "Accept" to the Service Agreement.
     - Click "OK" to the "Docker Desktop needs privileged access" prompt.
     - Enter your computer's username and password to install the helper.
     - Docker Desktop will launch for the first time.
  
  5. **Check that Docker is working:**
     
     Open your Terminal application and run the `docker` command. If all is well, you should see helpful instructions in the output.
  
  6. **Log in to Docker:**
     
     - Using your Terminal Application, run the `docker login` command.
     - Enter the username and password (or your Personal Access Token) you created during registration on DockerHub.
  
     Once you see "Login Succeeded," the setup is complete, and you are free to continue.

  
  #### Linux:

  **Installation of Docker Desktop on Native Hardware**
  
    If you are using WSL on Windows, install Docker Desktop for Windows, not Linux. If installing within a VM like VirtualBox or Parallels, or on a cloud server such as AWS, follow the instructions for installation on Cloud Servers or inside Virtual Machines. Docker Desktop does not work with nested virtualization.
    
    Currently, Docker Desktop only works with Ubuntu, Debian, or Fedora distributions. For other distributions, follow the "Installation on Cloud Servers or inside Virtual Machines" instructions.
  
    1. **Create Dockerhub account:**
       
       [Sign up for a Dockerhub account](https://hub.docker.com/signup).
    
    2. **Install Docker Desktop for Linux:**
    
       Simply follow the generic installation instructions for your particular distribution. Refer to [Docker Desktop Installation Documentation](https://docs.docker.com/desktop/install/linux-install/#generic-installation-steps).
    
    3. **Login to Dockerhub:**
    
       In your terminal, run `docker login` and enter your Dockerhub account username and password.
    
    4. **Test Docker installation:**
    
       After completing the installation, test Docker by running `docker run hello-world`. This should download and run the test container, printing "hello world" to your console.
    
    **Installation on Cloud Servers or inside Virtual Machines**
    
    The steps below are for Ubuntu Desktop LTS. For other Linux distributions, refer to the official documentation.
    
    - **Ubuntu:**
      [Docker CE Installation on Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
      
    - **CentOS:**
      [Docker CE Installation on CentOS](https://docs.docker.com/install/linux/docker-ce/centos/)
      (Note: Some users have encountered issues with CentOS or RHEL related to Docker container communication. You may need to research workarounds for any errors encountered or search QA for solutions.)
    
    - **Debian:**
      [Docker CE Installation on Debian](https://docs.docker.com/install/linux/docker-ce/debian/)
    
      1. **Create Dockerhub account:**
         
         [Sign up for a Dockerhub account](https://hub.docker.com/signup).
      
      2. **Install Docker:**
      
         Follow the Docker documentation to set up a Docker repository for installation and updates. Refer to the documentation for your specific distribution:
         
         - [Ubuntu Installation using the repository](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)
      
      3. **Login to Dockerhub:**
      
         In your terminal, run `docker login` and enter your Dockerhub account username and password.
      
      4. **Test Docker installation:**
      
         After completing the installation, test Docker by running `sudo docker run hello-world`. This should download and run the test container, printing "hello world" to your console.
  
      5. **Testing Docker Compose**
      
         The version of Docker Compose installed with Docker does not include a symlink to the `docker-compose` command. Use `docker compose` without a hyphen. Test your installation by running:
         ```sh
         docker compose -v
         ```
         This should print the version and build numbers to your console.
      6. **Running without Sudo**

         Follow Docker's instructions to run Docker commands without sudo: [Manage Docker as a non-root user](https://docs.docker.com/install/linux/linux-postinstall/#manage-docker-as-a-non-root-user).
        
      7. **Start on Boot**
        
         Configure Docker and its services to start automatically on boot by following Docker's instructions: [Configure Docker to start on boot](https://docs.docker.com/install/linux/linux-postinstall/#configure-docker-to-start-on-boot).
        
         You may need to restart your system before starting the course material.

* Kubernetes

  #### Windows:

  1. **Install Docker Desktop:**
  
     If you haven't already, install Docker Desktop by following the [Docker Desktop installation guide](https://www.docker.com/products/docker-desktop/).
  
  2. **Enable Kubernetes:**
  
     - Open Docker Desktop.
     - Go to `Settings` > `Kubernetes`.
     - Check the box next to `Enable Kubernetes`.
     - Click `Apply & Restart`.
  
  3. **Verify Kubernetes Installation:**
  
     Open PowerShell and run the following command to ensure Kubernetes is running:
     ```powershell
     kubectl version
     ```
  #### macOS

  1. **Install Docker Desktop:**
  
     If you haven't already, install Docker Desktop by following the [Docker Desktop installation guide](https://www.docker.com/products/docker-desktop/).
  
  2. **Enable Kubernetes:**
  
     - Open Docker Desktop.
     - Go to `Preferences` > `Kubernetes`.
     - Check the box next to `Enable Kubernetes`.
     - Click `Apply & Restart`.
  3. **Verify Kubernetes Installation:**
  
     Open a terminal and run the following command to ensure Kubernetes is running:
     ```sh
     kubectl version
     ```
     You should see both the Client and Server versions displayed.

  #### Linux

  1. **Install Docker Desktop:**
  
     If you haven't already, install Docker Desktop by following the [Docker Desktop installation guide](https://www.docker.com/products/docker-desktop/).

  2. Download the latest version of kubectl using the following command:
     ```sh
      curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
     ```
  3. Make the downloaded kubectl binary executable:
     ```sh
     sudo chmod +x ./kubectl
     ```
  4. Move the binary to a directory included in your PATH:
     ```sh
     sudo mv ./kubectl /usr/local/bin/kubectl
     ```
     You can check your PATH environment variable to see which directories are included:
     ```sh
     echo $PATH
     ```
     Choose one of the directories listed in the output, such as `/usr/local/bin`.
  6. Verify the installation:
     ```sh
     kubectl version
     ```
     As an alternative you can also follow the [kubectl installation guide](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/).
  
  ##### Install Minikube
  
  Minikube is a tool that lets you run Kubernetes locally.
  Refer to the following documentation on how to install minikube: [Minikube installation guide](https://minikube.sigs.k8s.io/docs/start/).

* Ingress Nginx

  Refer to the following [Ingress Nginx installation guide](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start).
  Make sure to copy the command from the `If you don't have Helm` section from the above link and run in your terminal:
  ```sh
  kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/cloud/deploy.yaml
  ```
