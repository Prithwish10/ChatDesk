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
        <li><a href="#prerequisites">Prerequisites</a></li>
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
