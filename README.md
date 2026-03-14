A starter ionic-angular app to show arrival times for a station and the route the transit agency takes. The app consumes API's generated in the <a href="https://github.com/shonphilip7/transit-app-api">Transit-app-api</a> repo.
## Prerequisites
1. Git
2. Docker
3. Follow the steps in the repo <a href="https://github.com/shonphilip7/transit-app-api">transit-app-api</a> to run the API container.
4. Follow the steps in the <a href="https://github.com/shonphilip7/sample-transit-map">custom tiles repo</a> to generate the map
## Steps to run the app locally
1. Once the API containers in the pre-requisite are up and running, git clone https://github.com/shonphilip7/transit-app-frontend
2. cd transit-app-frontend
3. docker build -t sample-ionic-transit-app .
4. docker run -p 8100:80 sample-ionic-transit-app
<p>
  Once the frontend container is running, browse to http://localhost:8100/ to get to the login page. Create an account by clicking on the Register button and then login with the credentials. The app uses the default tabs template where tab 1 shows the arrival times for Vytilla station and tab 2 shows route map.   
</p> 
