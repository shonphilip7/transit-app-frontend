A starter ionic-angular app that consumes API's generated in the <a href="https://github.com/shonphilip7/transit-app-api">Transit-app-api</a> repo.
## Prerequisites
1. Git
2. Docker
## Steps to run the app locally
1. Follow the steps in the repo <a href="https://github.com/shonphilip7/transit-app-api">transit-app-api</a> to run the API container.
2. Once the API container is up and running, git clone https://github.com/shonphilip7/transit-app-frontend .
3. cd transit-app-frontend
4. docker build -t sample-ionic-transit-app .
5. docker run -p 8100:80 sample-ionic-transit-app
<p>
  Once the frontend container is running, browse to http://localhost:8100/ to get to the login page. Create an account by clicking on the Register button and then login with the credentials. It should take you to the page showing arrival times for Vytilla.   
</p> 
