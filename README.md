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
<div align="center">
  <a href="https://github.com/Prithwish10/Chatdesk">
    <img src="images/Chatdesk_logo.png" alt="Logo" width="100" height="100">
  </a>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary><h3>Table of Contents</h3></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
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

Chatdesk is a versatile messaging application that seamlessly facilitates personal and group communication. The application leverage Kubernetes and Docker for streamlined deployment and management. Employed a microservices architecture with Docker containers to ensure seamless deployment and resource utilization. Kubernetes Ingress Nginx served as the gateway to the application, efficiently managing incoming requests and load balancing traffic to the socket server instances, achieving horizontal scaling and high availability. Leveraged Redis Pub/Sub to enable real-time communication, optimizing the socket server's performance for a rapidly expanding user base.

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
