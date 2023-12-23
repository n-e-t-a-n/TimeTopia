<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- INTRODUCTION -->
<br />
<div align="center">
  <a href="https://github.com/n-e-t-a-n/TimeTopia">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">TimeTopia</h3>

  <p align="center">
    An intuitive drag and drop schedule sharing website created with the MERN Stack
    <br />
    <a href="https://github.com/n-e-t-a-n/TimeTopia"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/n-e-t-a-n/TimeTopia/issues">Report Bug</a>
    ·
    <a href="https://github.com/n-e-t-a-n/TimeTopia/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
* ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
* ![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
* ![Apollo-GraphQL](https://img.shields.io/badge/-ApolloGraphQL-311C87?style=for-the-badge&logo=apollo-graphql)
* ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
* ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
* ![Nodemon](https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD)
* ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
* ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

If you'd like to test out this application and get a local copy up and running, please follow these simple example steps.

### Prerequisites

For this project, you will need to have the both node and the node package manager installed on your system.

You may confirm this by typing the following commands in a terminal:

  ```sh
  node -v
  
  v18.12.1
  ```

  ```sh
  npm -v
  
  9.2.0
  ```

### Installation

1. Clone the repo to your local system
   ```sh
   git clone https://github.com/n-e-t-a-n/TimeTopia.git
   ```
2. Set NPM config to gain access to Bryntum Calendar Component
   ```sh
   npm config set "@bryntum:registry=https://npm.bryntum.com/"
   npm login --auth-type=legacy --registry=https://npm.bryntum.com/
   
   Username: [YOUR_BRYNTUM_EMAIL]
   Password: [YOUR_BRYNTUM_PASSWORD]
   ```
3. Install dependencies in client and server
   ```sh
   cd client
   npm i
   
   cd ../server
   npm i
   ```

4. Create environment file for sensitive information
    ```env
    DB_USERNAME=[YOUR_DB_USERNAME]
    DB_PASSWORD=[YOUR_DB_PASSWORD]
    ```

5. (Optional) Add a .gitignore if you'd like to submit a pull request

6. Open 3 terminals and run the following commands
    ```sh
    cd client
    npm run dev
    ```
    ```sh
    cd server
    npm run start-exp
    ```
    ```sh
    cd server
    npm run start-gql
    ```

7. Visit http://localhost:5173

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://github.com/n-e-t-a-n/TimeTopia)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact Us

Nathan Arriesgado - 21100623@usc.edu.ph / nathan.arriesgado0g@gmail.com

Bianca Uytengsu - 21102386@usc.edu.ph / binkyuytengsu@gmail.com

Project Link: [https://github.com/n-e-t-a-n/TimeTopia](https://github.com/n-e-t-a-n/TimeTopia)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
<a name="readme-top"></a>

[contributors-shield]: https://img.shields.io/github/contributors/n-e-t-a-n/TimeTopia.svg?style=for-the-badge
[contributors-url]: https://github.com/n-e-t-a-n/TimeTopia/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/n-e-t-a-n/TimeTopia.svg?style=for-the-badge
[forks-url]: https://github.com/n-e-t-a-n/TimeTopia/network/members
[stars-shield]: https://img.shields.io/github/stars/n-e-t-a-n/TimeTopia.svg?style=for-the-badge
[stars-url]: https://github.com/n-e-t-a-n/TimeTopia/stargazers
[issues-shield]: https://img.shields.io/github/issues/n-e-t-a-n/TimeTopia.svg?style=for-the-badge
[issues-url]: https://github.com/n-e-t-a-n/TimeTopia/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/n-e-t-a-n/TimeTopia/blob/master/LICENSE.txt